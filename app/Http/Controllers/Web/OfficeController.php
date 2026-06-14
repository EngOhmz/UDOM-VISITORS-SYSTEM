<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Services\OfficeService;
use App\Services\DepartmentService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OfficeController extends Controller
{
    protected $officeService;
    protected $departmentService;

    public function __construct(OfficeService $officeService, DepartmentService $departmentService)
    {
        $this->officeService = $officeService;
        $this->departmentService = $departmentService;
    }

    public function index()
    {
        $offices = $this->officeService->getAllOffices();
        $departments = $this->departmentService->getAllDepartmentsWithoutPagination();
        return Inertia::render('Offices', [
            'offices' => $offices,
            'departments' => $departments
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'department_id' => 'nullable|exists:departments,id',
            'building' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $this->officeService->createOffice($validated);
        return redirect()->route('offices.index')->with('success', 'Office created successfully.');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'department_id' => 'nullable|exists:departments,id',
            'building' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $this->officeService->updateOffice($id, $validated);
        return redirect()->route('offices.index')->with('success', 'Office updated successfully.');
    }

    public function destroy($id)
    {
        $this->officeService->deleteOffice($id);
        return redirect()->route('offices.index')->with('success', 'Office deleted successfully.');
    }
}
