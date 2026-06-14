import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { CalendarIcon, PlusIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

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
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head title="Visitor Dashboard" />

      {/* Header */}
      <nav className="bg-white shadow border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">UDOM VMS</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Hi, {auth?.visitor?.name}</span>
              <form method="post" action={route('visitor.logout')} as="button">
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome and New Request Button */}
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

        {/* Requests List */}
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
                          {request.office.name}
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

        {/* Pagination */}
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
      </main>
    </div>
  );
}
