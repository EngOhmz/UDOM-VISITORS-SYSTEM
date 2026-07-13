import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

function formatDuration(log) {
    if (log.duration) return log.duration;
    if (!log.check_in_at || !log.check_out_at) return 'Still on campus';

    const start = new Date(log.check_in_at);
    const end = new Date(log.check_out_at);
    const totalMinutes = Math.max(0, Math.floor((end - start) / 60000));

    if (totalMinutes < 1) return 'Less than 1 min';

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0 && minutes > 0) {
        return `${hours} hr${hours > 1 ? 's' : ''} ${minutes} min${minutes > 1 ? 's' : ''}`;
    }
    if (hours > 0) return `${hours} hr${hours > 1 ? 's' : ''}`;
    return `${minutes} min${minutes > 1 ? 's' : ''}`;
}

export default function Reports({ reportData, filters = {} }) {
    const exportParams = new URLSearchParams();
    if (filters.date_from) exportParams.set('date_from', filters.date_from);
    if (filters.date_to) exportParams.set('date_to', filters.date_to);
    if (filters.office_id) exportParams.set('office_id', filters.office_id);
    const exportUrl = `/reports/export${exportParams.toString() ? `?${exportParams.toString()}` : ''}`;

    return (
        <AuthenticatedLayout title="Reports">
            <Head title="Reports" />

            <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">Visitor Reports</h3>
                    <a
                        href={exportUrl}
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
                            {reportData.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">
                                        No visitor logs found for the selected filters.
                                    </td>
                                </tr>
                            ) : (
                                reportData.map((log) => (
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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                            {formatDuration(log)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
