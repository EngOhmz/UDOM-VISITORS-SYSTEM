<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\VisitRequest;
use App\Models\Office;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class VisitorRequestController extends Controller
{
    public function showRequestForm()
    {
        $offices = Office::all();
        $departments = Department::all();
        return Inertia::render('Visitor/RequestForm', ['offices' => $offices, 'departments' => $departments]);
    }

    public function submitRequest(Request $request)
    {
        $validated = $request->validate([
            'office_id' => 'required|exists:offices,id',
            'purpose' => 'required|string',
            'visit_date' => 'required|date',
            'visit_time' => 'nullable|date_format:H:i',
        ]);

        $visitor = Auth::user();

        VisitRequest::create([
            'visitor_id' => $visitor->id,
            'office_id' => $validated['office_id'],
            'purpose' => $validated['purpose'],
            'visit_date' => $validated['visit_date'],
            'visit_time' => $validated['visit_time'],
            'status' => 'pending',
        ]);

        return redirect()->route('requests.index')->with('success', 'Your visit request has been submitted.');
    }
}
