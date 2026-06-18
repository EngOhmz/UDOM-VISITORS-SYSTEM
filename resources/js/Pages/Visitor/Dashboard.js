import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { CalendarIcon, PlusIcon, CheckCircleIcon, XCircleIcon, ClockIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function VisitorDashboard({ requests }) {
    const { auth } = usePage().props;

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
                return 'bg-green-50 text-green-700 border border-green-200';
            case 'rejected':
                return 'bg-red-50 text-red-700 border border-red-200';
            default:
                return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
            <Head title="Visitor Dashboard" />

            {/* Header */}
            <nav className="bg-white shadow-lg border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-indigo-600">UDOM VMS</h1>
                        </div>
                        <div className="flex items-center gap-6">
                            <span className="text-xl font-semibold text-gray-700">Hi, {auth?.visitor?.name}!</span>
                            <form method="post" action={route('visitor.logout')} as="button">
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-xl font-semibold hover:from-gray-200 hover:to-gray-300 transition shadow-md hover:shadow-lg"
                                >
                                    Logout
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                {/* Welcome and New Request Button */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
                            {auth.visitor?.avatar ? (
                                <img 
                                    src={auth.visitor.avatar} 
                                    alt={auth.visitor.name} 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <img 
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(auth.visitor?.name || 'Visitor')}&background=6366f1&color=fff&size=96`}
                                    alt={auth.visitor?.name} 
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                        <div>
                            <h2 className="text-4xl font-bold text-gray-800">Welcome Back!</h2>
                            <p className="mt-3 text-gray-600 text-lg">View and manage your visit requests</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Link
                            href={route('profile.edit')}
                            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-xl font-semibold hover:from-gray-200 hover:to-gray-300 transition shadow-md hover:shadow-lg"
                        >
                            <UserCircleIcon className="w-6 h-6" />
                            Edit Profile
                        </Link>
                        <Link
                            href={route('visitor.request.form')}
                            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 transition shadow-md hover:shadow-lg"
                        >
                            <PlusIcon className="w-6 h-6" />
                            New Request
                        </Link>
                    </div>
                </div>

                {/* Requests List */}
                <div className="space-y-6">
                    {requests.data.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-16 text-center">
                            <CalendarIcon className="w-24 h-24 text-gray-200 mx-auto mb-8" />
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">No requests yet</h3>
                            <p className="text-gray-600 mb-10 max-w-lg mx-auto text-lg">Submit your first visit request to get started with UDOM Visitor Management System.</p>
                            <Link
                                href={route('visitor.request.form')}
                                className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 transition shadow-md hover:shadow-lg"
                            >
                                <PlusIcon className="w-6 h-6" />
                                Create Request
                            </Link>
                        </div>
                    ) : (
                        requests.data.map((request) => {
                            const StatusIcon = getStatusIcon(request.status);
                            return (
                                <div
                                    key={request.id}
                                    className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10 hover:shadow-2xl transition-all hover:-translate-y-1"
                                >
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-8">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-5 mb-6">
                                                <StatusIcon className={`w-10 h-10 ${getStatusColor(request.status)}`} />
                                                <h3 className="text-2xl font-bold text-gray-800">
                                                    {request.office.name}
                                                </h3>
                                                <span
                                                    className={`px-6 py-2 text-base font-semibold rounded-full ${getStatusBadge(request.status)}`}
                                                >
                                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 mb-8 text-xl">{request.purpose}</p>
                                            <div className="flex flex-wrap gap-8 text-base text-gray-500">
                                                <div className="flex items-center gap-3 bg-gray-50 px-6 py-3 rounded-xl border border-gray-100">
                                                    <CalendarIcon className="w-6 h-6" />
                                                    <span>
                                                        {new Date(request.visit_date).toLocaleDateString()}
                                                        {request.visit_time && ` at ${request.visit_time}`}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {request.verification_code && (
                                            <div className="w-full sm:w-auto bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-8 border border-indigo-100">
                                                <h4 className="text-base font-semibold text-indigo-800 mb-3">Verification Code</h4>
                                                <p className="text-4xl font-mono font-bold text-indigo-700">{request.verification_code}</p>
                                            </div>
                                        )}

                                        {request.rejection_reason && (
                                            <div className="w-full sm:w-auto bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-8 border border-red-100">
                                                <h4 className="text-base font-semibold text-red-800 mb-3">Rejection Reason</h4>
                                                <p className="text-gray-800 text-lg">{request.rejection_reason}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Pagination */}
                {requests.links.length > 3 && (
                    <div className="mt-12">
                        <div className="flex justify-center gap-3">
                            {requests.links.map((link, index) => {
                                if (link.url === null) {
                                    return (
                                        <button
                                            key={index}
                                            disabled
                                            className="px-6 py-3 bg-gray-100 text-gray-400 rounded-xl cursor-not-allowed font-semibold"
                                        >
                                            {link.label}
                                        </button>
                                    );
                                }
                                return (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                                            link.active
                                                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
                                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gradient-to-r from-gray-50 to-indigo-50 hover:shadow-sm'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
