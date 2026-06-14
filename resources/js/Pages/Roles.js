import React, { useState, useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
import { 
    ShieldCheckIcon, 
    PlusIcon, 
    PencilSquareIcon as PencilIcon, 
    TrashIcon, 
    XMarkIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function Roles({ roles, allPermissions }) {
    const { props } = usePage();
    const flash = props.flash || {};
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
        display_name: '',
        description: '',
        permissions: [],
    });

    useEffect(() => {
        if (flash.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash.success]);

    const openCreateModal = () => {
        setEditMode(false);
        reset();
        setShowModal(true);
    };

    const openEditModal = (role) => {
        setEditMode(true);
        setCurrentId(role.id);
        setData({
            display_name: role.display_name,
            description: role.description || '',
            permissions: role.permissions.map(p => p.id),
        });
        setShowModal(true);
    };

    const handlePermissionToggle = (permissionId) => {
        const currentPerms = [...data.permissions];
        if (currentPerms.includes(permissionId)) {
            setData('permissions', currentPerms.filter(id => id !== permissionId));
        } else {
            setData('permissions', [...currentPerms, permissionId]);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        if (editMode) {
            put(`/roles/${currentId}`, {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        } else {
            post('/roles', {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        }
    };

    const deleteRole = (id) => {
        if (confirm('Are you sure you want to delete this role?')) {
            destroy(`/roles/${id}`);
        }
    };

    return (
        <AuthenticatedLayout title="Roles & Permissions">
            <Head title="Roles" />

            {showSuccess && (
                <div className="fixed top-4 right-4 z-50 animate-bounce">
                    <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center">
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        <span className="font-bold mr-2">✓ Success:</span> {flash.success}
                    </div>
                </div>
            )}

            <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">System Roles</h3>
                    <button 
                        onClick={openCreateModal}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                    >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Create New Role
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role Name</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Permissions</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {roles.map((role) => (
                                <tr key={role.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                <ShieldCheckIcon className="h-6 w-6" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="font-bold text-gray-900">{role.display_name}</div>
                                                <div className="text-xs text-gray-500 uppercase tracking-tighter">{role.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {role.permissions.slice(0, 3).map(p => (
                                                <span key={p.id} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-full uppercase">
                                                    {p.display_name}
                                                </span>
                                            ))}
                                            {role.permissions.length > 3 && (
                                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full uppercase">
                                                    +{role.permissions.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => openEditModal(role)}
                                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            >
                                                <PencilIcon className="h-5 w-5" />
                                            </button>
                                            {role.name !== 'admin' && (
                                                <button 
                                                    onClick={() => deleteRole(role.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-indigo-50 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-indigo-900 flex items-center">
                                <ShieldCheckIcon className="h-5 w-5 mr-2" />
                                {editMode ? 'Edit Role Permissions' : 'Create New Role'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={submit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role Display Name</label>
                                    <input 
                                        type="text" 
                                        className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
                                        value={data.display_name}
                                        onChange={e => setData('display_name', e.target.value)}
                                        placeholder="e.g. Branch Manager"
                                    />
                                    {errors.display_name && <div className="text-red-500 text-xs mt-1">{errors.display_name}</div>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <input 
                                        type="text" 
                                        className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        placeholder="Brief description of the role"
                                    />
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-gray-900 mb-4 border-b pb-2">Assign Permissions</h4>
                                <div className="space-y-6 max-h-80 overflow-y-auto pr-2">
                                    {Object.keys(allPermissions).map(group => (
                                        <div key={group}>
                                            <h5 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-3">{group} Management</h5>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {allPermissions[group].map(permission => (
                                                    <label key={permission.id} className="relative flex items-start cursor-pointer group">
                                                        <div className="flex items-center h-5">
                                                            <input
                                                                type="checkbox"
                                                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded transition"
                                                                checked={data.permissions.includes(permission.id)}
                                                                onChange={() => handlePermissionToggle(permission.id)}
                                                            />
                                                        </div>
                                                        <div className="ml-3 text-sm">
                                                            <span className="font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
                                                                {permission.display_name}
                                                            </span>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button 
                                    type="button" 
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : (editMode ? 'Update Role' : 'Create Role')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
