<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Services\VisitorService;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
        return Inertia::render('Visitors', ['visitors' => $visitors]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:users,email',
            'phone' => 'required|string|max:20|unique:users,phone',
            'id_number' => 'nullable|string|max:50',
            'organization' => 'nullable|string|max:255',
            'password' => 'required|string|min:6',
        ]);

        $this->visitorService->createVisitor($validated);
        return redirect()->back()->with('success', 'Visitor created successfully.');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $id,
            'phone' => 'required|string|max:20|unique:users,phone,' . $id,
            'id_number' => 'nullable|string|max:50',
            'organization' => 'nullable|string|max:255',
            'password' => 'nullable|string|min:6',
        ]);

        $this->visitorService->updateVisitor($id, $validated);
        return redirect()->back()->with('success', 'Visitor updated successfully.');
    }

    public function destroy($id)
    {
        $this->visitorService->deleteVisitor($id);
        return redirect()->back()->with('success', 'Visitor deleted successfully.');
    }
}
