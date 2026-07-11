import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { AcademicCapIcon, CheckCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function ForgotPassword() {
    const { data, setData, post, processing, errors } = useForm({
        login: '',
    });
    const { props } = usePage();

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
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
                    {props.flash?.success && (
                        <div className="mb-6 flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm">
                            <CheckCircleIcon className="w-5 h-5 shrink-0" />
                            <p>{props.flash.success}</p>
                        </div>
                    )}

                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">Forgot Password</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Enter your email or phone number. We will send a reset link to the email on your account.
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
                                value={data.login}
                                onChange={(e) => setData('login', e.target.value)}
                                className={`block w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-udom-500 text-sm ${
                                    errors.login ? 'border-red-300' : 'border-slate-200'
                                }`}
                                placeholder="Enter your email or phone"
                                required
                            />
                            {errors.login && <p className="text-red-500 text-xs mt-1.5">{errors.login}</p>}
                        </div>

                        <button type="submit" disabled={processing} className="udom-btn-primary w-full py-3">
                            {processing ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                        <Link href={route('login')} className="inline-flex items-center gap-1.5 text-sm font-medium text-udom-600 hover:text-udom-700">
                            <ArrowLeftIcon className="w-4 h-4" />
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
