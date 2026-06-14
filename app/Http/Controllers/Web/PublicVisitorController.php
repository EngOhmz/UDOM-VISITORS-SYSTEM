<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\VisitRequest;
use App\Models\Office;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class PublicVisitorController extends Controller
{
    public function showRequestForm()
    {
        $offices = Office::all();
        $departments = Department::all();
        return Inertia::render('Public/VisitorRequestForm', ['offices' => $offices, 'departments' => $departments]);
    }

    public function submitRequest(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'required|string|max:20',
            'id_number' => 'nullable|string|max:50',
            'organization' => 'nullable|string|max:255',
            'office_id' => 'required|exists:offices,id',
            'purpose' => 'required|string',
            'visit_date' => 'required|date',
            'visit_time' => 'nullable|date_format:H:i',
        ]);

        // Find or create visitor
        $visitor = User::firstOrCreate(
            ['phone' => $validated['phone']],
            [
                'name' => $validated['name'],
                'email' => $validated['email'],
                'id_number' => $validated['id_number'],
                'organization' => $validated['organization'],
                'role' => 'visitor',
                'password' => Hash::make(str()->random(16)), // Auto-generate password
            ]
        );

        // Create visit request
        $visitRequest = VisitRequest::create([
            'visitor_id' => $visitor->id,
            'office_id' => $validated['office_id'],
            'purpose' => $validated['purpose'],
            'visit_date' => $validated['visit_date'],
            'visit_time' => $validated['visit_time'],
            'status' => 'pending',
        ]);

        return redirect()->back()->with('success', 'Your visit request has been submitted. The verification code will be sent once approved.');
    }

    public function showStatus(Request $request)
    {
        $request->validate([
            'verification_code' => 'nullable|string|exists:visit_requests,verification_code',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
        ]);

        $requestData = null;
        if ($request->has('verification_code')) {
            $requestData = VisitRequest::with(['visitor', 'office'])->where('verification_code', $request->verification_code)->first();
        } elseif ($request->has('email') || $request->has('phone')) {
            $visitor = User::where('role', 'visitor')->where('email', $request->email)->orWhere('phone', $request->phone)->first();
            if ($visitor) {
                $requestData = VisitRequest::with(['office'])->where('visitor_id', $visitor->id)->latest()->first();
            }
        }

        return Inertia::render('Public/VisitorRequestStatus', ['request' => $requestData]);
    }
}
