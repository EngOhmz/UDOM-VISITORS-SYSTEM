<?php

namespace App\Services;

use App\Models\VisitorLog;
use Illuminate\Support\Facades\Auth;

class ReportService
{
    public function getReportData(array $filters)
    {
        $user = Auth::user();
        $query = VisitorLog::with(['visitRequest.visitor', 'visitRequest.office']);

        if ($user->role !== 'admin' && $user->office_id) {
            $query->whereHas('visitRequest', function ($q) use ($user) {
                $q->where('office_id', $user->office_id);
            });
        }

        if (!empty($filters['date_from'])) {
            $query->whereDate('check_in_at', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->whereDate('check_in_at', '<=', $filters['date_to']);
        }

        if (!empty($filters['office_id'])) {
            $query->whereHas('visitRequest', function ($q) use ($filters) {
                $q->where('office_id', $filters['office_id']);
            });
        }

        return $query->latest()->get();
    }

    public function generateCsv($data)
    {
        $filename = 'visitor_report_' . date('Y-m-d_H-i-s') . '.csv';
        $handle = fopen('php://temp', 'w+');

        if ($handle === false) {
            throw new \RuntimeException('Unable to create export file.');
        }

        fputcsv($handle, ['ID', 'Visitor Name', 'Office', 'Check In', 'Check Out', 'Duration', 'Created At']);

        foreach ($data as $row) {
            fputcsv($handle, $this->formatCsvRow($row));
        }

        rewind($handle);
        $content = stream_get_contents($handle);
        fclose($handle);

        return [
            'content' => $content !== false ? $content : '',
            'filename' => $filename,
        ];
    }

    protected function formatCsvRow($row): array
    {
        $visitRequest = $row->visitRequest;
        $visitorName = '-';
        $officeName = '-';

        if ($visitRequest) {
            if ($visitRequest->relationLoaded('visitor') && $visitRequest->visitor) {
                $visitorName = $visitRequest->visitor->name ?: '-';
            }

            if ($visitRequest->relationLoaded('office') && $visitRequest->office) {
                $officeName = $visitRequest->office->name ?: '-';
            }
        }

        return [
            $row->id,
            $visitorName,
            $officeName,
            $this->formatDateTime($row->check_in_at),
            $this->formatDateTime($row->check_out_at),
            $row->duration ?: '-',
            $this->formatDateTime($row->created_at),
        ];
    }

    protected function formatDateTime($value): string
    {
        if (empty($value)) {
            return '-';
        }

        if ($value instanceof \DateTimeInterface) {
            return $value->format('Y-m-d H:i:s');
        }

        return (string) $value;
    }
}

