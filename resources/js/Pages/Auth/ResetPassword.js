import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { AcademicCapIcon } from '@heroicons/react/24/outline';
import PasswordInput from '../../Components/PasswordInput';
import PasswordRequirements from '../../Components/PasswordRequirements';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors } = useForm({
        token: token,
        email: email || '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.update'));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6">
            <div className="w-full max-w-md">
                <div className="flex items-center gap-3 mb-8 justify-center">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                        <AcademicCapIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-udom-800">UDOM VMS</h2>
                        <p className="text-xs text-slate-500">University of Dodoma</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-udom-lg border border-slate-200/80">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">Reset Password</h2>
                        <p className="mt-1 text-sm text-slate-500">Choose a new password for your account.</p>
                    </div>

                    <form className="space-y-5" onSubmit={submit}>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={`block w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-udom-500 text-sm ${
                                    errors.email ? 'border-red-300' : 'border-slate-200'
                                }`}
                                required
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">New Password</label>
                            <PasswordInput
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className={`block w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-udom-500 text-sm ${
                                    errors.password ? 'border-red-300' : 'border-slate-200'
                                }`}
                                required
                            />
                            <PasswordRequirements />
                            {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password</label>
                            <PasswordInput
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-udom-500 text-sm"
                                required
                            />
                        </div>

                        <button type="submit" disabled={processing} className="udom-btn-primary w-full py-3">
                            {processing ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
