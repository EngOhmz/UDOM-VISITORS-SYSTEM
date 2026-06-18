import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
import { CheckIcon, ArrowRightOnRectangleIcon, UserIcon, BuildingOfficeIcon, ClockIcon } from '@heroicons/react/24/outline';

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
        const code = e.target.value;
        setVerificationCode(code);
        setErrorMessage('');
        setVisitRequestPreview(null);

        if (code.length >= 4) {
            fetch(route('requests.verify'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content
                },
                body: JSON.stringify({ code: code })
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                return response.json().then(err => { throw err; });
            })
            .then(data => {
                if (data.request) {
                    setVisitRequestPreview(data.request);
                }
            })
            .catch(error => {
                if (error.error) {
                    setErrorMessage(error.error);
                }
            });
        }
    };

    const handleCheckIn = (e) => {
        e.preventDefault();
        if (!visitRequestPreview) {
            setErrorMessage('Invalid or expired verification code.');
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
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <ClockIcon className="w-5 h-5 text-udom-600" />
                                            {log.duration || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-4 py-1.5 text-xs font-semibold rounded-full border ${
                                            log.check_out_at 
                                                ? 'bg-gray-100 text-gray-700 border-gray-300' 
                                                : 'bg-green-100 text-green-700 border-green-300'
                                        }`}>
                                            {log.check_out_at ? 'Completed' : 'Checked In'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {log.check_in_at && !log.check_out_at && (
                                            <button
                                                onClick={() => setIsCheckOutModalOpen(log.id)}
                                                className="flex items-center gap-2 px-4 py-2 text-orange-700 bg-orange-50 rounded-xl hover:bg-orange-100 transition border border-orange-200 font-medium shadow-sm"
                                            >
                                                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                                                Check Out
                                            </button>
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
                        <div className="px-8 py-5 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-udom-50 to-white">
                            <h3 className="text-2xl font-bold text-gray-800">Check In Visitor</h3>
                            <button
                                onClick={() => {
                                    setIsCheckInModalOpen(false);
                                    setVerificationCode('');
                                    setCheckInNotes('');
                                    setVisitRequestPreview(null);
                                    setErrorMessage('');
                                }}
                                className="text-gray-500 hover:text-gray-700 transition"
                            >
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="p-8">
                            <form onSubmit={handleCheckIn}>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Verification Code
                                        </label>
                                        <input
                                            type="text"
                                            value={verificationCode}
                                            onChange={handleCodeInput}
                                            className={`w-full px-5 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-udom-100 transition-all ${
                                                errorMessage ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:border-udom-500'
                                            } bg-white shadow-sm`}
                                            placeholder="Enter verification code (e.g. ABC123)"
                                            autoFocus
                                            required
                                        />
                                        {errorMessage && (
                                            <p className="text-sm text-red-600 mt-3 font-medium">{errorMessage}</p>
                                        )}
                                    </div>

                                    {/* Visitor Preview */}
                                    {visitRequestPreview && (
                                        <div className="bg-gradient-to-r from-udom-50 to-emerald-50 rounded-2xl p-6 border-2 border-udom-100 shadow-sm">
                                            <h4 className="text-sm font-bold text-udom-800 mb-4 flex items-center gap-2">
                                                <UserIcon className="w-5 h-5" />
                                                Visitor Details
                                            </h4>
                                            <div className="flex items-center gap-6 mb-6">
                                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                                                    {visitRequestPreview.visitor?.avatar ? (
                                                        <img 
                                                            src={visitRequestPreview.visitor.avatar} 
                                                            alt={visitRequestPreview.visitor?.name} 
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <img 
                                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(visitRequestPreview.visitor?.name || 'Visitor')}&background=0a5c3c&color=fff&size=96`}
                                                            alt={visitRequestPreview.visitor?.name} 
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xl font-bold text-gray-800">{visitRequestPreview.visitor?.name || '-'}</p>
                                                    <p className="text-sm text-gray-600 mt-1">{visitRequestPreview.visitor?.email || '-'}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                <div className="bg-white p-4 rounded-xl border border-udom-100">
                                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Office</label>
                                                    <p className="text-base font-semibold text-gray-800">{visitRequestPreview.office?.name || '-'}</p>
                                                </div>
                                                <div className="bg-white p-4 rounded-xl border border-udom-100">
                                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Purpose</label>
                                                    <p className="text-base font-semibold text-gray-800">{visitRequestPreview.purpose}</p>
                                                </div>
                                                <div className="bg-white p-4 rounded-xl border border-udom-100">
                                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Visit Date</label>
                                                    <p className="text-base font-semibold text-gray-800">{new Date(visitRequestPreview.visit_date).toLocaleDateString()}</p>
                                                </div>
                                                <div className="bg-white p-4 rounded-xl border border-udom-100">
                                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Visit Time</label>
                                                    <p className="text-base font-semibold text-gray-800">{visitRequestPreview.visit_time || '-'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Notes (Optional)
                                        </label>
                                        <textarea
                                            value={checkInNotes}
                                            onChange={(e) => setCheckInNotes(e.target.value)}
                                            rows={3}
                                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-udom-100 focus:border-udom-500 transition-all bg-white shadow-sm"
                                            placeholder="Add any notes about this check-in"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-4 mt-10">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsCheckInModalOpen(false);
                                            setVerificationCode('');
                                            setCheckInNotes('');
                                            setVisitRequestPreview(null);
                                            setErrorMessage('');
                                        }}
                                        className="px-7 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition font-semibold shadow-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!visitRequestPreview}
                                        className={`px-7 py-3 text-white rounded-xl font-semibold transition-all shadow-md ${
                                            visitRequestPreview 
                                                ? 'bg-gradient-to-r from-udom-700 to-udom-600 hover:from-udom-800 hover:to-udom-700' 
                                                : 'bg-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        Check In
                                    </button>
                                </div>
                            </form>
                        </div>
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
