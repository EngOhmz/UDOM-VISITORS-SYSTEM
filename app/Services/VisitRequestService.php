<?php

namespace App\Services;

use App\Mail\VisitVerificationCodeMail;
use App\Models\VisitRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
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

    public function getVisitorStats($visitorId)
    {
        return [
            'total_requests' => VisitRequest::where('visitor_id', $visitorId)->count(),
            'pending_requests' => VisitRequest::where('visitor_id', $visitorId)->where('status', 'pending')->count(),
            'approved_requests' => VisitRequest::where('visitor_id', $visitorId)->where('status', 'approved')->count(),
            'rejected_requests' => VisitRequest::where('visitor_id', $visitorId)->where('status', 'rejected')->count(),
        ];
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
        $request = VisitRequest::with(['visitor', 'office'])->findOrFail($id);
        $request->update([
            'status' => 'approved',
            'user_id' => $userId,
            'verification_code' => strtoupper(Str::random(8)),
        ]);
        $request->refresh()->load(['visitor', 'office']);

        $emailSent = $this->sendVerificationEmail($request);

        return [
            'request' => $request,
            'email_sent' => $emailSent,
        ];
    }

    protected function sendVerificationEmail(VisitRequest $request): bool
    {
        $visitor = $request->visitor;
        if (!$visitor || empty($visitor->email)) {
            return false;
        }

        try {
            Mail::to($visitor->email)->send(new VisitVerificationCodeMail($request));
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send verification email: ' . $e->getMessage());
            return false;
        }
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

    public function validateVerificationCode(string $code, $user = null): array
    {
        $normalizedCode = strtoupper(trim($code));

        if ($normalizedCode === '') {
            return [
                'valid' => false,
                'error' => 'Please enter a verification code.',
            ];
        }

        $request = VisitRequest::with(['visitor', 'office', 'visitorLog'])
            ->whereRaw('UPPER(TRIM(verification_code)) = ?', [$normalizedCode])
            ->first();

        if (!$request) {
            return [
                'valid' => false,
                'error' => 'Invalid verification code. Please check the code and try again.',
            ];
        }

        if ($request->status === 'pending') {
            return [
                'valid' => false,
                'error' => 'This visit request is still pending approval. The visitor cannot be checked in until it is approved.',
            ];
        }

        if ($request->status === 'rejected') {
            $reason = $request->rejection_reason
                ? ' Reason: ' . $request->rejection_reason
                : '';

            return [
                'valid' => false,
                'error' => 'This visit request was rejected and cannot be used for check-in.' . $reason,
            ];
        }

        if ($request->status !== 'approved') {
            return [
                'valid' => false,
                'error' => 'This visit request is not approved. The visitor cannot be checked in until it is approved.',
            ];
        }

        if ($user && method_exists($user, 'appliesOfficeScope') && $user->appliesOfficeScope()) {
            if ((int) $request->office_id !== (int) $user->office_id) {
                return [
                    'valid' => false,
                    'error' => 'This visitor is scheduled for a different office. Only visitors for your office can be checked in here.',
                ];
            }
        }

        $visitDate = $request->visit_date->format('Y-m-d');
        $today = now()->toDateString();
        $formattedDate = $request->visit_date->format('l, F j, Y');

        if ($visitDate > $today) {
            return [
                'valid' => false,
                'error' => "Check-in is not open yet. This visit is scheduled for {$formattedDate}. Check-in is only allowed on the visit date.",
            ];
        }

        if ($visitDate < $today) {
            return [
                'valid' => false,
                'error' => "The visit date has passed ({$formattedDate}). Check-in is only allowed on the scheduled visit date. Please contact the office for assistance.",
            ];
        }

        if ($request->visitorLog && $request->visitorLog->check_in_at) {
            return [
                'valid' => false,
                'error' => 'This visitor has already been checked in.',
            ];
        }

        return [
            'valid' => true,
            'request' => $request,
        ];
    }

    public function verifyCode($code)
    {
        $result = $this->validateVerificationCode($code);

        return $result['valid'] ? $result['request'] : null;
    }
}
