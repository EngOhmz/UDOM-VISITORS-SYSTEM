import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
import StatCard from '../Components/StatCard';
import WelcomeBanner from '../Components/WelcomeBanner';
import {
    UsersIcon,
    BuildingOfficeIcon,
    CalendarIcon,
    ClipboardDocumentCheckIcon,
    PlusIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    ArrowRightIcon,
    ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import { generateVisitPass } from '../utils/generateVisitPass';

export default function Dashboard({ stats }) {
    const { auth } = usePage().props;

    if (stats.is_visitor) {
        return (
            <AuthenticatedLayout title="Dashboard">
                <Head title="Dashboard" />

                <WelcomeBanner
                    name={auth.user.name}
                    role="visitor"
                    subtitle="Track your campus visit requests, verification codes, and approval status in one place."
                />

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">My Visit Requests</h2>
                        <p className="text-sm text-slate-500">Overview of all your submitted requests</p>
                    </div>
                    <Link href={route('visitor.request.form')} className="udom-btn-primary">
                        <PlusIcon className="w-5 h-5" />
                        New Request
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    <StatCard title="Total Requests" value={stats.total_requests} icon={CalendarIcon} color="blue" subtitle="All submissions" />
                    <StatCard title="Pending" value={stats.pending_requests} icon={ClockIcon} color="amber" subtitle="Awaiting approval" />
                    <StatCard title="Approved" value={stats.approved_requests} icon={CheckCircleIcon} color="emerald" subtitle="Ready to visit" />
                    <StatCard title="Rejected" value={stats.rejected_requests} icon={XCircleIcon} color="rose" subtitle="Not approved" />
                </div>

                <div className="space-y-4">
                    {stats.requests.data.length === 0 ? (
                        <div className="udom-card p-12 text-center">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-udom-50 flex items-center justify-center">
                                <CalendarIcon className="w-10 h-10 text-udom-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No requests yet</h3>
                            <p className="text-slate-500 mb-8 max-w-md mx-auto">
                                Submit your first visit request to access the University of Dodoma campus.
                            </p>
                            <Link href={route('visitor.request.form')} className="udom-btn-primary">
                                <PlusIcon className="w-5 h-5" />
                                Create Request
                            </Link>
                        </div>
                    ) : (
                        stats.requests.data.map((request) => (
                            <RequestCard key={request.id} request={request} visitor={auth.user} />
                        ))
                    )}
                </div>

                {stats.requests.links.length > 3 && (
                    <Pagination links={stats.requests.links} />
                )}
            </AuthenticatedLayout>
        );
    }

    const roleSubtitles = {
        admin: 'Full system overview — manage users, offices, visitors, and campus access.',
        staff: 'Monitor visit requests and campus activity for your department.',
        secretary: 'Process visit requests, confirm arrivals, and manage office visitors.',
    };

    return (
        <AuthenticatedLayout title="Dashboard">
            <Head title="Dashboard" />

            <WelcomeBanner
                name={auth.user.name}
                role={auth.user.role}
                subtitle={roleSubtitles[auth.user.role] || 'University of Dodoma Visitor Management System.'}
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <StatCard title="Total Visitors" value={stats.total_visitors} icon={UsersIcon} color="blue" subtitle="Registered visitors" />
                <StatCard title="Pending Requests" value={stats.pending_requests} icon={CalendarIcon} color="amber" subtitle="Needs action" />
                <StatCard title="Today's Visits" value={stats.today_visits} icon={ClipboardDocumentCheckIcon} color="emerald" subtitle="Checked in today" />
                <StatCard title="Active Offices" value={stats.total_offices} icon={BuildingOfficeIcon} color="gold" subtitle="Campus offices" />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="udom-card overflow-hidden">
                    <div className="udom-card-header flex items-center justify-between">
                        <h3 className="text-base font-bold text-slate-900">Recent Visit Requests</h3>
                        <Link href="/requests" className="text-sm font-medium text-udom-600 hover:text-udom-700 flex items-center gap-1">
                            View all <ArrowRightIcon className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {stats.recent_requests?.length > 0 ? (
                            stats.recent_requests.map((request) => (
                                <div key={request.id} className="px-6 py-4 hover:bg-slate-50/80 transition-colors">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-slate-900 truncate">
                                                {request.visitor?.name || 'Unknown Visitor'}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                {request.office?.name || 'Unknown Office'} · {new Date(request.visit_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <StatusBadge status={request.status} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <EmptyState message="No recent requests" />
                        )}
                    </div>
                </div>

                <div className="udom-card overflow-hidden">
                    <div className="udom-card-header flex items-center justify-between">
                        <h3 className="text-base font-bold text-slate-900">Recent Visitor Activity</h3>
                        <Link href="/logs" className="text-sm font-medium text-udom-600 hover:text-udom-700 flex items-center gap-1">
                            View all <ArrowRightIcon className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {stats.recent_logs?.length > 0 ? (
                            stats.recent_logs.map((log) => (
                                <div key={log.id} className="px-6 py-4 hover:bg-slate-50/80 transition-colors">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-slate-900 truncate">
                                                {log.visit_request?.visitor?.name || 'Unknown Visitor'}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                {log.visit_request?.office?.name || 'Unknown Office'}
                                            </p>
                                        </div>
                                        <span className={`udom-badge border ${
                                            log.check_out_at
                                                ? 'bg-slate-50 text-slate-600 border-slate-200'
                                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        }`}>
                                            {log.check_out_at ? 'Checked Out' : 'On Campus'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <EmptyState message="No recent activity" />
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function StatusBadge({ status }) {
    const styles = {
        approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        rejected: 'bg-red-50 text-red-700 border-red-200',
        pending: 'bg-amber-50 text-amber-700 border-amber-200',
    };
    return (
        <span className={`udom-badge border shrink-0 ${styles[status] || styles.pending}`}>
            {status}
        </span>
    );
}

function RequestCard({ request, visitor }) {
    const [downloading, setDownloading] = useState(false);
    const icons = { approved: CheckCircleIcon, rejected: XCircleIcon, pending: ClockIcon };
    const iconColors = { approved: 'text-emerald-500', rejected: 'text-red-500', pending: 'text-amber-500' };
    const StatusIcon = icons[request.status] || ClockIcon;

    const handleDownloadPass = async () => {
        setDownloading(true);
        try {
            await generateVisitPass({ ...request, visitor: visitor || request.visitor });
        } catch {
            alert('Failed to generate visit pass. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="udom-card p-6 hover:-translate-y-0.5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-5">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <StatusIcon className={`w-6 h-6 ${iconColors[request.status] || iconColors.pending}`} />
                        <h3 className="text-lg font-bold text-slate-900">{request.office?.name || 'Unknown Office'}</h3>
                        <StatusBadge status={request.status} />
                    </div>
                    <p className="text-slate-600 mb-4">{request.purpose}</p>
                    <div className="inline-flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        <CalendarIcon className="w-4 h-4 text-udom-600" />
                        {new Date(request.visit_date).toLocaleDateString()}
                        {request.visit_time && ` at ${request.visit_time}`}
                    </div>
                </div>

                {request.verification_code && (
                    <div className="shrink-0 flex flex-col gap-2">
                        <div className="bg-gradient-to-br from-udom-50 to-emerald-50 rounded-xl p-5 border border-udom-200 text-center">
                            <p className="text-xs font-semibold text-udom-700 uppercase tracking-wider mb-1">Verification Code</p>
                            <p className="text-2xl font-mono font-bold text-udom-800 tracking-widest">{request.verification_code}</p>
                        </div>
                        <button
                            onClick={handleDownloadPass}
                            disabled={downloading}
                            className="udom-btn-primary w-full py-2 text-sm disabled:opacity-60"
                        >
                            <ArrowDownTrayIcon className="w-4 h-4" />
                            {downloading ? 'Generating...' : 'Download Pass'}
                        </button>
                    </div>
                )}

                {request.rejection_reason && (
                    <div className="shrink-0 bg-red-50 rounded-xl p-5 border border-red-200 max-w-xs">
                        <p className="text-xs font-semibold text-red-700 uppercase tracking-wider mb-1">Rejection Reason</p>
                        <p className="text-sm text-slate-700">{request.rejection_reason}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function EmptyState({ message }) {
    return (
        <div className="px-6 py-10 text-center text-sm text-slate-400">{message}</div>
    );
}

function Pagination({ links }) {
    return (
        <div className="mt-8 flex justify-center gap-2">
            {links.map((link, index) => {
                if (link.url === null) {
                    return (
                        <button key={index} disabled className="px-4 py-2 bg-slate-100 text-slate-400 rounded-xl cursor-not-allowed text-sm font-medium">
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        </button>
                    );
                }
                return (
                    <Link
                        key={index}
                        href={link.url}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            link.active
                                ? 'bg-udom-700 text-white shadow-md'
                                : 'bg-white text-slate-700 border border-slate-200 hover:bg-udom-50'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </div>
    );
}
