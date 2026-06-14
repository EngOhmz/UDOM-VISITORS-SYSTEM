<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\VisitRequest;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class VisitorDashboardController extends Controller
{
    public function index()
    {
        $visitor = Auth::guard('visitor')->user();
        $requests = VisitRequest::with(['office', 'visitorLog'])->where('visitor_id', $visitor->id)->latest()->paginate(10);

        return Inertia::render('Visitor/Dashboard', ['requests' => $requests]);
    }
}
