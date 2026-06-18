import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { CheckCircleIcon, XCircleIcon, UserPlusIcon } from '@heroicons/react/24/outline';

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Log in" />

            <div className="max-w-md w-full space-y-8 bg-white p-12 rounded-2xl shadow-xl border border-gray-200">
                {props.flash.success && (
                    <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-r-lg flex items-center">
                        <CheckCircleIcon className="w-5 h-5 mr-2" />
                        <p>{props.flash.success}</p>
                    </div>
                )}
                {props.flash.error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg flex items-center">
                        <XCircleIcon className="w-5 h-5 mr-2" />
                        <p>{props.flash.error}</p>
                    </div>
                )}
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-indigo-600">
                        UDOM VMS
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Staff Login
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={submit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label htmlFor="login" className="block text-sm font-medium text-gray-700 mb-1">
                                Email or Phone Number
                            </label>
                            <input
                                id="login"
                                name="login"
                                type="text"
                                required
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-white transition"
                                placeholder="Email or phone number"
                                value={data.login}
                                onChange={(e) => setData('login', e.target.value)}
                            />
                            {errors.login && <div className="text-red-500 text-xs mt-1">{errors.login}</div>}
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-white transition"
                                placeholder="Password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition">
                                Forgot your password?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out shadow-md hover:shadow-lg"
                        >
                            {processing ? 'Logging in...' : 'Sign in'}
                        </button>
                    </div>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="text-center space-y-4">
                        <p className="text-sm text-gray-500">Don't have an account?</p>
                        <a
                            href={route('visitor.register')}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition duration-150 ease-in-out shadow-md hover:shadow-lg"
                        >
                            <UserPlusIcon className="w-5 h-5" />
                            Register as Visitor
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
