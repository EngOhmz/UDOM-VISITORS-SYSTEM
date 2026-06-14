<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Services\VisitorLogService;
use App\Services\VisitRequestService;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
        return Inertia::render('VisitorLogs', ['logs' => $logs]);
    }

    public function checkIn(Request $request)
    {
        $validated = $request->validate([
            'verification_code' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $visitRequest = $this->requestService->verifyCode($validated['verification_code']);
        
        if (!$visitRequest) {
            return redirect()->route('logs.index')->with('error', 'Invalid or expired verification code.');
        }

        if ($visitRequest->visitorLog && $visitRequest->visitorLog->check_in_at) {
            return redirect()->route('logs.index')->with('error', 'Visitor already checked in.');
        }

        $this->logService->checkIn($visitRequest->id, $request->user()->name, $validated['notes'] ?? null);
        return redirect()->route('logs.index')->with('success', 'Visitor checked in successfully.');
    }

    public function checkOut(Request $request, $logId)
    {
        $validated = $request->validate([
            'notes' => 'nullable|string',
        ]);

        $this->logService->checkOut($logId, $request->user()->name, $validated['notes'] ?? null);
        return redirect()->route('logs.index')->with('success', 'Visitor checked out successfully.');
    }
}
