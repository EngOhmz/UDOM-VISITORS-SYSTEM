<?php

namespace App\Services;

use App\Models\VisitRequest;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class VisitRequestService
{
    public function getAllRequests($perPage = 10, $status = null)
    {
        $user = Auth::user();
        $query = VisitRequest::with(['visitor', 'office', 'user', 'visitorLog']);
        
        if ($user->role === 'visitor') {
            $query->where('visitor_id', $user->id);
        } elseif ($user->role === 'staff' && $user->office_id) {
            $query->where('office_id', $user->office_id);
        }
        
        if ($status) {
            $query->where('status', $status);
        }
        return $query->latest()->paginate($perPage);
    }

    public function getVisitorRequests($visitorId, $perPage = 10)
    {
        return VisitRequest::where('visitor_id', $visitorId)
            ->with(['office', 'user'])
            ->latest()
            ->paginate($perPage);
    }

    public function getRequestById($id)
    {
        return VisitRequest::with(['visitor', 'office', 'user', 'visitorLog'])->findOrFail($id);
    }

    public function createRequest(array $data)
    {
        return VisitRequest::create($data);
    }

    public function approveRequest($id, $userId)
    {
        $request = VisitRequest::findOrFail($id);
        $request->update([
            'status' => 'approved',
            'user_id' => $userId,
            'verification_code' => strtoupper(Str::random(8)),
        ]);
        return $request;
    }

    public function rejectRequest($id, $userId, $reason)
    {
        $request = VisitRequest::findOrFail($id);
        $request->update([
            'status' => 'rejected',
            'user_id' => $userId,
            'rejection_reason' => $reason,
        ]);
        return $request;
    }

    public function verifyCode($code)
    {
        return VisitRequest::where('verification_code', $code)
            ->where('status', 'approved')
            ->whereDate('visit_date', '<=', now()->toDateString())
            ->first();
    }
}
