import React from 'react';

const colorMap = {
    emerald: {
        icon: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
        accent: 'from-emerald-500 to-teal-500',
    },
    amber: {
        icon: 'bg-amber-50 text-amber-600 ring-amber-100',
        accent: 'from-amber-500 to-orange-500',
    },
    blue: {
        icon: 'bg-udom-50 text-udom-700 ring-udom-100',
        accent: 'from-udom-600 to-udom-500',
    },
    rose: {
        icon: 'bg-rose-50 text-rose-600 ring-rose-100',
        accent: 'from-rose-500 to-pink-500',
    },
    gold: {
        icon: 'bg-amber-50 text-amber-700 ring-amber-100',
        accent: 'from-gold-500 to-gold-400',
    },
};

export default function StatCard({ title, value, icon: Icon, color = 'emerald', subtitle }) {
    const styles = colorMap[color] || colorMap.emerald;

    return (
        <div className="udom-card p-6 group hover:-translate-y-0.5">
            <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl ring-1 ${styles.icon}`}>
                    <Icon className="h-6 w-6" />
                </div>
                <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${styles.accent} opacity-60 group-hover:opacity-100 transition-opacity`} />
            </div>
            <div className="mt-5">
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <p className="mt-1 text-3xl font-bold text-slate-900 tracking-tight">{value ?? 0}</p>
                {subtitle && (
                    <p className="mt-2 text-xs text-slate-400">{subtitle}</p>
                )}
            </div>
        </div>
    );
}
