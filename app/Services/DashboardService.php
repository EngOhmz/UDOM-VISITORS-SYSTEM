<?php

namespace App\Services;

use App\Models\User;
use App\Models\VisitRequest;
use App\Models\VisitorLog;
use App\Models\Office;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class DashboardService
{
    public function getDashboardStats()
    {
        $today = Carbon::today();
        $user = Auth::user();
        
        if ($user->role === 'visitor') {
            // Visitor dashboard stats
            $totalRequests = VisitRequest::where('visitor_id', $user->id)->count();
            $pendingRequests = VisitRequest::where('visitor_id', $user->id)->where('status', 'pending')->count();
            $approvedRequests = VisitRequest::where('visitor_id', $user->id)->where('status', 'approved')->count();
            $rejectedRequests = VisitRequest::where('visitor_id', $user->id)->where('status', 'rejected')->count();
            
            $requests = VisitRequest::with(['office', 'visitorLog'])
                ->where('visitor_id', $user->id)
                ->latest()
                ->paginate(10);
                
            return [
                'is_visitor' => true,
                'total_requests' => $totalRequests,
                'pending_requests' => $pendingRequests,
                'approved_requests' => $approvedRequests,
                'rejected_requests' => $rejectedRequests,
                'requests' => $requests,
            ];
        }
        
        // Staff/admin dashboard stats
        $requestsQuery = VisitRequest::query();
        $logsQuery = VisitorLog::query();
        $visitorsQuery = User::where('role', 'visitor');
        
        if ($user->role !== 'admin' && $user->office_id) {
            $requestsQuery->where('office_id', $user->office_id);
            $logsQuery->whereHas('visitRequest', function ($q) use ($user) {
                $q->where('office_id', $user->office_id);
            });
            $visitorsQuery->whereHas('visitRequests', function ($q) use ($user) {
                $q->where('office_id', $user->office_id);
            });
        }
        
        $totalVisitors = $visitorsQuery->count();
        $pendingRequests = $requestsQuery->where('status', 'pending')->count();
        $todayVisits = $logsQuery->whereDate('check_in_at', $today)->count();
        $totalOffices = $user->role === 'admin' ? Office::count() : ($user->office ? 1 : 0);
        
        $recentRequests = $requestsQuery->with(['visitor', 'office'])
            ->latest()
            ->limit(5)
            ->get();
        
        $recentLogs = $logsQuery->with(['visitRequest.visitor', 'visitRequest.office'])
            ->latest()
            ->limit(5)
            ->get();
        
        return [
            'is_visitor' => false,
            'total_visitors' => $totalVisitors,
            'pending_requests' => $pendingRequests,
            'today_visits' => $todayVisits,
            'total_offices' => $totalOffices,
            'recent_requests' => $recentRequests,
            'recent_logs' => $recentLogs,
        ];
    }
}

