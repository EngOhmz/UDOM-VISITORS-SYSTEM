import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import PasswordInput from '../Components/PasswordInput';
import PasswordRequirements from '../Components/PasswordRequirements';

function resolveDepartmentId(user, offices) {
    if (user.office?.department_id != null) {
        return Number(user.office.department_id);
    }
    if (user.office_id) {
        const office = offices.find((o) => Number(o.id) === Number(user.office_id));
        return office?.department_id != null ? Number(office.department_id) : null;
    }
    return null;
}

export default function Users({ users, roles, offices, departments }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [clientError, setClientError] = useState('');

    const { data, setData, post, put, delete: destroy, processing, reset, errors, transform } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'staff',
        department_id: null,
        office_id: null,
    });

    const filteredOffices = data.department_id
        ? offices.filter((office) => Number(office.department_id) === Number(data.department_id))
        : offices;

    const officeOptions = [...filteredOffices];
    if (data.office_id && !officeOptions.some((o) => Number(o.id) === Number(data.office_id))) {
        const currentOffice = offices.find((o) => Number(o.id) === Number(data.office_id));
        if (currentOffice) {
            officeOptions.push(currentOffice);
        }
    }

    transform((formData) => {
        const payload = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            role: formData.role,
            office_id: formData.role === 'staff' ? formData.office_id : null,
        };

        if (formData.password) {
            payload.password = formData.password;
        }

        return payload;
    });

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        setClientError('');
        reset();
    };

    const openCreateModal = () => {
        setEditingUser(null);
        reset();
        setIsModalOpen(true);
    };

    const handleEdit = (user) => {
        setClientError('');
        setEditingUser(user);
        setData({
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            password: '',
            role: user.role || 'staff',
            department_id: resolveDepartmentId(user, offices),
            office_id: user.office_id != null ? Number(user.office_id) : null,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = () => {
        setClientError('');

        if (!data.name?.trim()) {
            setClientError('Name is required.');
            return;
        }
        if (!data.email?.trim()) {
            setClientError('Email is required.');
            return;
        }
        if (data.role === 'staff' && !data.department_id) {
            setClientError('Please select a department for staff users.');
            return;
        }
        if (data.role === 'staff' && !data.office_id) {
            setClientError('Please select an office for staff users.');
            return;
        }
        if (!editingUser && !data.password) {
            setClientError('Password is required for new users.');
            return;
        }

        const options = {
            onSuccess: () => closeModal(),
            onError: () => {
                setIsModalOpen(true);
                setClientError('');
            },
        };

        if (editingUser) {
            put(`/users/${editingUser.id}`, options);
        } else {
            post('/users', options);
        }
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this user?')) {
            destroy(`/users/${id}`);
        }
    };

    const handleRoleChange = (role) => {
        if (role === 'staff') {
            setData('role', role);
        } else {
            setData({
                ...data,
                role,
                department_id: null,
                office_id: null,
            });
        }
    };

    const getRoleBadgeClass = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-udom-200 text-udom-900';
            case 'staff':
                return 'bg-udom-100 text-udom-800';
            case 'secretary':
                return 'bg-udom-50 text-udom-700';
            default:
                return 'bg-slate-100 text-slate-700';
        }
    };

    const showStaffFields = data.role === 'staff';
    const officeSelectEnabled = Boolean(data.department_id);
    const serverError = Object.values(errors).find(Boolean);

    const pagination = users?.total > 0 ? (
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-slate-600">
                Showing <span className="font-semibold text-slate-800">{users.from ?? 0}</span>
                {' '}to <span className="font-semibold text-slate-800">{users.to ?? 0}</span>
                {' '}of <span className="font-semibold text-slate-800">{users.total}</span> users
                {users.last_page > 1 && (
                    <span className="text-slate-400"> · Page {users.current_page} of {users.last_page}</span>
                )}
            </p>

            {users.last_page > 1 && users.links?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {users.links.map((link, index) => {
                        if (link.url === null) {
                            return (
                                <button
                                    key={index}
                                    disabled
                                    className="px-3 py-1.5 bg-slate-100 text-slate-400 rounded-lg cursor-not-allowed text-sm font-medium"
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            );
                        }
                        return (
                            <Link
                                key={index}
                                href={link.url}
                                preserveScroll
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                                    link.active
                                        ? 'bg-udom-700 text-white shadow-sm'
                                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-udom-50'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    ) : null;

    const modal = isModalOpen ? createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <button
                type="button"
                aria-label="Close modal"
                className="absolute inset-0 bg-black/50"
                onClick={closeModal}
            />
            <div
                className="relative bg-white rounded-xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
                    <h3 className="text-lg font-bold text-gray-800">
                        {editingUser ? 'Edit User' : 'Add User'}
                    </h3>
                    <button
                        type="button"
                        onClick={closeModal}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-6 py-4 overflow-y-auto flex-1">
                    {(clientError || serverError || errors.office_id) && (
                        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                            {clientError || errors.office_id || serverError}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-udom-500 ${
                                    errors.name ? 'border-red-300' : 'border-gray-300'
                                }`}
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-udom-500 ${
                                    errors.email ? 'border-red-300' : 'border-gray-300'
                                }`}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-udom-500 ${
                                    errors.phone ? 'border-red-300' : 'border-gray-300'
                                }`}
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <select
                                value={data.role}
                                onChange={(e) => handleRoleChange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-udom-500"
                            >
                                <option value="staff">Staff</option>
                                <option value="secretary">Secretary</option>
                                <option value="admin">Admin</option>
                            </select>
                            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                        </div>

                        {showStaffFields && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                    <select
                                        value={data.department_id ?? ''}
                                        onChange={(e) => {
                                            const deptId = e.target.value ? Number(e.target.value) : null;
                                            setData({
                                                ...data,
                                                department_id: deptId,
                                                office_id: null,
                                            });
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-udom-500"
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map((department) => (
                                            <option key={department.id} value={department.id}>
                                                {department.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Office</label>
                                    <select
                                        value={data.office_id ?? ''}
                                        onChange={(e) => setData('office_id', e.target.value ? Number(e.target.value) : null)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-udom-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        disabled={!officeSelectEnabled}
                                    >
                                        <option value="">
                                            {officeSelectEnabled ? 'Select Office' : 'Select department first'}
                                        </option>
                                        {officeOptions.map((office) => (
                                            <option key={office.id} value={office.id}>
                                                {office.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}

                        {!editingUser && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                        <PasswordInput
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-udom-500"
                                        />
                                        <PasswordRequirements />
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl shrink-0">
                    <button
                        type="button"
                        onClick={closeModal}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                        disabled={processing}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="px-4 py-2 text-white bg-udom-700 rounded-lg hover:bg-udom-800 transition disabled:opacity-60 cursor-pointer"
                        disabled={processing}
                    >
                        {processing ? 'Saving...' : editingUser ? 'Update' : 'Create'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    ) : null;

    return (
        <AuthenticatedLayout title="Users">
            <Head title="Users" />

            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">System Users</h2>
                    {users.total != null && (
                        <p className="text-sm text-slate-500 mt-1">
                            {users.total} staff and admin accounts
                        </p>
                    )}
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center px-4 py-2 bg-udom-700 text-white rounded-lg hover:bg-udom-800 transition"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add User
                </button>
            </div>

            <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Office</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {users.data?.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-500">
                                        No system users yet. Click <strong>Add User</strong> to create one.
                                    </td>
                                </tr>
                            ) : (
                                users.data.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {user.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.phone || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeClass(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.office?.department?.name || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.office?.name || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => handleEdit(user)}
                                                className="text-udom-700 hover:text-udom-900"
                                            >
                                                <PencilIcon className="h-5 w-5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(user.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {pagination}
            </div>

            {modal}
        </AuthenticatedLayout>
    );
}
