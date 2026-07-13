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

        $result = $this->requestService->validateVerificationCode($validated['verification_code'], $request->user());
        
        if (!$result['valid']) {
            return $this->sendError($result['error'], [], 422);
        }

        $log = $this->logService->checkIn($result['request']->id, $request->user()->name, $validated['notes'] ?? null);
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
