import React, { useEffect, useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';
import { UserCircleIcon, CheckCircleIcon, KeyIcon, EnvelopeIcon, PhoneIcon, CameraIcon } from '@heroicons/react/24/outline';
import PasswordInput from '../Components/PasswordInput';

export default function Profile({ user }) {
    const { props } = usePage();
    const flash = props.flash || {};
    const [showSuccess, setShowSuccess] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(user.avatar);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        password: '',
        password_confirmation: '',
        avatar: null,
    });

    useEffect(() => {
        if (flash.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash.success]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('phone', data.phone);
        if (data.password) {
            formData.append('password', data.password);
            formData.append('password_confirmation', data.password_confirmation);
        }
        if (data.avatar) {
            formData.append('avatar', data.avatar);
        }
        
        post('/profile', {
            data: formData,
            forceFormData: true,
            onSuccess: () => reset('password', 'password_confirmation', 'avatar'),
        });
    };

    return (
        <AuthenticatedLayout title="Your Profile">
            <Head title="Profile" />

            {showSuccess && (
                <div className="fixed top-4 right-4 z-50 animate-bounce">
                    <div className="bg-udom-700 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center">
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        <span className="font-bold mr-2">✓ Success:</span> {flash.success}
                    </div>
                </div>
            )}

            <div className="max-w-3xl mx-auto space-y-6">
                <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center">
                        <UserCircleIcon className="h-6 w-6 text-udom-700 mr-2" />
                        <h3 className="text-lg font-bold text-gray-800">Profile Information</h3>
                    </div>
                    <form onSubmit={submit} className="p-6 space-y-6">
                        {/* Avatar Upload */}
                        <div className="flex flex-col items-center border-b border-gray-100 pb-6">
                            <div className="mb-4">
                                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg">
                                    {avatarPreview ? (
                                        <img 
                                            src={avatarPreview} 
                                            alt={user.name} 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <img 
                                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0a5c3c&color=fff&size=128`}
                                            alt={user.name} 
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                    <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white cursor-pointer transition hover:bg-opacity-70">
                                        <CameraIcon className="h-8 w-8" />
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            className="hidden"
                                            onChange={handleAvatarChange}
                                        />
                                    </label>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500">Click to change profile picture</p>
                            {errors.avatar && <div className="text-red-500 text-xs mt-1">{errors.avatar}</div>}
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <UserCircleIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input 
                                        type="text" 
                                        className="block w-full pl-10 px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-udom-500 focus:border-udom-500 text-sm bg-white"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                    />
                                </div>
                                {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input 
                                            type="email" 
                                            className="block w-full pl-10 px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-udom-500 focus:border-udom-500 text-sm bg-white"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                        />
                                    </div>
                                    {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <PhoneIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input 
                                            type="text" 
                                            className="block w-full pl-10 px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-udom-500 focus:border-udom-500 text-sm bg-white"
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                        />
                                    </div>
                                    {errors.phone && <div className="text-red-500 text-xs mt-1">{errors.phone}</div>}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
                                    <KeyIcon className="h-5 w-5 mr-2 text-udom-700" />
                                    Change Password
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                        <PasswordInput 
                                            className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-udom-500 focus:border-udom-500 text-sm bg-white"
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                            placeholder="Leave blank to keep current"
                                        />
                                        {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                        <PasswordInput 
                                            className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-udom-500 focus:border-udom-500 text-sm bg-white"
                                            value={data.password_confirmation}
                                            onChange={e => setData('password_confirmation', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button 
                                type="submit"
                                disabled={processing}
                                className="w-full sm:w-auto px-6 py-2.5 bg-udom-700 text-white rounded-lg text-sm font-bold hover:bg-udom-800 transition disabled:opacity-50 shadow-md"
                            >
                                {processing ? 'Updating Profile...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
