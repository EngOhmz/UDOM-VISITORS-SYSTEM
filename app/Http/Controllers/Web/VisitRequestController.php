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

        $props = ['requests' => $requests];
        if ($request->user()->role === 'visitor') {
            $props['stats'] = $this->requestService->getVisitorStats($request->user()->id);
        }

        return Inertia::render('VisitRequests', $props);
    }

    public function verify(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:32',
        ]);

        $result = $this->requestService->validateVerificationCode($validated['code'], $request->user());

        if (!$result['valid']) {
            return response()->json([
                'error' => $result['error'],
                'message' => $result['error'],
            ], 422);
        }

        $visitRequest = $result['request'];
        $visitRequest->loadMissing(['visitor', 'office']);

        return response()->json([
            'request' => [
                'id' => $visitRequest->id,
                'purpose' => $visitRequest->purpose,
                'visit_date' => $visitRequest->visit_date
                    ? $visitRequest->visit_date->format('Y-m-d')
                    : null,
                'visit_time' => $visitRequest->visit_time,
                'status' => $visitRequest->status,
                'visitor' => $visitRequest->visitor ? [
                    'id' => $visitRequest->visitor->id,
                    'name' => $visitRequest->visitor->name,
                    'email' => $visitRequest->visitor->email,
                    'phone' => $visitRequest->visitor->phone,
                    'avatar' => $visitRequest->visitor->avatar,
                    'organization' => $visitRequest->visitor->organization,
                ] : null,
                'office' => $visitRequest->office ? [
                    'id' => $visitRequest->office->id,
                    'name' => $visitRequest->office->name,
                    'building' => $visitRequest->office->building,
                ] : null,
            ],
        ]);
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
