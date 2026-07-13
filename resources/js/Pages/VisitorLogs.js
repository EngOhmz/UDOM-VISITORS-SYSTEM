import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
import {
    CheckIcon,
    ArrowRightOnRectangleIcon,
    UserIcon,
    BuildingOfficeIcon,
    ClockIcon,
    CalendarIcon,
    XMarkIcon,
    EnvelopeIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline';

function formatVisitTime(time) {
    if (!time) return '-';
    const clean = String(time).split('.')[0];
    const [hours, minutes] = clean.split(':');
    if (!hours || minutes === undefined) return clean;
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    return `${h12}:${minutes.padStart(2, '0')} ${ampm}`;
}

function formatDuration(log) {
    if (log.duration) return log.duration;
    if (!log.check_in_at || !log.check_out_at) return 'Still on campus';

    const start = new Date(log.check_in_at);
    const end = new Date(log.check_out_at);
    const totalMinutes = Math.max(0, Math.floor((end - start) / 60000));

    if (totalMinutes < 1) return 'Less than 1 min';

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0 && minutes > 0) {
        return `${hours} hr${hours > 1 ? 's' : ''} ${minutes} min${minutes > 1 ? 's' : ''}`;
    }
    if (hours > 0) return `${hours} hr${hours > 1 ? 's' : ''}`;
    return `${minutes} min${minutes > 1 ? 's' : ''}`;
}

function closeCheckInModal(setters) {
    setters.setIsCheckInModalOpen(false);
    setters.setVerificationCode('');
    setters.setCheckInNotes('');
    setters.setVisitRequestPreview(null);
    setters.setErrorMessage('');
}

function extractApiError(payload) {
    if (!payload) {
        return 'Unable to verify this code. Please try again.';
    }
    if (typeof payload === 'string') {
        return payload;
    }
    if (payload.error) {
        return payload.error;
    }
    if (payload.message) {
        return payload.message;
    }
    if (payload.errors) {
        const first = Object.values(payload.errors).flat()[0];
        if (first) {
            return first;
        }
    }
    return 'Unable to verify this code. Please try again.';
}

