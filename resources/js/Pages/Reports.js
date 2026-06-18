import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
import { DocumentChartBarIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function Reports({ reportData }) {
    return (
        <AuthenticatedLayout title="Reports">
            <Head title="Reports" />

            <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">Visitor Reports</h3>
                    <a 
                        href="/api/reports/export" 
                        target="_blank"
                        className="inline-flex items-center px-4 py-2 bg-udom-700 text-white rounded-lg text-sm font-medium hover:bg-udom-800 transition"
                    >
                        <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                        Export CSV
                    </a>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Visitor</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Office</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Check In</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Check Out</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Duration</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {reportData.map((log) => (
                                <tr key={log.id}>
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
