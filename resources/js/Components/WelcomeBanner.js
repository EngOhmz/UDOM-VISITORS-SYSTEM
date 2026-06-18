import React from 'react';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

const roleLabels = {
    admin: 'System Administrator',
    staff: 'University Staff',
    secretary: 'Office Secretary',
    visitor: 'Registered Visitor',
};

const roleBadgeStyles = {
    admin: 'bg-gold-500/20 text-gold-400 border-gold-400/40',
    staff: 'bg-white/10 text-emerald-100 border-white/20',
    secretary: 'bg-white/10 text-emerald-100 border-white/20',
    visitor: 'bg-white/10 text-emerald-100 border-white/20',
};

export default function WelcomeBanner({ name, role, subtitle }) {
    const roleLabel = roleLabels[role] || role;
    const badgeStyle = roleBadgeStyles[role] || roleBadgeStyles.visitor;

    return (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-udom-800 via-udom-700 to-udom-900 p-8 shadow-udom-lg mb-8">
            <div className="absolute inset-0 opacity-10">
                <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gold-400" />
                <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white" />
            </div>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400" />

            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="flex items-start gap-5">
                    <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm items-center justify-center border border-white/20 shrink-0">
                        <AcademicCapIcon className="w-8 h-8 text-gold-400" />
                    </div>
                    <div>
                        <p className="text-emerald-200/80 text-sm font-medium mb-1">University of Dodoma</p>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">
                            Welcome, {name?.split(' ')[0] || 'User'}
                        </h2>
                        <p className="mt-2 text-emerald-100/70 text-sm sm:text-base max-w-xl">
                            {subtitle || 'Visitor Management System — manage campus visits securely and efficiently.'}
                        </p>
                    </div>
                </div>
                <span className={`self-start sm:self-center udom-badge border px-4 py-1.5 text-sm ${badgeStyle}`}>
                    {roleLabel}
                </span>
            </div>
        </div>
    );
}
