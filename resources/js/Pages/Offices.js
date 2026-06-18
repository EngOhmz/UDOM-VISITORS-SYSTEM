import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function Offices({ offices, departments }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOffice, setEditingOffice] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        department_id: '',
        building: '',
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingOffice) {
            router.put(`/offices/${editingOffice.id}`, formData, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setEditingOffice(null);
                    resetForm();
                },
            });
        } else {
            router.post('/offices', formData, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    resetForm();
                },
            });
        }
    };

    const handleEdit = (office) => {
        setEditingOffice(office);
        setFormData({
            name: office.name,
            department_id: office.department_id || '',
            building: office.building || '',
            description: office.description || '',
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this office?')) {
            router.delete(`/offices/${id}`);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            department_id: '',
            building: '',
            description: '',
        });
    };

    return (
        <AuthenticatedLayout title="Offices">
            <Head title="Offices" />

            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">All Offices</h2>
                <button
                    onClick={() => {
                        setEditingOffice(null);
                        resetForm();
                        setIsModalOpen(true);
                    }}
                    className="flex items-center px-4 py-2 bg-udom-700 text-white rounded-lg hover:bg-udom-800 transition"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Office
                </button>
            </div>

            <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Building</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {offices.data?.map((office) => (
                                <tr key={office.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {office.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {office.department?.name || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {office.building || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                        {office.description || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(office)}
                                                className="text-udom-700 hover:text-udom-900"
                                            >
                                                <PencilIcon className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(office.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">
                            {editingOffice ? 'Edit Office' : 'Add Office'}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Office Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-udom-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Department
                                    </label>
                                    <select
                                        value={formData.department_id}
                                        onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-udom-500"
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map((dept) => (
                                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Building
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.building}
                                        onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-udom-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-udom-500"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setEditingOffice(null);
                                        resetForm();
                                    }}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white bg-udom-700 rounded-lg hover:bg-udom-800 transition"
                                >
                                    {editingOffice ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
