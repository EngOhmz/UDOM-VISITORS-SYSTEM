import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import PasswordInput from '../../../Components/PasswordInput';
import PasswordRequirements from '../../../Components/PasswordRequirements';
import UdomLogo from '../../../Components/UdomLogo';

const inputClass = 'block w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-udom-500 focus:border-udom-500 text-sm';
const inputErrorClass = 'block w-full px-4 py-2.5 border border-red-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 text-sm bg-red-50/30';

function fieldClass(hasError) {
    return hasError ? inputErrorClass : inputClass;
}

export default function VisitorRegister() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        id_number: '',
        organization: '',
        password: '',
        password_confirmation: '',
    });
    const { props } = usePage();

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('visitor.register'), {
            preserveScroll: true,
        });
    };

    const serverError = Object.values(errors).find(Boolean);
    const isExistingMember = Boolean(errors.phone || errors.email);

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Visitor Registration" />

            <div className="max-w-lg mx-auto">
                <div className="flex flex-col items-center gap-3 mb-8">
                    <div className="w-20 h-20 rounded-full bg-white shadow-lg p-1 flex items-center justify-center border border-slate-100">
                        <UdomLogo className="w-full h-full" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-xl font-bold text-udom-800">UDOM VMS</h1>
                        <p className="text-xs text-slate-500">University of Dodoma — Visitor Registration</p>
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

                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
                        <p className="mt-1 text-sm text-slate-500">Register to request campus visits</p>
                    </div>

                    {serverError && (
                        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                            <p className="font-semibold mb-1">
                                {isExistingMember ? 'Account already exists' : 'Please fix the following'}
                            </p>
                            <p>{serverError}</p>
                            {isExistingMember && (
                                <a href={route('visitor.login')} className="inline-block mt-2 font-semibold text-udom-700 hover:text-udom-800">
                                    Sign in instead →
                                </a>
                            )}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name *</label>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className={fieldClass(errors.name)} />
                            {errors.name && <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number *</label>
                            <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)} className={fieldClass(errors.phone)} />
                            {errors.phone && <p className="mt-1.5 text-sm text-red-600">{errors.phone}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className={fieldClass(errors.email)} />
                            {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">ID Number</label>
                                <input type="text" value={data.id_number} onChange={e => setData('id_number', e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Organization</label>
                                <input type="text" value={data.organization} onChange={e => setData('organization', e.target.value)} className={inputClass} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password *</label>
                            <PasswordInput value={data.password} onChange={e => setData('password', e.target.value)} className={fieldClass(errors.password)} />
                            <PasswordRequirements />
                            {errors.password && <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm Password *</label>
                            <PasswordInput value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} className={fieldClass(errors.password_confirmation)} />
                            {errors.password_confirmation && <p className="mt-1.5 text-sm text-red-600">{errors.password_confirmation}</p>}
                        </div>

                        <button type="submit" disabled={processing} className="udom-btn-primary w-full py-3 mt-2">
                            {processing ? 'Registering...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                        <p className="text-sm text-slate-500">
                            Already have an account?{' '}
                            <a href={route('visitor.login')} className="font-semibold text-udom-600 hover:text-udom-700">
                                Sign in here
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
