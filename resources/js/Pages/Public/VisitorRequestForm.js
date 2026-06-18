import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function VisitorRequestForm({ offices, departments }) {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [filteredOffices, setFilteredOffices] = useState([]);
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    phone: '',
    id_number: '',
    organization: '',
    office_id: '',
    purpose: '',
    visit_date: '',
    visit_time: '',
  });

  useEffect(() => {
    if (selectedDepartment) {
      fetch(`/api/offices-by-department/${selectedDepartment}`)
        .then(res => res.json())
        .then(data => setFilteredOffices(data));
    } else {
      setFilteredOffices(offices);
    }
  }, [selectedDepartment, offices]);

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('visitor.request.submit'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-udom-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <Head title="Request a Visit" />
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">UDOM Visitor Request</h1>
            <p className="mt-2 text-gray-600">
              Fill out the form below to request a visit to our offices
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Visitor Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-udom-500"
                    required
                  />
                  {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    value={data.phone}
                    onChange={e => setData('phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-udom-500"
                    required
                  />
                  {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={e => setData('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-udom-500"
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                  <input
                    type="text"
                    value={data.id_number}
                    onChange={e => setData('id_number', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-udom-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization / Company</label>
                  <input
                    type="text"
                    value={data.organization}
                    onChange={e => setData('organization', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-udom-500"
                  />
                </div>
              </div>
            </div>

            {/* Visit Details */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Visit Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                  <select
                    value={selectedDepartment}
                    onChange={e => {
                      setSelectedDepartment(e.target.value);
                      setData('office_id', '');
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-udom-500"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Office to Visit *</label>
                  <select
                    value={data.office_id}
                    onChange={e => setData('office_id', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-udom-500"
                    disabled={!selectedDepartment}
                    required
                  >
                    <option value="">Select Office</option>
                    {filteredOffices.map(office => (
                      <option key={office.id} value={office.id}>
                        {office.name}
                      </option>
                    ))}
                  </select>
                  {errors.office_id && <p className="text-red-600 text-sm mt-1">{errors.office_id}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Visit Date *</label>
                    <input
                      type="date"
                      value={data.visit_date}
                      onChange={e => setData('visit_date', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-udom-500"
                      required
                    />
                    {errors.visit_date && <p className="text-red-600 text-sm mt-1">{errors.visit_date}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                    <input
                      type="time"
                      value={data.visit_time}
                      onChange={e => setData('visit_time', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-udom-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purpose of Visit *</label>
                  <textarea
                    value={data.purpose}
                    onChange={e => setData('purpose', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-udom-500"
                    required
                  />
                  {errors.purpose && <p className="text-red-600 text-sm mt-1">{errors.purpose}</p>}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="submit"
                disabled={processing}
                className="px-6 py-3 bg-udom-700 text-white rounded-lg font-semibold hover:bg-udom-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {processing ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center mt-8">
          <a
            href={route('visitor.request.status')}
            className="text-udom-700 hover:text-udom-800 font-medium"
          >
            Check your request status →
          </a>
        </div>
      </div>
    </div>
  );
}
