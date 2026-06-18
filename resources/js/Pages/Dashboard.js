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
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 transition shadow-md hover:shadow-lg"
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
                        <div className="bg-white rounded-2xl shadow border border-gray-100 p-12 text-center">
                            <CalendarIcon className="w-20 h-20 text-gray-200 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">No requests yet</h3>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">Submit your first visit request to get started with UDOM Visitor Management System.</p>
                            <Link
                                href={route('visitor.request.form')}
                                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 transition shadow-md hover:shadow-lg"
                            >
                                <PlusIcon className="w-5 h-5" />
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
                                    case 'approved': return 'bg-green-50 text-green-700 border border-green-200';
                                    case 'rejected': return 'bg-red-50 text-red-700 border border-red-200';
                                    default: return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
                                }
                            };

                            const StatusIcon = getStatusIcon(request.status);
                            return (
                                <div
                                    key={request.id}
                                    className="bg-white rounded-2xl shadow border border-gray-100 p-8 hover:shadow-lg transition-all"
                                >
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-4">
                                                <StatusIcon className={`w-8 h-8 ${getStatusColor(request.status)}`} />
                                                <h3 className="text-xl font-bold text-gray-800">
                                                    {request.office?.name || 'Unknown Office'}
                                                </h3>
                                                <span
                                                    className={`px-4 py-1.5 text-sm font-semibold rounded-full ${getStatusBadge(request.status)}`}
                                                >
                                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 mb-6 text-lg">{request.purpose}</p>
                                            <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                                                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl">
                                                    <CalendarIcon className="w-5 h-5" />
                                                    <span>
                                                        {new Date(request.visit_date).toLocaleDateString()}
                                                        {request.visit_time && ` at ${request.visit_time}`}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {request.verification_code && (
                                            <div className="w-full sm:w-auto bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
                                                <h4 className="text-sm font-semibold text-indigo-800 mb-2">Verification Code</h4>
                                                <p className="text-3xl font-mono font-bold text-indigo-700">{request.verification_code}</p>
                                            </div>
                                        )}

                                        {request.rejection_reason && (
                                            <div className="w-full sm:w-auto bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-100">
                                                <h4 className="text-sm font-semibold text-red-800 mb-2">Rejection Reason</h4>
                                                <p className="text-gray-800">{request.rejection_reason}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {stats.requests.links.length > 3 && (
                    <div className="mt-10">
                        <div className="flex justify-center gap-2">
                            {stats.requests.links.map((link, index) => {
                                if (link.url === null) {
                                    return (
                                        <button
                                            key={index}
                                            disabled
                                            className="px-4 py-2 bg-gray-100 text-gray-400 rounded-xl cursor-not-allowed font-medium"
                                        >
                                            {link.label}
                                        </button>
                                    );
                                }
                                return (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`px-4 py-2 rounded-xl font-medium transition-all ${
                                            link.active
                                                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
                                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:shadow-sm'
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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
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
                <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                    <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <h3 className="text-xl font-bold text-gray-800">Recent Visit Requests</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {stats.recent_requests && stats.recent_requests.length > 0 ? (
                            stats.recent_requests.map((request) => (
                                <div key={request.id} className="px-6 py-5 hover:bg-gradient-to-r from-gray-50 to-white transition-all">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-base font-semibold text-gray-800">
                                                {request.visitor?.name || 'Unknown Visitor'}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {request.office?.name || 'Unknown Office'} • {new Date(request.visit_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
                                            request.status === 'approved' ? 'bg-green-50 text-green-700 border border-green-200' :
                                            request.status === 'rejected' ? 'bg-red-50 text-red-700 border border-red-200' :
                                            'bg-yellow-50 text-yellow-700 border border-yellow-200'
                                        }`}>
                                            {request.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-6 py-12 text-center text-gray-500">
                                No recent requests
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Logs */}
                <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                    <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <h3 className="text-xl font-bold text-gray-800">Recent Visitor Logs</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {stats.recent_logs && stats.recent_logs.length > 0 ? (
                            stats.recent_logs.map((log) => (
                                <div key={log.id} className="px-6 py-5 hover:bg-gradient-to-r from-gray-50 to-white transition-all">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-base font-semibold text-gray-800">
                                                {log.visit_request?.visitor?.name || 'Unknown Visitor'}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {log.visit_request?.office?.name || 'Unknown Office'}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
                                            log.check_out_at ? 'bg-gray-50 text-gray-700 border border-gray-200' :
                                            'bg-green-50 text-green-700 border border-green-200'
                                        }`}>
                                            {log.check_out_at ? 'Checked Out' : 'Currently In'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-6 py-12 text-center text-gray-500">
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
        blue: 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700',
        yellow: 'bg-gradient-to-br from-yellow-50 to-yellow-100 text-yellow-700',
        green: 'bg-gradient-to-br from-green-50 to-green-100 text-green-700',
        indigo: 'bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-700',
    };

    const bgVariants = {
        blue: 'from-blue-50 to-blue-50',
        yellow: 'from-yellow-50 to-yellow-50',
        green: 'from-green-50 to-green-50',
        indigo: 'from-indigo-50 to-indigo-50',
    };

    return (
        <div className="bg-white p-7 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-5">
                <div className={`p-4 rounded-2xl ${colorVariants[color]}`}>
                    <Icon className="h-7 w-7" />
                </div>
                <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                    {trend}
                </span>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
                <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
            </div>
        </div>
    );
}