function VisitorPreviewCard({ request }) {
    const visitor = request.visitor;
    const office = request.office;

    return (
        <div className="rounded-xl border border-udom-200 overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-udom-800 to-udom-700 px-4 py-2.5 flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-gold-400 shrink-0" />
                <span className="text-xs font-semibold text-white tracking-wide uppercase">Verified Visitor</span>
            </div>
            <div className="bg-gradient-to-br from-udom-50 to-white p-4">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-udom-200 shrink-0">
                        {visitor?.avatar ? (
                            <img src={visitor.avatar} alt={visitor?.name} className="w-full h-full object-cover" />
                        ) : (
                            <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(visitor?.name || 'Visitor')}&background=0a5c3c&color=fff&size=56`}
                                alt={visitor?.name}
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900 truncate">{visitor?.name || '-'}</p>
                        {visitor?.email && (
                            <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                                <EnvelopeIcon className="w-3.5 h-3.5 shrink-0" />
                                {visitor.email}
                            </p>
                        )}
                    </div>
                </div>
                <dl className="space-y-2.5 text-sm">
                    <div className="flex items-start gap-2.5">
                        <BuildingOfficeIcon className="w-4 h-4 text-udom-600 mt-0.5 shrink-0" />
                        <div className="min-w-0">
                            <dt className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Office</dt>
                            <dd className="font-medium text-slate-800 truncate">{office?.name || '-'}</dd>
                        </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                        <CalendarIcon className="w-4 h-4 text-udom-600 mt-0.5 shrink-0" />
                        <div className="min-w-0">
                            <dt className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Visit Date & Time</dt>
                            <dd className="font-medium text-slate-800">
                                {new Date(request.visit_date).toLocaleDateString(undefined, {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                                {request.visit_time && (
                                    <span className="text-udom-700"> · {formatVisitTime(request.visit_time)}</span>
                                )}
                            </dd>
                        </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                        <UserIcon className="w-4 h-4 text-udom-600 mt-0.5 shrink-0" />
                        <div className="min-w-0">
                            <dt className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Purpose</dt>
                            <dd className="font-medium text-slate-800 line-clamp-2">{request.purpose || '-'}</dd>
                        </div>
                    </div>
                </dl>
            </div>
        </div>
    );
}

export default function VisitorLogs({ logs }) {
    const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
    const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(null);
    const [verificationCode, setVerificationCode] = useState('');
    const [checkInNotes, setCheckInNotes] = useState('');
    const [checkOutNotes, setCheckOutNotes] = useState('');
    const [visitRequestPreview, setVisitRequestPreview] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [checkOutProcessing, setCheckOutProcessing] = useState(false);
    const [checkOutError, setCheckOutError] = useState('');

    const handleCodeInput = (e) => {
        const code = e.target.value.toUpperCase().replace(/\s/g, '');
        setVerificationCode(code);
        setErrorMessage('');
        setVisitRequestPreview(null);

        if (code.length === 8) {
            // GET + relative URL: avoids CSRF mismatch (localhost vs 127.0.0.1)
            window.axios.get('/requests/verify', { params: { code } })
                .then(({ data }) => {
                    if (data.request) {
                        setVisitRequestPreview(data.request);
                        setErrorMessage('');
                    }
                })
                .catch((error) => {
                    setVisitRequestPreview(null);
                    setErrorMessage(extractApiError(error.response?.data));
                });
        }
    };

    const handleCheckIn = (e) => {
        e.preventDefault();
        if (!visitRequestPreview) {
            setErrorMessage('Please enter a valid verification code before checking in.');
            return;
        }
        router.post('/logs/check-in', {
            verification_code: verificationCode,
            notes: checkInNotes,
        }, {
            onSuccess: () => {
                setIsCheckInModalOpen(false);
                setVerificationCode('');
                setCheckInNotes('');
                setVisitRequestPreview(null);
                setErrorMessage('');
            },
            onError: (errors) => {
                if (errors) {
                    setErrorMessage(Object.values(errors)[0] || 'An error occurred.');
                }
            }
        });
    };

    const handleCheckOut = () => {
        if (!isCheckOutModalOpen) return;
        setCheckOutProcessing(true);
        setCheckOutError('');
        router.put(route('logs.check-out', isCheckOutModalOpen), {
            notes: checkOutNotes,
        }, {
            onSuccess: () => {
                setIsCheckOutModalOpen(null);
                setCheckOutNotes('');
            },
            onError: () => {
                setCheckOutError('Failed to check out visitor. The visitor may already be checked out.');
            },
            onFinish: () => setCheckOutProcessing(false),
        });
    };

    return (
        <AuthenticatedLayout title="Visitor Confirmation">
            <Head title="Visitor Confirmation" />

            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Visitor Confirmation</h2>
                    <p className="mt-2 text-gray-600">Manage visitor check-ins and check-outs</p>
                </div>
                <button
                    onClick={() => setIsCheckInModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-udom-700 text-white rounded-xl font-semibold hover:bg-udom-800 transition shadow-md"
                >
                    <CheckIcon className="h-5 w-5" />
                    Check In Visitor
                </button>
            </div>

            <div className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Visitor</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Office</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Check In</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Check Out</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Duration</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {logs.data?.map((log) => (
                                <tr key={log.id} className="hover:bg-gradient-to-r from-slate-50 to-udom-50 transition-all">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-udom-100 shadow-sm">
                                                {log.visit_request?.visitor?.avatar ? (
                                                    <img 
                                                        src={log.visit_request.visitor.avatar} 
                                                        alt={log.visit_request.visitor?.name} 
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <img 
                                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(log.visit_request?.visitor?.name || 'Visitor')}&background=0a5c3c&color=fff&size=48`}
                                                        alt={log.visit_request.visitor?.name} 
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-800">{log.visit_request?.visitor?.name || '-'}</div>
                                                {log.check_in_notes && (
                                                    <div className="text-xs text-gray-500 mt-1">{log.check_in_notes}</div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <BuildingOfficeIcon className="w-5 h-5 text-udom-600" />
                                            {log.visit_request?.office?.name || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {log.check_in_at ? (
                                            <div>
                                                <div className="font-medium text-gray-800">{new Date(log.check_in_at).toLocaleDateString()}</div>
                                                <div className="text-xs text-gray-500">{new Date(log.check_in_at).toLocaleTimeString()}</div>
                                            </div>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {log.check_out_at ? (
                                            <div>
                                                <div className="font-medium text-gray-800">{new Date(log.check_out_at).toLocaleDateString()}</div>
                                                <div className="text-xs text-gray-500">{new Date(log.check_out_at).toLocaleTimeString()}</div>
                                                {log.check_out_notes && (
                                                    <div className="text-xs text-gray-500 mt-1">{log.check_out_notes}</div>
                                                )}
                                            </div>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                        <div className="flex items-center gap-2">
                                            <ClockIcon className="w-5 h-5 text-udom-600 shrink-0" />
                                            {formatDuration(log)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-4 py-1.5 text-xs font-semibold rounded-full border ${
                                            log.check_out_at
                                                ? 'bg-gray-100 text-gray-700 border-gray-300'
                                                : log.check_in_at
                                                    ? 'bg-green-100 text-green-700 border-green-300'
                                                    : 'bg-amber-100 text-amber-700 border-amber-300'
                                        }`}>
                                            {log.check_out_at ? 'Completed' : log.check_in_at ? 'Checked In' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {log.check_in_at && !log.check_out_at ? (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsCheckOutModalOpen(log.id);
                                                    setCheckOutNotes('');
                                                    setCheckOutError('');
                                                }}
                                                className="flex items-center gap-2 px-4 py-2 text-orange-700 bg-orange-50 rounded-xl hover:bg-orange-100 transition border border-orange-200 font-medium shadow-sm"
                                            >
                                                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                                                Check Out
                                            </button>
                                        ) : log.check_out_at ? (
                                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                                <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                                                Done
                                            </span>
                                        ) : (
                                            <span className="text-xs text-slate-400">No action</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {logs.data?.length === 0 && (
                    <div className="p-16 text-center">
                        <ClockIcon className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">No visitor logs yet</h3>
                        <p className="text-gray-600 text-lg">Check in your first visitor to get started.</p>
                    </div>
                )}
            </div>

            {/* Check In Modal */}
            {isCheckInModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-udom-lg w-full max-w-md max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-udom-50 to-white shrink-0">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Check In Visitor</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Enter verification code to confirm identity</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => closeCheckInModal({
                                    setIsCheckInModalOpen,
                                    setVerificationCode,
                                    setCheckInNotes,
                                    setVisitRequestPreview,
                                    setErrorMessage,
                                })}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCheckIn} className="flex flex-col flex-1 min-h-0">
                            <div className="overflow-y-auto flex-1 p-5 space-y-4">
                                    {errorMessage && (
                                        <div className="flex gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                                            <ClockIcon className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
                                            <p className="text-sm leading-relaxed">{errorMessage}</p>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                            Verification Code
                                        </label>
                                        <input
                                            type="text"
                                            value={verificationCode}
                                            onChange={handleCodeInput}
                                            maxLength={8}
                                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-udom-500/30 transition-all text-sm font-mono tracking-wider uppercase ${
                                                errorMessage ? 'border-amber-300 bg-amber-50/50' : 'border-slate-200 focus:border-udom-500'
                                            }`}
                                            placeholder="8-character code (e.g. ABC12345)"
                                            autoFocus
                                            required
                                        />
                                        <p className="text-xs text-slate-500 mt-1.5">Enter the full 8-character code from the visitor&apos;s approval email.</p>
                                    </div>

                                {visitRequestPreview && (
                                    <VisitorPreviewCard request={visitRequestPreview} />
                                )}

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                        Notes <span className="font-normal text-slate-400">(optional)</span>
                                    </label>
                                    <textarea
                                        value={checkInNotes}
                                        onChange={(e) => setCheckInNotes(e.target.value)}
                                        rows={2}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-udom-500/30 focus:border-udom-500 text-sm resize-none"
                                        placeholder="Any notes for this check-in"
                                    />
                                </div>
                            </div>

                            <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex gap-3 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => closeCheckInModal({
                                        setIsCheckInModalOpen,
                                        setVerificationCode,
                                        setCheckInNotes,
                                        setVisitRequestPreview,
                                        setErrorMessage,
                                    })}
                                    className="flex-1 px-4 py-2.5 text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition font-semibold text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!visitRequestPreview}
                                    className={`flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                                        visitRequestPreview
                                            ? 'udom-btn-primary py-2.5'
                                            : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                                    }`}
                                >
                                    Check In
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Check Out Modal */}
            {isCheckOutModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
                        <div className="px-8 py-5 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-orange-50 to-white">
                            <h3 className="text-2xl font-bold text-gray-800">Check Out Visitor</h3>
                            <button
                                onClick={() => {
                                    setIsCheckOutModalOpen(null);
                                    setCheckOutNotes('');
                                    setCheckOutError('');
                                }}
                                className="text-gray-500 hover:text-gray-700 transition"
                            >
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="p-8">
                            <div className="space-y-6">
                                {checkOutError && (
                                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{checkOutError}</p>
                                )}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                                        Notes (Optional)
                                    </label>
                                    <textarea
                                        value={checkOutNotes}
                                        onChange={(e) => setCheckOutNotes(e.target.value)}
                                        rows={4}
                                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all bg-white shadow-sm"
                                        placeholder="Add any notes about this check-out"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4 mt-10">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCheckOutModalOpen(null);
                                        setCheckOutNotes('');
                                        setCheckOutError('');
                                    }}
                                    className="px-7 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition font-semibold shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCheckOut}
                                    disabled={checkOutProcessing}
                                    className="px-7 py-3 text-white bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl hover:from-orange-700 hover:to-orange-800 transition font-semibold shadow-md disabled:opacity-60"
                                >
                                    {checkOutProcessing ? 'Checking Out...' : 'Check Out'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {logs.links && logs.links.length > 3 && (
                <div className="mt-10 flex justify-center gap-3">
                    {logs.links.map((link, index) => {
                        if (link.url === null) {
                            return (
                                <button
                                    key={index}
                                    disabled
                                    className="px-5 py-3 bg-gray-100 text-gray-400 rounded-xl cursor-not-allowed border border-gray-200 font-semibold"
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            );
                        }
                        return (
                            <button
                                key={index}
                                onClick={() => router.get(link.url, {}, { preserveState: true })}
                                className={`px-5 py-3 rounded-xl font-semibold transition-all shadow-sm ${
                                    link.active
                                        ? 'bg-gradient-to-r from-udom-700 to-udom-600 text-white'
                                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gradient-to-r from-slate-50 to-udom-50 hover:border-udom-200'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        );
                    })}
                </div>
            )}
        </AuthenticatedLayout>
    );
}
