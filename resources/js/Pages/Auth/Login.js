import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { CheckCircleIcon, XCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import UdomLogo from '../../Components/UdomLogo';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        login: '',
        password: '',
        remember: false,
    });
    const { props } = usePage();
    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen bg-white font-['Ropa_Sans',_'Segoe_UI',_sans-serif]">
            <Head title="Sign In" />
            <link
                href="https://fonts.googleapis.com/css2?family=Ropa+Sans:ital,wght@0,400;1,400&display=swap"
                rel="stylesheet"
            />

            <div className="min-h-screen grid lg:grid-cols-[7fr_5fr]">
                {/* Left media panel — matches UDOM SRMS cover */}
                <div className="hidden lg:flex items-center justify-center p-8 pr-0">
                    <div className="relative w-full h-[calc(100vh-4rem)] rounded-[1.125rem] overflow-hidden border border-[#02569d] bg-[#02569d] flex items-center justify-center p-3">
                        <img
                            src="/images/auth/campus-banner.png"
                            alt="UDOM Visitor Management System"
                            className="max-w-full max-h-full w-auto h-auto object-contain"
                        />
                    </div>
                </div>

                {/* Right form column */}
                <div className="flex items-center justify-center px-6 py-10 sm:px-12">
                    <div className="w-full max-w-[400px]">
                        <div className="flex justify-center mb-6">
                            <Link href="/" className="inline-flex">
                                <UdomLogo className="w-[150px] h-[150px]" />
                            </Link>
                        </div>

                        <div className="text-center mb-6">
                            <h1 className="text-[1.35rem] font-bold text-[#5d596c] leading-snug mb-1">
                                Welcome to Visitor Management System (VMS)
                            </h1>
                            <p className="text-[#a5a3ae] text-[0.95rem]">
                                Please sign-in to your account and start the session
                            </p>
                        </div>

                        {props.flash?.success && (
                            <div className="mb-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2.5 rounded-md text-sm">
                                <CheckCircleIcon className="w-5 h-5 shrink-0" />
                                <p>{props.flash.success}</p>
                            </div>
                        )}
                        {props.flash?.error && (
                            <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 px-3 py-2.5 rounded-md text-sm">
                                <XCircleIcon className="w-5 h-5 shrink-0" />
                                <p>{props.flash.error}</p>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label htmlFor="login" className="block text-[13px] text-[#5d596c] mb-1">
                                    Email or Phone
                                </label>
                                <input
                                    id="login"
                                    type="text"
                                    autoFocus
                                    required
                                    className="block w-full px-3.5 py-2 text-[0.9375rem] text-[#6f6b7d] bg-white border border-[#dbdade] rounded-md placeholder:text-[#b7b5be] focus:outline-none focus:border-[#0066cc] focus:shadow-[0_0.125rem_0.25rem_rgba(165,163,174,0.3)]"
                                    placeholder="Enter your email or phone"
                                    value={data.login}
                                    onChange={(e) => setData('login', e.target.value)}
                                />
                                {errors.login && <p className="text-[#ea5455] text-xs mt-1">{errors.login}</p>}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-[13px] text-[#5d596c] mb-1">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    className="block w-full px-3.5 py-2 text-[0.9375rem] text-[#6f6b7d] bg-white border border-[#dbdade] rounded-md placeholder:text-[#b7b5be] focus:outline-none focus:border-[#0066cc] focus:shadow-[0_0.125rem_0.25rem_rgba(165,163,174,0.3)]"
                                    placeholder="Enter your password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                {errors.password && <p className="text-[#ea5455] text-xs mt-1">{errors.password}</p>}
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={showPassword}
                                    onChange={(e) => setShowPassword(e.target.checked)}
                                    className="h-4 w-4 rounded border-[#dbdade] text-[#0066cc] focus:ring-[#0066cc]"
                                />
                                <span className="text-[0.9375rem] text-[#6f6b7d]">Show Password</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="h-4 w-4 rounded border-[#dbdade] text-[#0066cc] focus:ring-[#0066cc]"
                                />
                                <span className="text-[0.9375rem] text-[#6f6b7d]">Remember me</span>
                            </label>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full inline-flex items-center justify-center gap-3 bg-[#0066cc] hover:bg-[#02569d] text-white text-[0.9375rem] font-medium py-2.5 px-5 rounded-md transition disabled:opacity-70"
                            >
                                {processing ? 'Loading...' : 'Sign in'}
                                {!processing && <ArrowRightOnRectangleIcon className="w-5 h-5" />}
                            </button>
                        </form>

                        <p className="text-center mt-4 text-[0.9375rem] text-[#6f6b7d]">
                            Forgot Password{' '}
                            <Link href={route('password.request')} className="text-[#0066cc] hover:text-[#02569d] font-medium">
                                Click Here ?
                            </Link>
                        </p>

                        <p className="text-center mt-3 text-[0.9375rem] text-[#6f6b7d]">
                            New visitor?{' '}
                            <a href={route('visitor.register')} className="text-[#0066cc] hover:text-[#02569d] font-medium">
                                Create account
                            </a>
                        </p>

                        <div className="my-6 flex items-center gap-3">
                            <div className="flex-1 h-px bg-[rgba(0,102,204,0.2)]" />
                            <p className="text-[0.8rem] text-[#6f6b7d] whitespace-nowrap px-1">
                                Copyright © {new Date().getFullYear()} UDOM VMS
                            </p>
                            <div className="flex-1 h-px bg-[rgba(0,102,204,0.2)]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
