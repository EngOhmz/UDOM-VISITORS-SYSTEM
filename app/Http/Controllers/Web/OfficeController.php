<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Services\OfficeService;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
        return Inertia::render('Offices', ['offices' => $offices]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'department' => 'nullable|string|max:255',
            'building' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $this->officeService->createOffice($validated);
        return redirect()->back()->with('success', 'Office created successfully.');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'department' => 'nullable|string|max:255',
            'building' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $this->officeService->updateOffice($id, $validated);
        return redirect()->back()->with('success', 'Office updated successfully.');
    }

    public function destroy($id)
    {
        $this->officeService->deleteOffice($id);
        return redirect()->back()->with('success', 'Office deleted successfully.');
    }
}
