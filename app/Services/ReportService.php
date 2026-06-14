<?php

namespace App\Services;

use App\Models\VisitorLog;
use Illuminate\Http\Request;
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
        $filename = "visitor_report_" . date('Y-m-d_H-i-s') . ".csv";
        $handle = fopen('php://temp', 'w+');
        
        // Add headers
        fputcsv($handle, ['ID', 'Visitor Name', 'Office', 'Check In', 'Check Out', 'Duration', 'Created At']);

        foreach ($data as $row) {
            fputcsv($handle, [
                $row->id,
                $row->visitRequest->visitor->name,
                $row->visitRequest->office->name,
                $row->check_in_at,
                $row->check_out_at,
                $row->duration,
                $row->created_at,
            ]);
        }

        rewind($handle);
        $content = stream_get_contents($handle);
        fclose($handle);

        return [
            'content' => $content,
            'filename' => $filename
        ];
    }
}

