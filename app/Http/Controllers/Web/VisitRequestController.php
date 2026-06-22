<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Services\VisitRequestService;
use App\Services\OfficeService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VisitRequestController extends Controller
{
    protected $requestService;
    protected $officeService;

    public function __construct(VisitRequestService $requestService, OfficeService $officeService)
    {
        $this->requestService = $requestService;
        $this->officeService = $officeService;
    }

    public function index(Request $request)
    {
        $status = $request->input('status');
        $requests = $this->requestService->getAllRequests(10, $status);
        return Inertia::render('VisitRequests', ['requests' => $requests]);
    }

    public function verify(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string',
        ]);

        $result = $this->requestService->validateVerificationCode($validated['code']);
        
        if (!$result['valid']) {
            return response()->json(['error' => $result['error']], 422);
        }

        return response()->json(['request' => $result['request']]);
    }

    public function approve(Request $request, $id)
    {
        $result = $this->requestService->approveRequest($id, $request->user()->id);

        $message = $result['email_sent']
            ? 'Request approved. Verification code sent to the visitor\'s email.'
            : 'Request approved. Verification code generated (no email on file for this visitor).';

        return redirect()->route('requests.index')->with('success', $message);
    }

    public function reject(Request $request, $id)
    {
        $validated = $request->validate([
            'rejection_reason' => 'required|string',
        ]);

        $this->requestService->rejectRequest($id, $request->user()->id, $validated['rejection_reason']);
        return redirect()->route('requests.index')->with('success', 'Request rejected successfully.');
    }
}
