<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\VisitorService;
use Illuminate\Http\Request;

class VisitorController extends Controller
{
    protected $visitorService;

    public function __construct(VisitorService $visitorService)
    {
        $this->visitorService = $visitorService;
    }

    public function index(Request $request)
    {
        $visitors = $this->visitorService->getAllVisitors();
        return $this->sendResponse($visitors, 'Visitors retrieved successfully.');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:visitors,email',
            'phone' => 'required|string|max:20',
            'id_number' => 'nullable|string|max:50',
            'organization' => 'nullable|string|max:255',
            'password' => 'required|string|min:6',
        ]);

        $visitor = $this->visitorService->createVisitor($validated);
        return $this->sendResponse($visitor, 'Visitor created successfully.');
    }

    public function show($id)
    {
        $visitor = $this->visitorService->getVisitorById($id);
        return $this->sendResponse($visitor, 'Visitor retrieved successfully.');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:visitors,email,' . $id,
            'phone' => 'required|string|max:20',
            'id_number' => 'nullable|string|max:50',
            'organization' => 'nullable|string|max:255',
            'password' => 'nullable|string|min:6',
        ]);

        $visitor = $this->visitorService->updateVisitor($id, $validated);
        return $this->sendResponse($visitor, 'Visitor updated successfully.');
    }

    public function destroy($id)
    {
        $this->visitorService->deleteVisitor($id);
        return $this->sendResponse(null, 'Visitor deleted successfully.');
    }
}
