import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
import { 
    UsersIcon, 
    BuildingOfficeIcon, 
    CalendarIcon, 
    ClipboardDocumentCheckIcon,
    PlusIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

export default function Dashboard({ stats }) {
    const { auth } = usePage().props;

    if (stats.is_visitor) {
        return (
            <AuthenticatedLayout title="Visitor Dashboard">
                <Head title="Visitor Dashboard" />

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Visitor Dashboard</h2>
                        <p className="mt-2 text-gray-600">Overview of your visit requests</p>
                    </div>
                    <Link
                        href={route('visitor.request.form')}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                    >
                        <PlusIcon className="w-5 h-5" />
                        New Request
                    </Link>
                </div>

                {/* Stats Grid for Visitors */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    <StatCard 
                        title="Total Requests" 
                        value={stats.total_requests} 
                        icon={CalendarIcon} 
                        color="blue" 
                        trend="All requests"
                    />
                    <StatCard 
                        title="Pending Requests" 
                        value={stats.pending_requests} 
                        icon={ClockIcon} 
                        color="yellow" 
                        trend="Awaiting approval"
                    />
                    <StatCard 
                        title="Approved Requests" 
                        value={stats.approved_requests} 
                        icon={CheckCircleIcon} 
                        color="green" 
                        trend="Approved visits"
                    />
                    <StatCard 
                        title="Rejected Requests" 
                        value={stats.rejected_requests} 
                        icon={XCircleIcon} 
                        color="red" 
                        trend="Not approved"
                    />
                </div>

                <div className="space-y-4">
                    {stats.requests.data.length === 0 ? (
                        <div className="bg-white rounded-xl shadow border border-gray-200 p-12 text-center">
                            <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No requests yet</h3>
                            <p className="text-gray-600 mb-6">Submit your first visit request to get started.</p>
                            <Link
                                href={route('visitor.request.form')}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                            >
                                <PlusIcon className="w-4 h-4" />
                                Create Request
                            </Link>
                        </div>
                    ) : (
                        stats.requests.data.map((request) => {
                            const getStatusIcon = (status) => {
                                switch (status) {
                                    case 'approved': return CheckCircleIcon;
                                    case 'rejected': return XCircleIcon;
                                    default: return ClockIcon;
                                }
                            };
                            const getStatusColor = (status) => {
                                switch (status) {
                                    case 'approved': return 'text-green-600';
                                    case 'rejected': return 'text-red-600';
                                    default: return 'text-yellow-600';
                                }
                            };
                            const getStatusBadge = (status) => {
                                switch (status) {
                                    case 'approved': return 'bg-green-100 text-green-800 border-green-300';
                                    case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
                                    default: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
                                }
                            };

                            const StatusIcon = getStatusIcon(request.status);
                            return (
                                <div
                                    key={request.id}
                                    className="bg-white rounded-xl shadow border border-gray-200 p-6"
                                >
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <StatusIcon className={`w-6 h-6 ${getStatusColor(request.status)}`} />
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {request.office?.name || 'Unknown Office'}
                                                </h3>
                                                <span
                                                    className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusBadge(request.status)}`}
                                                >
                                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 mb-4">{request.purpose}</p>
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <CalendarIcon className="w-4 h-4" />
                                                    <span>
                                                        {new Date(request.visit_date).toLocaleDateString()}
                                                        {request.visit_time && ` at ${request.visit_time}`}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {request.verification_code && (
                                            <div className="w-full sm:w-auto bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                                                <h4 className="text-sm font-semibold text-indigo-900 mb-1">Verification Code</h4>
                                                <p className="text-2xl font-mono font-bold text-indigo-700">{request.verification_code}</p>
                                            </div>
                                        )}

                                        {request.rejection_reason && (
                                            <div className="w-full sm:w-auto bg-red-50 rounded-lg p-4 border border-red-200">
                                                <h4 className="text-sm font-semibold text-red-900 mb-1">Rejection Reason</h4>
                                                <p className="text-gray-900">{request.rejection_reason}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {stats.requests.links.length > 3 && (
                    <div className="mt-8">
                        <div className="flex justify-center gap-1">
                            {stats.requests.links.map((link, index) => {
                                if (link.url === null) {
                                    return (
                                        <button
                                            key={index}
                                            disabled
                                            className="px-3 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed"
                                        >
                                            {link.label}
                                        </button>
                                    );
                                }
                                return (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`px-3 py-2 rounded-lg font-medium ${
                                            link.active
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout title="Dashboard Overview">
            <Head title="Dashboard" />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <StatCard 
                    title="Total Visitors" 
                    value={stats.total_visitors} 
                    icon={UsersIcon} 
                    color="blue" 
                    trend="All visitors"
                />
                <StatCard 
                    title="Pending Requests" 
                    value={stats.pending_requests} 
                    icon={CalendarIcon} 
                    color="yellow" 
                    trend="Awaiting approval"
                />
                <StatCard 
                    title="Today's Visits" 
                    value={stats.today_visits} 
                    icon={ClipboardDocumentCheckIcon} 
                    color="green" 
                    trend="Checked in today"
                />
                <StatCard 
                    title="Total Offices" 
                    value={stats.total_offices} 
                    icon={BuildingOfficeIcon} 
                    color="indigo" 
                    trend="Active offices"
                />
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Recent Requests */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800">Recent Visit Requests</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {stats.recent_requests && stats.recent_requests.length > 0 ? (
                            stats.recent_requests.map((request) => (
                                <div key={request.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {request.visitor?.name || 'Unknown Visitor'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {request.office?.name || 'Unknown Office'} • {new Date(request.visit_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {request.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-6 py-8 text-center text-gray-500">
                                No recent requests
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Logs */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800">Recent Visitor Logs</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {stats.recent_logs && stats.recent_logs.length > 0 ? (
                            stats.recent_logs.map((log) => (
                                <div key={log.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {log.visit_request?.visitor?.name || 'Unknown Visitor'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {log.visit_request?.office?.name || 'Unknown Office'}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            log.check_out_at ? 'bg-gray-100 text-gray-800' :
                                            'bg-green-100 text-green-800'
                                        }`}>
                                            {log.check_out_at ? 'Checked Out' : 'Currently In'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-6 py-8 text-center text-gray-500">
                                No recent logs
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function StatCard({ title, value, icon: Icon, color, trend }) {
    const colorVariants = {
        blue: 'bg-blue-50 text-blue-600',
        yellow: 'bg-yellow-50 text-yellow-600',
        green: 'bg-green-50 text-green-600',
        indigo: 'bg-indigo-50 text-indigo-600',
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${colorVariants[color]}`}>
                    <Icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {trend}
                </span>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            </div>
        </div>
    );
}
