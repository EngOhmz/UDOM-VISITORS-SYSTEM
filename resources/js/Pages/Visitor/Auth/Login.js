import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { PhoneIcon, LockClosedIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import PasswordInput from '../../../Components/PasswordInput';
import UdomLogo from '../../../Components/UdomLogo';

export default function VisitorLogin() {
    const { data, setData, post, processing, errors } = useForm({
        phone: '',
        password: '',
    });
    const { props } = usePage();

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('visitor.login'));
    };

    return (
        <div className="min-h-screen flex">
            <Head title="Visitor Login" />

            <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-udom-900 via-udom-800 to-udom-950 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-gold-400" />
                </div>
                <div className="relative flex flex-col justify-center px-12 text-white">
                    <div className="w-20 h-20 rounded-full bg-white shadow-xl mb-6 p-1 flex items-center justify-center">
                        <UdomLogo className="w-full h-full" />
                    </div>
                    <p className="text-gold-400 text-sm font-semibold mb-2">Embracing Knowledge</p>
                    <h1 className="text-3xl font-bold mb-3">Visitor Portal</h1>
                    <p className="text-sky-100/70 leading-relaxed">
                        Sign in to manage your campus visit requests at the University of Dodoma.
                    </p>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6">
                <div className="w-full max-w-md">
                    <div className="lg:hidden flex flex-col items-center gap-3 mb-8">
                        <div className="w-16 h-16 rounded-full bg-white shadow-md p-1 flex items-center justify-center">
                            <UdomLogo className="w-full h-full" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-lg font-bold text-udom-800">UDOM VMS</h2>
                            <p className="text-xs text-slate-500">Visitor Portal</p>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-udom-lg border border-slate-200/80">
                        {props.flash?.success && (
                            <div className="mb-6 flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm">
                                <CheckCircleIcon className="w-5 h-5 shrink-0" />
                                <p>{props.flash.success}</p>
                            </div>
                        )}
                        {props.flash?.error && (
                            <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-sm">
                                <XCircleIcon className="w-5 h-5 shrink-0" />
                                <p>{props.flash.error}</p>
                            </div>
                        )}

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900">Visitor Login</h2>
                            <p className="mt-1 text-sm text-slate-500">Access your visit requests</p>
                        </div>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <PhoneIcon className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-udom-500 focus:border-udom-500 text-sm"
                                        placeholder="e.g. 255712345678"
                                        required
                                    />
                                </div>
                                {errors.phone && <p className="mt-1.5 text-sm text-red-600">{errors.phone}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                                <PasswordInput
                                    leftIcon={LockClosedIcon}
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className="block w-full py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-udom-500 focus:border-udom-500 text-sm"
                                    required
                                />
                                {errors.password && <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>}
                            </div>

                            <div className="flex items-center justify-end">
                                <Link href={route('password.request')} className="text-sm font-medium text-udom-600 hover:text-udom-700">
                                    Forgot password?
                                </Link>
                            </div>

                            <button type="submit" disabled={processing} className="udom-btn-primary w-full py-3">
                                {processing ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-slate-100 space-y-3 text-center">
                            <p className="text-sm text-slate-500">
                                Don't have an account?{' '}
                                <a href={route('visitor.register')} className="font-semibold text-udom-600 hover:text-udom-700">
                                    Register here
                                </a>
                            </p>
                            <a href={route('login')} className="inline-block text-sm text-slate-400 hover:text-slate-600">
                                Staff Login →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
