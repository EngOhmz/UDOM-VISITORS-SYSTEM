import React, { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeftIcon, CalendarIcon } from '@heroicons/react/24/outline';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';

export default function VisitorRequestForm({ offices, departments }) {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [filteredOffices, setFilteredOffices] = useState([]);
  const { data, setData, post, processing, errors } = useForm({
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
    <AuthenticatedLayout title="Submit Visit Request">
      <Head title="Submit Visit Request" />

      <main className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href={route('requests.index')}
            className="inline-flex items-center gap-2 text-udom-700 hover:text-udom-800 font-medium"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Requests
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit a New Visit Request</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department *
              </label>
              <select
                value={selectedDepartment}
                onChange={e => {
                  setSelectedDepartment(e.target.value);
                  setData('office_id', '');
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-udom-500"
                required
              >
                <option value="">Select a department</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Office to Visit *
              </label>
              <select
                value={data.office_id}
                onChange={e => setData('office_id', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-udom-500"
                disabled={!selectedDepartment}
                required
              >
                <option value="">Select an office</option>
                {filteredOffices.map(office => (
                  <option key={office.id} value={office.id}>
                    {office.name}
                  </option>
                ))}
              </select>
              {errors.office_id && <p className="mt-2 text-sm text-red-600">{errors.office_id}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Visit Date *
                </label>
                <input
                  type="date"
                  value={data.visit_date}
                  onChange={e => setData('visit_date', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-udom-500"
                  required
                />
                {errors.visit_date && <p className="mt-2 text-sm text-red-600">{errors.visit_date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Time
                </label>
                <input
                  type="time"
                  value={data.visit_time}
                  onChange={e => setData('visit_time', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-udom-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purpose of Visit *
              </label>
              <textarea
                value={data.purpose}
                onChange={e => setData('purpose', e.target.value)}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-udom-500"
                required
              />
              {errors.purpose && <p className="mt-2 text-sm text-red-600">{errors.purpose}</p>}
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
              <Link
                href={route('requests.index')}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={processing}
                className="px-6 py-2 bg-udom-700 text-white rounded-lg hover:bg-udom-800 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </AuthenticatedLayout>
  );
}
