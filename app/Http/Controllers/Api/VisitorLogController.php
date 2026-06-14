<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\VisitorLogService;
use App\Services\VisitRequestService;
use Illuminate\Http\Request;

class VisitorLogController extends Controller
{
    protected $logService;
    protected $requestService;

    public function __construct(VisitorLogService $logService, VisitRequestService $requestService)
    {
        $this->logService = $logService;
        $this->requestService = $requestService;
    }

    public function index()
    {
        $logs = $this->logService->getAllLogs();
        return $this->sendResponse($logs, 'Visitor logs retrieved successfully.');
    }

    public function checkIn(Request $request)
    {
        $validated = $request->validate([
            'verification_code' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $visitRequest = $this->requestService->verifyCode($validated['verification_code']);
        
        if (!$visitRequest) {
            return $this->sendError('Invalid or expired verification code.', [], 404);
        }

        if ($visitRequest->visitorLog && $visitRequest->visitorLog->check_in_at) {
            return $this->sendError('Visitor already checked in.', [], 400);
        }

        $log = $this->logService->checkIn($visitRequest->id, $request->user()->name, $validated['notes'] ?? null);
        return $this->sendResponse($log, 'Visitor checked in successfully.');
    }

    public function checkOut(Request $request, $id)
    {
        $validated = $request->validate([
            'notes' => 'nullable|string',
        ]);

        $log = $this->logService->checkOut($id, $request->user()->name, $validated['notes'] ?? null);
        return $this->sendResponse($log, 'Visitor checked out successfully.');
    }
}
