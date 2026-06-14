import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function VisitorRequestStatus({ request }) {
  const { data, setData, get, processing } = useForm({
    verification_code: '',
    email: '',
    phone: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    get(route('visitor.request.status'));
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border border-red-300';
      default:
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <Head title="Check Request Status" />
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Check Visit Request Status</h1>
            <p className="mt-2 text-gray-600">
              Enter your verification code or contact details to check your request status
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="space-y-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
                <input
                  type="text"
                  value={data.verification_code}
                  onChange={e => setData('verification_code', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. ABC123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={data.email}
                  onChange={e => setData('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={data.phone}
                  onChange={e => setData('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={processing}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
              >
                {processing ? 'Checking...' : 'Check Status'}
              </button>
            </div>
          </form>

          {/* Request Details */}
          {request && (
            <div className="border-t border-gray-200 pt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Request Details</h2>
                <span className={`px-4 py-1 text-sm font-semibold rounded-full ${getStatusBadgeClass(request.status)}`}>
                  {request.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Visitor Info</h3>
                  <p className="text-gray-900"><strong>Name:</strong> {request.visitor?.name}</p>
                  <p className="text-gray-700"><strong>Phone:</strong> {request.visitor?.phone}</p>
                  {request.visitor?.email && (
                    <p className="text-gray-700"><strong>Email:</strong> {request.visitor?.email}</p>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Visit Info</h3>
                  <p className="text-gray-900"><strong>Office:</strong> {request.office?.name}</p>
                  <p className="text-gray-700">
                    <strong>Date:</strong> {new Date(request.visit_date).toLocaleDateString()}
                  </p>
                  {request.visit_time && (
                    <p className="text-gray-700"><strong>Time:</strong> {request.visit_time}</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Purpose</h3>
                <p className="text-gray-900">{request.purpose}</p>
              </div>

              {request.verification_code && (
                <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <h3 className="text-sm font-semibold text-indigo-900 uppercase tracking-wider mb-1">
                    Verification Code
                  </h3>
                  <p className="text-2xl font-mono font-bold text-indigo-700">
                    {request.verification_code}
                  </p>
                  <p className="text-sm text-indigo-600 mt-1">
                    Please bring this code with you to your visit.
                  </p>
                </div>
              )}

              {request.rejection_reason && (
                <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                  <h3 className="text-sm font-semibold text-red-900 uppercase tracking-wider mb-1">
                    Rejection Reason
                  </h3>
                  <p className="text-gray-900">{request.rejection_reason}</p>
                </div>
              )}
            </div>
          )}

          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <a
              href={route('visitor.request.form')}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              ← Submit a new request
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
