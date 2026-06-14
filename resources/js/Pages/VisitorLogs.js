import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
import { CheckIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function VisitorLogs({ logs }) {
    const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [checkInNotes, setCheckInNotes] = useState('');

    const handleCheckIn = (e) => {
        e.preventDefault();
        router.post('/logs/check-in', {
            verification_code: verificationCode,
            notes: checkInNotes,
        }, {
            onSuccess: () => {
                setIsCheckInModalOpen(false);
                setVerificationCode('');
                setCheckInNotes('');
            },
        });
    };

    const handleCheckOut = (id) => {
        router.put(`/logs/${id}/check-out`);
    };

    return (
        <AuthenticatedLayout title="Visitor Logs">
            <Head title="Visitor Logs" />

            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Visitor Logs</h2>
                <button
                    onClick={() => setIsCheckInModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                    <CheckIcon className="h-5 w-5 mr-2" />
                    Check In Visitor
                </button>
            </div>

            <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Visitor</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Office</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Check In</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Check Out</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Duration</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {logs.data?.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {log.visit_request?.visitor?.name || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {log.visit_request?.office?.name || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {log.check_in_at ? new Date(log.check_in_at).toLocaleString() : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {log.check_out_at ? new Date(log.check_out_at).toLocaleString() : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {log.duration || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            log.check_out_at ? 'bg-gray-100 text-gray-800' :
                                            'bg-green-100 text-green-800'
                                        }`}>
                                            {log.check_out_at ? 'Completed' : 'Checked In'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {log.check_in_at && !log.check_out_at && (
                                            <button
                                                onClick={() => handleCheckOut(log.id)}
                                                className="flex items-center text-orange-600 hover:text-orange-900"
                                            >
                                                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Check In Modal */}
            {isCheckInModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Check In Visitor</h3>
                        <form onSubmit={handleCheckIn}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Verification Code
                                    </label>
                                    <input
                                        type="text"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Enter verification code"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Notes (Optional)
                                    </label>
                                    <textarea
                                        value={checkInNotes}
                                        onChange={(e) => setCheckInNotes(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCheckInModalOpen(false);
                                        setVerificationCode('');
                                        setCheckInNotes('');
                                    }}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
                                >
                                    Check In
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
