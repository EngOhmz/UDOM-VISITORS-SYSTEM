import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
import { CheckIcon, XMarkIcon, CheckCircleIcon, XCircleIcon, ClockIcon, CalendarIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function VisitRequests({ requests }) {
    const { props } = usePage();
    const user = props.auth.user;
    const isVisitor = user.role === 'visitor';
    const [filterStatus, setFilterStatus] = useState('');
    const [rejectModal, setRejectModal] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const handleFilterChange = (status) => {
        setFilterStatus(status);
        router.get('/requests', { status: status || null }, { preserveState: true });
    };

    const handleApprove = (id) => {
        router.put(`/requests/${id}/approve`);
    };

    const handleReject = (id) => {
        if (rejectionReason.trim()) {
            router.put(`/requests/${id}/reject`, { rejection_reason: rejectionReason }, {
                onSuccess: () => {
                    setRejectModal(null);
                    setRejectionReason('');
                }
            });
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved':
                return CheckCircleIcon;
            case 'rejected':
                return XCircleIcon;
            default:
                return ClockIcon;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
                return 'text-green-600';
            case 'rejected':
                return 'text-red-600';
            default:
                return 'text-yellow-600';
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
        }
    };

    if (isVisitor) {
        return (
            <AuthenticatedLayout title="My Visit Requests">
                <Head title="My Visit Requests" />

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">My Visit Requests</h2>
                        <p className="mt-2 text-gray-600">View and manage your visit requests</p>
                    </div>
                    <Link
                        href={route('visitor.request.form')}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                    >
                        <PlusIcon className="w-5 h-5" />
                        New Request
                    </Link>
                </div>

                <div className="space-y-4">
                    {requests.data.length === 0 ? (
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
                        requests.data.map((request) => {
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

                {requests.links.length > 3 && (
                    <div className="mt-8">
                        <div className="flex justify-center gap-1">
                            {requests.links.map((link, index) => {
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
        <AuthenticatedLayout title="Visit Requests">
            <Head title="Visit Requests" />

            <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h2 className="text-xl font-bold text-gray-800">Visit Requests</h2>
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleFilterChange('')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            !filterStatus ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => handleFilterChange('pending')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            filterStatus === 'pending' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => handleFilterChange('approved')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            filterStatus === 'approved' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Approved
                    </button>
                    <button
                        onClick={() => handleFilterChange('rejected')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            filterStatus === 'rejected' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Rejected
                    </button>
                </div>
            </div>

            <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Visitor</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Office</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Purpose</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Time</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Verification Code</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {requests.data?.map((request) => (
                                <tr key={request.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {request.visitor?.name || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {request.office?.name || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                        {request.purpose}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(request.visit_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {request.visit_time || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(request.status)}`}>
                                            {request.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-indigo-600">
                                        {request.verification_code || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {request.status === 'pending' && (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleApprove(request.id)}
                                                    className="flex items-center text-green-600 hover:text-green-900"
                                                >
                                                    <CheckIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => setRejectModal(request.id)}
                                                    className="flex items-center text-red-600 hover:text-red-900"
                                                >
                                                    <XMarkIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Reject Modal */}
            {rejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Reject Visit Request</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Reason for Rejection
                                </label>
                                <textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Enter reason..."
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setRejectModal(null);
                                        setRejectionReason('');
                                    }}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleReject(rejectModal)}
                                    className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
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
