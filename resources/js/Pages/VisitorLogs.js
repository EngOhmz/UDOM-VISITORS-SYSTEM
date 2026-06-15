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
        router.put(`/logs/${isCheckOutModalOpen}/check-out`, {
            notes: checkOutNotes,
        }, {
            onSuccess: () => {
                setIsCheckOutModalOpen(null);
                setCheckOutNotes('');
            }
        });
    };

    return (
        <AuthenticatedLayout title="Visitor Logs">
            <Head title="Visitor Logs" />

            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Visitor Logs</h2>
                    <p className="mt-2 text-gray-600">Manage visitor check-ins and check-outs</p>
                </div>
                <button
                    onClick={() => setIsCheckInModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition shadow-sm"
                >
                    <CheckIcon className="h-5 w-5" />
                    Check In Visitor
                </button>
            </div>

            <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Visitor</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Office</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Check In</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Check Out</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Duration</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {logs.data?.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                <UserIcon className="w-5 h-5 text-indigo-600" />
                                            </div>
                                            <div>
                                                <div>{log.visitRequest?.visitor?.name || '-'}</div>
                                                {log.check_in_notes && (
                                                    <div className="text-xs text-gray-500 mt-1">{log.check_in_notes}</div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <BuildingOfficeIcon className="w-4 h-4" />
                                            {log.visitRequest?.office?.name || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {log.check_in_at ? (
                                            <div>
                                                <div className="font-medium">{new Date(log.check_in_at).toLocaleDateString()}</div>
                                                <div className="text-xs text-gray-400">{new Date(log.check_in_at).toLocaleTimeString()}</div>
                                            </div>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {log.check_out_at ? (
                                            <div>
                                                <div className="font-medium">{new Date(log.check_out_at).toLocaleDateString()}</div>
                                                <div className="text-xs text-gray-400">{new Date(log.check_out_at).toLocaleTimeString()}</div>
                                                {log.check_out_notes && (
                                                    <div className="text-xs text-gray-500 mt-1">{log.check_out_notes}</div>
                                                )}
                                            </div>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <ClockIcon className="w-4 h-4" />
                                            {log.duration || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                            log.check_out_at 
                                                ? 'bg-gray-100 text-gray-800 border border-gray-200' 
                                                : 'bg-green-100 text-green-800 border border-green-200'
                                        }`}>
                                            {log.check_out_at ? 'Completed' : 'Checked In'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {log.check_in_at && !log.check_out_at && (
                                            <button
                                                onClick={() => setIsCheckOutModalOpen(log.id)}
                                                className="flex items-center gap-2 px-3 py-1.5 text-orange-700 bg-orange-50 rounded-lg hover:bg-orange-100 transition border border-orange-200"
                                            >
                                                <ArrowRightOnRectangleIcon className="h-4 w-4" />
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
                    <div className="p-12 text-center">
                        <ClockIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No visitor logs yet</h3>
                        <p className="text-gray-600">Check in your first visitor to get started.</p>
                    </div>
                )}
            </div>

            {/* Check In Modal */}
            {isCheckInModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900">Check In Visitor</h3>
                            <button
                                onClick={() => {
                                    setIsCheckInModalOpen(false);
                                    setVerificationCode('');
                                    setCheckInNotes('');
                                    setVisitRequestPreview(null);
                                    setErrorMessage('');
                                }}
                                className="text-gray-400 hover:text-gray-600 transition"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <form onSubmit={handleCheckIn}>
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Verification Code
                                        </label>
                                        <input
                                            type="text"
                                            value={verificationCode}
                                            onChange={handleCodeInput}
                                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                                                errorMessage ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter verification code (e.g. ABC123)"
                                            autoFocus
                                            required
                                        />
                                        {errorMessage && (
                                            <p className="text-sm text-red-600 mt-2">{errorMessage}</p>
                                        )}
                                    </div>

                                    {/* Visitor Preview */}
                                    {visitRequestPreview && (
                                        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-5 border border-indigo-100">
                                            <h4 className="text-sm font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                                                <UserIcon className="w-4 h-4" />
                                                Visitor Details
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs font-medium text-gray-500 uppercase">Name</label>
                                                    <p className="text-sm font-medium text-gray-900">{visitRequestPreview.visitor?.name || '-'}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-medium text-gray-500 uppercase">Office</label>
                                                    <p className="text-sm font-medium text-gray-900">{visitRequestPreview.office?.name || '-'}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-medium text-gray-500 uppercase">Purpose</label>
                                                    <p className="text-sm font-medium text-gray-900">{visitRequestPreview.purpose}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-medium text-gray-500 uppercase">Visit Date</label>
                                                    <p className="text-sm font-medium text-gray-900">{new Date(visitRequestPreview.visit_date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Notes (Optional)
                                        </label>
                                        <textarea
                                            value={checkInNotes}
                                            onChange={(e) => setCheckInNotes(e.target.value)}
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                            placeholder="Add any notes about this check-in"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 mt-8">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsCheckInModalOpen(false);
                                            setVerificationCode('');
                                            setCheckInNotes('');
                                            setVisitRequestPreview(null);
                                            setErrorMessage('');
                                        }}
                                        className="px-5 py-2.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!visitRequestPreview}
                                        className={`px-5 py-2.5 text-white rounded-xl font-semibold transition ${
                                            visitRequestPreview 
                                                ? 'bg-green-600 hover:bg-green-700 shadow-sm' 
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
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900">Check Out Visitor</h3>
                            <button
                                onClick={() => {
                                    setIsCheckOutModalOpen(null);
                                    setCheckOutNotes('');
                                }}
                                className="text-gray-400 hover:text-gray-600 transition"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Notes (Optional)
                                    </label>
                                    <textarea
                                        value={checkOutNotes}
                                        onChange={(e) => setCheckOutNotes(e.target.value)}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                                        placeholder="Add any notes about this check-out"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-8">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCheckOutModalOpen(null);
                                        setCheckOutNotes('');
                                    }}
                                    className="px-5 py-2.5 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCheckOut}
                                    className="px-5 py-2.5 text-white bg-orange-600 rounded-xl hover:bg-orange-700 transition font-semibold shadow-sm"
                                >
                                    Check Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {logs.links && logs.links.length > 3 && (
                <div className="mt-8 flex justify-center gap-2">
                    {logs.links.map((link, index) => {
                        if (link.url === null) {
                            return (
                                <button
                                    key={index}
                                    disabled
                                    className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed border border-gray-200"
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            );
                        }
                        return (
                            <button
                                key={index}
                                onClick={() => router.get(link.url, {}, { preserveState: true })}
                                className={`px-4 py-2 rounded-lg font-medium transition ${
                                    link.active
                                        ? 'bg-indigo-600 text-white shadow-sm'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
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
