<?php

namespace App\Services;

use App\Models\VisitorLog;
use App\Models\VisitRequest;
use Illuminate\Support\Facades\Auth;

class VisitorLogService
{
    public function getAllLogs($perPage = 10)
    {
        $user = Auth::user();
        $query = VisitorLog::with(['visitRequest.visitor', 'visitRequest.office']);
        
        if ($user->role === 'staff' && $user->office_id) {
            $query->whereHas('visitRequest', function ($q) use ($user) {
                $q->where('office_id', $user->office_id);
            });
        }
        
        return $query->latest()->paginate($perPage);
    }

    public function checkIn($visitRequestId, $checkedInBy, $notes = null)
    {
        $visitRequest = VisitRequest::findOrFail($visitRequestId);
        
        $log = VisitorLog::firstOrCreate(['visit_request_id' => $visitRequestId]);
        $log->update([
            'check_in_at' => now(),
            'checked_in_by' => $checkedInBy,
            'check_in_notes' => $notes,
        ]);
        
        return $log;
    }

    public function checkOut($visitRequestId, $checkedOutBy, $notes = null)
    {
        $log = VisitorLog::where('visit_request_id', $visitRequestId)
            ->whereNotNull('check_in_at')
            ->whereNull('check_out_at')
            ->firstOrFail();
        
        $log->update([
            'check_out_at' => now(),
            'checked_out_by' => $checkedOutBy,
            'check_out_notes' => $notes,
        ]);
        
        return $log;
    }
}
