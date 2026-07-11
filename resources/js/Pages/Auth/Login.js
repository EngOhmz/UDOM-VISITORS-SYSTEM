import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { CheckCircleIcon, XCircleIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import PasswordInput from '../../Components/PasswordInput';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        login: '',
        password: '',
        remember: false,
    });
    const { props } = usePage();

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen flex">
            <Head title="Sign In" />

            {/* Left branding panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-udom-900 via-udom-800 to-udom-950 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-gold-400" />
                    <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-white" />
                </div>
                <div className="relative flex flex-col justify-center px-16 text-white">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-xl mb-8">
                        <AcademicCapIcon className="w-9 h-9 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold leading-tight mb-4">
                        University of Dodoma
                    </h1>
                    <p className="text-xl text-emerald-100/80 font-medium mb-6">Visitor Management System</p>
                    <p className="text-emerald-200/60 text-base leading-relaxed max-w-md">
                        A secure platform for managing campus visits, visitor registrations, and office access across all university departments.
                    </p>
                    <div className="mt-12 flex gap-8">
                        <div>
                            <p className="text-3xl font-bold text-gold-400">UDOM</p>
                            <p className="text-xs text-emerald-200/50 mt-1">Est. 2007</p>
                        </div>
                        <div className="w-px bg-white/20" />
                        <div>
                            <p className="text-sm text-emerald-200/70">Secure · Professional · Efficient</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right login form */}
            <div className="flex-1 flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                            <AcademicCapIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-udom-800">UDOM VMS</h2>
                            <p className="text-xs text-slate-500">University of Dodoma</p>
                        </div>
                    </div>

                    <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-udom-lg border border-slate-200/80">
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
                            <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Sign in with your email or phone number to access the UDOM Visitor Management System.
                            </p>

                        </div>

                        <form className="space-y-5" onSubmit={submit}>
                            <div>
                                <label htmlFor="login" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    Email or Phone Number
                                </label>
                                <input
                                    id="login"
                                    type="text"
                                    required
                                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-udom-500 focus:border-udom-500 text-sm bg-white transition"
                                    placeholder="Enter your email or phone"
                                    value={data.login}
                                    onChange={(e) => setData('login', e.target.value)}
                                />
                                {errors.login && <p className="text-red-500 text-xs mt-1.5">{errors.login}</p>}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    Password
                                </label>
                                <PasswordInput
                                    id="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-udom-500 focus:border-udom-500 text-sm bg-white transition"
                                    placeholder="Enter your password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password}</p>}
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 text-udom-600 focus:ring-udom-500 border-slate-300 rounded"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                    />
                                    <span className="text-sm text-slate-600">Remember me</span>
                                </label>
                                <Link href={route('password.request')} className="text-sm font-medium text-udom-600 hover:text-udom-700">
                                    Forgot password?
                                </Link>
                            </div>

                            <button type="submit" disabled={processing} className="udom-btn-primary w-full py-3">
                                {processing ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-slate-100 text-center space-y-2">
                            <p className="text-sm text-slate-500">
                                New to UDOM VMS?{' '}
                                <a href={route('visitor.register')} className="font-semibold text-udom-600 hover:text-udom-700">
                                    Create a visitor account
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
