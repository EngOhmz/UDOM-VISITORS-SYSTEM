<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\OfficeService;
use Illuminate\Http\Request;

class OfficeController extends Controller
{
    protected $officeService;

    public function __construct(OfficeService $officeService)
    {
        $this->officeService = $officeService;
    }

    public function index()
    {
        $offices = $this->officeService->getAllOffices();
        return $this->sendResponse($offices, 'Offices retrieved successfully.');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'department' => 'nullable|string|max:255',
            'building' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $office = $this->officeService->createOffice($validated);
        return $this->sendResponse($office, 'Office created successfully.', 201);
    }

    public function show($id)
    {
        $office = $this->officeService->getOfficeById($id);
        return $this->sendResponse($office, 'Office retrieved successfully.');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'department' => 'nullable|string|max:255',
            'building' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $office = $this->officeService->updateOffice($id, $validated);
        return $this->sendResponse($office, 'Office updated successfully.');
    }

    public function destroy($id)
    {
        $this->officeService->deleteOffice($id);
        return $this->sendResponse(null, 'Office deleted successfully.');
    }
}
