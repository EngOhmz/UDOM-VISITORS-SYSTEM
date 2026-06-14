<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\VisitRequestService;
use Illuminate\Http\Request;

class VisitRequestController extends Controller
{
    protected $requestService;

    public function __construct(VisitRequestService $requestService)
    {
        $this->requestService = $requestService;
    }

    public function index(Request $request)
    {
        $status = $request->input('status');
        $requests = $this->requestService->getAllRequests(10, $status);
        return $this->sendResponse($requests, 'Visit requests retrieved successfully.');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'visitor_id' => 'required|exists:visitors,id',
            'office_id' => 'required|exists:offices,id',
            'purpose' => 'required|string',
            'notes' => 'nullable|string',
            'visit_date' => 'required|date',
            'visit_time' => 'nullable|date_format:H:i',
        ]);

        $visitRequest = $this->requestService->createRequest($validated);
        return $this->sendResponse($visitRequest, 'Visit request submitted successfully.', 201);
    }

    public function show($id)
    {
        $request = $this->requestService->getRequestById($id);
        return $this->sendResponse($request, 'Visit request retrieved successfully.');
    }

    public function approve(Request $request, $id)
    {
        $visitRequest = $this->requestService->approveRequest($id, $request->user()->id);
        return $this->sendResponse($visitRequest, 'Visit request approved successfully.');
    }

    public function reject(Request $request, $id)
    {
        $validated = $request->validate([
            'rejection_reason' => 'required|string',
        ]);

        $visitRequest = $this->requestService->rejectRequest($id, $request->user()->id, $validated['rejection_reason']);
        return $this->sendResponse($visitRequest, 'Visit request rejected successfully.');
    }
}
