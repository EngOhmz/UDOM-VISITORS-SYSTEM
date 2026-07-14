import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
import StatCard from '../Components/StatCard';
import WelcomeBanner from '../Components/WelcomeBanner';
import {
    CheckIcon,
    XMarkIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    CalendarIcon,
    PlusIcon,
    ArrowDownTrayIcon,
    BuildingOfficeIcon,
    EnvelopeIcon,
} from '@heroicons/react/24/outline';
import { generateVisitPass } from '../utils/generateVisitPass';

function formatVisitTime(time) {
    if (!time) return null;
    const clean = String(time).split('.')[0];
    const [hours, minutes] = clean.split(':');
    if (!hours || minutes === undefined) return clean;
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    return `${h12}:${minutes.padStart(2, '0')} ${ampm}`;
}

function formatVisitDate(date) {
    return new Date(date).toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function isVisitToday(date) {
    if (!date) return false;
    const visit = new Date(date);
    const today = new Date();
    return (
        visit.getFullYear() === today.getFullYear()
        && visit.getMonth() === today.getMonth()
        && visit.getDate() === today.getDate()
    );
}

const STATUS = {
    approved: {
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: CheckCircleIcon,
        iconColor: 'text-emerald-500',
    },
    rejected: {
        badge: 'bg-red-50 text-red-700 border-red-200',
        icon: XCircleIcon,
        iconColor: 'text-red-500',
    },
    pending: {
        badge: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: ClockIcon,
        iconColor: 'text-amber-500',
    },
};

function StatusBadge({ status }) {
    const config = STATUS[status] || STATUS.pending;
    const Icon = config.icon;
    return (
        <span className={`udom-badge border inline-flex items-center gap-1.5 px-2.5 py-1 ${config.badge}`}>
            <Icon className={`w-3.5 h-3.5 ${config.iconColor}`} />
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}

function Pagination({ links }) {
    if (!links || links.length <= 3) return null;
    return (
        <div className="mt-8 flex justify-center gap-2 flex-wrap">
            {links.map((link, index) => {
                if (link.url === null) {
                    return (
                        <button
                            key={index}
                            disabled
                            className="px-4 py-2 bg-slate-100 text-slate-400 rounded-xl cursor-not-allowed text-sm font-medium"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }
                return (
                    <Link
                        key={index}
                        href={link.url}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                            link.active
                                ? 'bg-udom-700 text-white shadow-sm'
                                : 'bg-white text-slate-700 border border-slate-200 hover:bg-udom-50'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </div>
    );
}

function FilterPills({ filterStatus, onChange }) {
    const filters = [
        { key: '', label: 'All' },
        { key: 'pending', label: 'Pending' },
        { key: 'approved', label: 'Approved' },
        { key: 'rejected', label: 'Rejected' },
    ];

    return (
        <div className="flex flex-wrap gap-2">
            {filters.map(({ key, label }) => (
                <button
                    key={key || 'all'}
                    onClick={() => onChange(key)}
                    className={filterStatus === key ? 'udom-filter-active' : 'udom-filter-inactive'}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}

function VisitorAvatar({ visitor, size = 'md' }) {
    const sizes = { sm: 'w-10 h-10', md: 'w-12 h-12' };
    const px = size === 'sm' ? 48 : 56;
    return (
        <div className={`${sizes[size]} rounded-full overflow-hidden ring-2 ring-udom-100 shrink-0`}>
            {visitor?.avatar ? (
                <img src={visitor.avatar} alt={visitor?.name} className="w-full h-full object-cover" />
            ) : (
                <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(visitor?.name || 'Visitor')}&background=0060cc&color=fff&size=${px}`}
                    alt={visitor?.name}
                    className="w-full h-full object-cover"
                />
            )}
        </div>
    );
}

function VisitorStatusHint({ status, visitDate }) {
    if (status === 'pending') {
        return (
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2.5 text-sm text-amber-900">
                <ClockIcon className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <span>Your request is under review. You will receive a verification code by email once approved.</span>
            </div>
        );
    }

    if (status === 'approved') {
        const today = isVisitToday(visitDate);
        return (
            <div className={`mt-3 flex items-start gap-2 rounded-xl border px-3 py-2.5 text-sm ${
                today
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-udom-50 border-udom-200 text-udom-900'
            }`}>
                <CheckCircleIcon className={`w-4 h-4 shrink-0 mt-0.5 ${today ? 'text-emerald-600' : 'text-udom-600'}`} />
                <span>
                    {today
                        ? 'Today is your visit day. Present your code at the campus check-in desk.'
                        : 'Save your code and visit pass. Check-in is only available on your scheduled visit date.'}
                </span>
            </div>
        );
    }

    return null;
}

function VisitorRequestCard({ request, downloadingId, onDownload }) {
    const config = STATUS[request.status] || STATUS.pending;
    const StatusIcon = config.icon;
    const time = formatVisitTime(request.visit_time);
    const visitToday = isVisitToday(request.visit_date);

    return (
        <div className="udom-card p-5 hover:-translate-y-0.5">
            <div className="flex flex-col lg:flex-row lg:items-start gap-5">
                <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-3">
                        <StatusIcon className={`w-6 h-6 shrink-0 mt-0.5 ${config.iconColor}`} />
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h3 className="text-lg font-bold text-slate-900 truncate">
                                    {request.office?.name || 'Unknown Office'}
                                </h3>
                                <StatusBadge status={request.status} />
                                {visitToday && request.status === 'approved' && (
                                    <span className="udom-badge border bg-emerald-50 text-emerald-700 border-emerald-200">
                                        Visit Today
                                    </span>
                                )}
                            </div>
                            <p className="text-slate-600 text-sm">{request.purpose}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm">
                        <span className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-100">
                            <CalendarIcon className="w-4 h-4 text-udom-600" />
                            {formatVisitDate(request.visit_date)}
                            {time && <span className="text-udom-700 font-medium">· {time}</span>}
                        </span>
                    </div>
                    <VisitorStatusHint status={request.status} visitDate={request.visit_date} />
                </div>

                {request.verification_code && (
                    <div className="shrink-0 flex flex-col gap-2 w-full lg:w-auto">
                        <div className="bg-gradient-to-br from-udom-50 to-emerald-50 rounded-xl p-4 border border-udom-200 text-center min-w-[180px]">
                            <p className="text-[10px] font-bold text-udom-700 uppercase tracking-wider mb-1">Verification Code</p>
                            <p className="text-2xl font-mono font-bold text-udom-800 tracking-widest">{request.verification_code}</p>
                            <p className="text-[11px] text-udom-600 mt-2">Show at campus check-in</p>
                        </div>
                        <button
                            onClick={() => onDownload(request)}
                            disabled={downloadingId === request.id}
                            className="udom-btn-primary w-full py-2 text-sm disabled:opacity-60"
                        >
                            <ArrowDownTrayIcon className="w-4 h-4" />
                            {downloadingId === request.id ? 'Generating...' : 'Download Pass'}
                        </button>
                    </div>
                )}

                {request.rejection_reason && (
                    <div className="shrink-0 bg-red-50 rounded-xl p-4 border border-red-200 lg:max-w-xs">
                        <p className="text-[10px] font-bold text-red-700 uppercase tracking-wider mb-1">Rejection Reason</p>
                        <p className="text-sm text-slate-700">{request.rejection_reason}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function StaffRequestCard({ request, onApprove, onReject }) {
    const config = STATUS[request.status] || STATUS.pending;
    const time = formatVisitTime(request.visit_time);

    return (
        <div className="udom-card p-5">
            <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                    <VisitorAvatar visitor={request.visitor} />
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                            <h3 className="font-bold text-slate-900 truncate">{request.visitor?.name || 'Unknown Visitor'}</h3>
                            <StatusBadge status={request.status} />
                        </div>
                        {request.visitor?.email && (
                            <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                                <EnvelopeIcon className="w-3.5 h-3.5 shrink-0" />
                                {request.visitor.email}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                    <div className="bg-slate-50 rounded-lg px-3 py-2.5 border border-slate-100">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Office</p>
                        <p className="font-medium text-slate-800 flex items-center gap-1.5 truncate">
                            <BuildingOfficeIcon className="w-4 h-4 text-udom-600 shrink-0" />
                            {request.office?.name || '-'}
                        </p>
                    </div>
                    <div className="bg-slate-50 rounded-lg px-3 py-2.5 border border-slate-100">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Visit Date</p>
                        <p className="font-medium text-slate-800">{formatVisitDate(request.visit_date)}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg px-3 py-2.5 border border-slate-100">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Time</p>
                        <p className="font-medium text-slate-800">{time || '-'}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg px-3 py-2.5 border border-slate-100">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Code</p>
                        <p className="font-mono font-bold text-udom-800">{request.verification_code || '—'}</p>
                    </div>
                </div>

                <div className="bg-slate-50 rounded-lg px-3 py-2.5 border border-slate-100">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Purpose</p>
                    <p className="text-sm text-slate-700">{request.purpose}</p>
                </div>

                {request.status === 'pending' && (
                    <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
                        <button
                            onClick={() => onApprove(request.id)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-emerald-700 bg-emerald-50 rounded-xl hover:bg-emerald-100 border border-emerald-200 font-semibold text-sm transition"
                        >
                            <CheckIcon className="h-4 w-4" />
                            Approve
                        </button>
                        <button
                            onClick={() => onReject(request.id)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-red-700 bg-red-50 rounded-xl hover:bg-red-100 border border-red-200 font-semibold text-sm transition"
                        >
                            <XMarkIcon className="h-4 w-4" />
                            Reject
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

function EmptyState({ isVisitor }) {
    return (
        <div className="udom-card p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-udom-50 flex items-center justify-center">
                <CalendarIcon className="w-8 h-8 text-udom-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No requests found</h3>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                {isVisitor
                    ? 'Submit your first visit request to access the University of Dodoma campus.'
                    : 'No visit requests match the current filter.'}
            </p>
            {isVisitor && (
                <Link href={route('visitor.request.form')} className="udom-btn-primary">
                    <PlusIcon className="w-4 h-4" />
                    Create Request
                </Link>
            )}
        </div>
    );
}

export default function VisitRequests({ requests, stats = null }) {
    const { props, url } = usePage();
    const user = props.auth.user;
    const isVisitor = user.role === 'visitor';
    const [filterStatus, setFilterStatus] = useState(
        new URLSearchParams(url.split('?')[1] || '').get('status') || ''
    );
    const [approveModal, setApproveModal] = useState(null);
    const [rejectModal, setRejectModal] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [downloadingId, setDownloadingId] = useState(null);

    const downloadVerificationCode = async (request) => {
        setDownloadingId(request.id);
        try {
            await generateVisitPass({ ...request, visitor: user });
        } catch {
            alert('Failed to generate visit pass. Please try again.');
        } finally {
            setDownloadingId(null);
        }
    };

    const handleFilterChange = (status) => {
        setFilterStatus(status);
        router.get('/requests', { status: status || null }, { preserveState: true });
    };

    const handleApprove = () => {
        if (approveModal) {
            router.put(`/requests/${approveModal}/approve`, {}, {
                onSuccess: () => setApproveModal(null),
            });
        }
    };

    const handleReject = () => {
        if (rejectModal && rejectionReason.trim()) {
            router.put(`/requests/${rejectModal}/reject`, { rejection_reason: rejectionReason }, {
                onSuccess: () => {
                    setRejectModal(null);
                    setRejectionReason('');
                },
            });
        }
    };

    if (isVisitor) {
        return (
            <AuthenticatedLayout title="My Requests">
                <Head title="My Requests" />

                <WelcomeBanner
                    name={user.name}
                    role="visitor"
                    subtitle="Track your campus visit requests, verification codes, and approval status in one place."
                />

                {stats && (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                        <StatCard title="Total Requests" value={stats.total_requests} icon={CalendarIcon} color="blue" subtitle="All submissions" />
                        <StatCard title="Pending" value={stats.pending_requests} icon={ClockIcon} color="amber" subtitle="Awaiting approval" />
                        <StatCard title="Approved" value={stats.approved_requests} icon={CheckCircleIcon} color="emerald" subtitle="Ready to visit" />
                        <StatCard title="Rejected" value={stats.rejected_requests} icon={XCircleIcon} color="rose" subtitle="Not approved" />
                    </div>
                )}

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">My Visit Requests</h2>
                        <p className="text-sm text-slate-500">
                            Filter by status or download your visit pass when approved
                            {requests.total != null && (
                                <span className="text-udom-700 font-medium"> · {requests.total} total</span>
                            )}
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <FilterPills filterStatus={filterStatus} onChange={handleFilterChange} />
                        <Link href={route('visitor.request.form')} className="udom-btn-primary justify-center">
                            <PlusIcon className="w-5 h-5" />
                            New Request
                        </Link>
                    </div>
                </div>

                <div className="space-y-4">
                    {requests.data.length === 0 ? (
                        <EmptyState isVisitor />
                    ) : (
                        requests.data.map((request) => (
                            <VisitorRequestCard
                                key={request.id}
                                request={request}
                                downloadingId={downloadingId}
                                onDownload={downloadVerificationCode}
                            />
                        ))
                    )}
                </div>

                <Pagination links={requests.links} />
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout title="Visit Requests">
            <Head title="Visit Requests" />

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">Visit Requests</h2>
                    <p className="text-sm text-slate-500">
                        Review, approve, or reject incoming campus visit requests
                        {requests.total != null && (
                            <span className="text-udom-700 font-medium"> · {requests.total} total</span>
                        )}
                    </p>
                </div>
                <FilterPills filterStatus={filterStatus} onChange={handleFilterChange} />
            </div>

            <div className="space-y-4">
                {requests.data?.length === 0 ? (
                    <EmptyState isVisitor={false} />
                ) : (
                    requests.data.map((request) => (
                        <StaffRequestCard
                            key={request.id}
                            request={request}
                            onApprove={setApproveModal}
                            onReject={setRejectModal}
                        />
                    ))
                )}
            </div>

            <Pagination links={requests.links} />

            {/* Approve Modal */}
            {approveModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-udom-lg w-full max-w-md border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-emerald-50 to-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                                    <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Approve Request</h3>
                            </div>
                            <button onClick={() => setApproveModal(null)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-slate-600 leading-relaxed mb-6">
                                A verification code will be generated and emailed to the visitor. They can use it for check-in on the visit date.
                            </p>
                            <div className="flex gap-3">
                                <button onClick={() => setApproveModal(null)} className="flex-1 udom-btn-secondary py-2.5 text-sm">
                                    Cancel
                                </button>
                                <button onClick={handleApprove} className="flex-1 udom-btn-primary py-2.5 text-sm">
                                    Approve
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {rejectModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-udom-lg w-full max-w-md border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-red-50 to-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                                    <XCircleIcon className="w-6 h-6 text-red-600" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Reject Request</h3>
                            </div>
                            <button
                                onClick={() => { setRejectModal(null); setRejectionReason(''); }}
                                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Reason for rejection <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                rows={4}
                                className="udom-input resize-none mb-6"
                                placeholder="Explain why this visit cannot be approved..."
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={() => { setRejectModal(null); setRejectionReason(''); }}
                                    className="flex-1 udom-btn-secondary py-2.5 text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReject}
                                    disabled={!rejectionReason.trim()}
                                    className={`flex-1 py-2.5 rounded-xl font-semibold text-sm text-white transition ${
                                        rejectionReason.trim()
                                            ? 'bg-red-600 hover:bg-red-700'
                                            : 'bg-slate-300 cursor-not-allowed'
                                    }`}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
