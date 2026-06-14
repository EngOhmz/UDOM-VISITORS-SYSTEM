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

    public function approve(Request $request, $id)
    {
        $this->requestService->approveRequest($id, $request->user()->id);
        return redirect()->route('requests.index')->with('success', 'Request approved successfully.');
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
