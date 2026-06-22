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
        // Temporarily dump the data for debugging
        // dd($logs->toArray());
        return Inertia::render('VisitorLogs', ['logs' => $logs]);
    }

    public function checkIn(Request $request)
    {
        $validated = $request->validate([
            'verification_code' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $result = $this->requestService->validateVerificationCode($validated['verification_code']);
        
        if (!$result['valid']) {
            return redirect()->route('logs.index')->with('error', $result['error']);
        }

        $this->logService->checkIn($result['request']->id, $request->user()->name, $validated['notes'] ?? null);
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
