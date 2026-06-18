import React, { useState, Fragment } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Dialog, DialogBackdrop, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import {
    HomeIcon,
    UsersIcon,
    CalendarIcon,
    ClipboardDocumentCheckIcon,
    DocumentChartBarIcon as DocumentReportIcon,
    Bars3Icon as MenuIcon,
    XMarkIcon as XIcon,
    ArrowLeftOnRectangleIcon as LogoutIcon,
    BuildingOfficeIcon as OfficeBuildingIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ShieldCheckIcon,
    ChevronDownIcon,
    UserCircleIcon,
    PlusIcon,
    CheckCircleIcon,
    XCircleIcon,
    AcademicCapIcon,
} from '@heroicons/react/24/outline';
import { Menu } from '@headlessui/react';

const roleLabels = {
    admin: 'Administrator',
    staff: 'Staff',
    secretary: 'Secretary',
    visitor: 'Visitor',
};

const getNavigation = (userRole) => {
    const baseNav = [
        { name: 'Dashboard', href: '/', icon: HomeIcon, roles: ['admin', 'staff', 'secretary', 'visitor'] },
        { name: 'Visit Requests', href: '/requests', icon: CalendarIcon, roles: ['admin', 'staff', 'secretary', 'visitor'] },
        { name: 'Visitor Confirmation', href: '/logs', icon: ClipboardDocumentCheckIcon, roles: ['admin', 'staff', 'secretary'] },
    ];

    const visitorNav = [
        { name: 'New Request', href: '/visitor/request', icon: PlusIcon, roles: ['visitor'] },
    ];

    const adminNav = [
        { name: 'Offices', href: '/offices', icon: OfficeBuildingIcon, roles: ['admin'] },
        { name: 'Departments', href: '/departments', icon: OfficeBuildingIcon, roles: ['admin'] },
        { name: 'Visitors', href: '/visitors', icon: UsersIcon, roles: ['admin'] },
        { name: 'Users', href: '/users', icon: UsersIcon, roles: ['admin'] },
        { name: 'Roles & Permissions', href: '/roles', icon: ShieldCheckIcon, roles: ['admin'] },
        { name: 'Reports', href: '/reports', icon: DocumentReportIcon, roles: ['admin', 'staff', 'secretary'] },
    ];

    let navigation = [...baseNav, ...visitorNav, ...adminNav].filter(item => item.roles.includes(userRole));

    if (userRole === 'visitor') {
        navigation = navigation.map(item =>
            item.name === 'Visit Requests' ? { ...item, name: 'My Requests' } : item
        );
    }

    return navigation;
};

function isActive(url, href) {
    return url === href || (href !== '/' && url.startsWith(href));
}

function SidebarBrand({ collapsed }) {
    return (
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shrink-0">
                <AcademicCapIcon className="w-6 h-6 text-white" />
            </div>
            {!collapsed && (
                <div className="min-w-0">
                    <h1 className="text-white font-bold text-base leading-tight tracking-wide">UDOM VMS</h1>
                    <p className="text-emerald-200/60 text-[11px] font-medium truncate">University of Dodoma</p>
                </div>
            )}
        </div>
    );
}

function NavLinks({ navigation, url, collapsed, onNavigate }) {
    return (
        <nav className="space-y-1 px-3">
            {!collapsed && (
                <p className="px-3 pt-2 pb-2 text-[10px] font-bold uppercase tracking-widest text-emerald-200/40">
                    Navigation
                </p>
            )}
            {navigation.map((item) => {
                const active = isActive(url, item.href);
                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        title={collapsed ? item.name : ''}
                        onClick={onNavigate}
                        className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                            active ? 'udom-nav-active' : 'udom-nav-inactive'
                        } ${collapsed ? 'justify-center' : ''}`}
                    >
                        <item.icon
                            className={`flex-shrink-0 h-5 w-5 ${
                                active ? 'text-gold-400' : 'text-emerald-200/70 group-hover:text-white'
                            } ${collapsed ? '' : 'mr-3'}`}
                        />
                        {!collapsed && <span className="truncate">{item.name}</span>}
                    </Link>
                );
            })}
        </nav>
    );
}

function UserAvatar({ user, size = 'md' }) {
    const sizes = { sm: 'h-8 w-8 text-sm', md: 'h-9 w-9 text-sm', lg: 'h-10 w-10 text-base' };
    if (user?.avatar) {
        return (
            <img
                src={user.avatar}
                alt={user.name}
                className={`${sizes[size]} rounded-full object-cover ring-2 ring-white/20`}
            />
        );
    }
    return (
        <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white font-bold shrink-0`}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
    );
}

export default function AuthenticatedLayout({ children, title }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { url, props } = usePage();
    const user = props.auth.user;
    const navigation = getNavigation(user.role);
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const sidebarContent = (collapsed, onNavigate) => (
        <>
            <div className="px-4 py-5 border-b border-white/10">
                <SidebarBrand collapsed={collapsed} />
            </div>

            <div className="flex-1 overflow-y-auto udom-scrollbar py-4">
                <NavLinks navigation={navigation} url={url} collapsed={collapsed} onNavigate={onNavigate} />
            </div>

            <div className="border-t border-white/10 p-4">
                {!collapsed && (
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <UserAvatar user={user} size="md" />
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                            <p className="text-xs text-emerald-200/60">{roleLabels[user.role] || user.role}</p>
                        </div>
                    </div>
                )}
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className={`flex items-center w-full px-3 py-2.5 text-sm font-medium text-emerald-100/80 hover:text-white hover:bg-white/10 rounded-xl transition-all ${
                        collapsed ? 'justify-center' : ''
                    }`}
                >
                    <LogoutIcon className={`h-5 w-5 ${collapsed ? '' : 'mr-3'}`} />
                    {!collapsed && 'Sign Out'}
                </Link>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Mobile sidebar */}
            <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 md:hidden">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 data-[closed]:opacity-0"
                />
                <div className="fixed inset-0 flex">
                    <DialogPanel
                        transition
                        className="relative flex w-full max-w-xs flex-1 flex-col bg-gradient-to-b from-udom-900 via-udom-800 to-udom-950 transition duration-300 data-[closed]:-translate-x-full"
                    >
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400" />
                        <button
                            type="button"
                            className="absolute top-4 right-4 p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <XIcon className="h-6 w-6" />
                        </button>
                        {sidebarContent(false, () => setSidebarOpen(false))}
                    </DialogPanel>
                </div>
            </Dialog>

            {/* Desktop sidebar */}
            <div className={`hidden md:flex md:flex-col md:fixed md:inset-y-0 transition-all duration-300 ${isCollapsed ? 'md:w-[72px]' : 'md:w-64'}`}>
                <div className="flex flex-col flex-1 min-h-0 bg-gradient-to-b from-udom-900 via-udom-800 to-udom-950 relative shadow-xl">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400" />
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="absolute -right-3 top-16 z-50 w-6 h-6 bg-udom-700 text-white rounded-full border-2 border-udom-900 flex items-center justify-center hover:bg-udom-600 transition-colors shadow-md"
                    >
                        {isCollapsed ? <ChevronRightIcon className="h-3.5 w-3.5" /> : <ChevronLeftIcon className="h-3.5 w-3.5" />}
                    </button>
                    {sidebarContent(isCollapsed)}
                </div>
            </div>

            {/* Main content */}
            <div className={`flex flex-col flex-1 transition-all duration-300 ${isCollapsed ? 'md:pl-[72px]' : 'md:pl-64'}`}>
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <MenuIcon className="h-6 w-6" />
                            </button>
                            <div className="hidden sm:block">
                                <h1 className="text-lg font-bold text-slate-900">{title}</h1>
                                <p className="text-xs text-slate-400">{today}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="hidden lg:inline-flex udom-badge bg-udom-50 text-udom-700 border border-udom-200 px-3 py-1">
                                {roleLabels[user.role]}
                            </span>

                            <Menu as="div" className="relative">
                                <Menu.Button className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all focus:outline-none focus:ring-2 focus:ring-udom-500 focus:ring-offset-2">
                                    <UserAvatar user={user} size="sm" />
                                    <span className="hidden sm:block text-sm font-semibold text-slate-700 max-w-[120px] truncate">
                                        {user.name}
                                    </span>
                                    <ChevronDownIcon className="h-4 w-4 text-slate-400" />
                                </Menu.Button>
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-udom-lg ring-1 ring-slate-200 focus:outline-none overflow-hidden">
                                        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                                            <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                                            <p className="text-xs text-slate-500">{user.email || user.phone}</p>
                                        </div>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    href="/profile"
                                                    className={`${active ? 'bg-udom-50' : ''} flex items-center px-4 py-2.5 text-sm text-slate-700`}
                                                >
                                                    <UserCircleIcon className="h-4 w-4 mr-3 text-slate-400" />
                                                    Your Profile
                                                </Link>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    href="/logout"
                                                    method="post"
                                                    as="button"
                                                    className={`${active ? 'bg-red-50' : ''} flex items-center w-full px-4 py-2.5 text-sm text-red-600`}
                                                >
                                                    <LogoutIcon className="h-4 w-4 mr-3" />
                                                    Sign Out
                                                </Link>
                                            )}
                                        </Menu.Item>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </div>
                    </div>
                </header>

                {/* Flash messages */}
                {(props.flash?.success || props.flash?.error) && (
                    <div className="px-4 sm:px-6 lg:px-8 pt-4">
                        {props.flash.success && (
                            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl">
                                <CheckCircleIcon className="w-5 h-5 shrink-0 text-emerald-500" />
                                <p className="text-sm font-medium">{props.flash.success}</p>
                            </div>
                        )}
                        {props.flash.error && (
                            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl mt-2">
                                <XCircleIcon className="w-5 h-5 shrink-0 text-red-500" />
                                <p className="text-sm font-medium">{props.flash.error}</p>
                            </div>
                        )}
                    </div>
                )}

                <main className="flex-1">
                    <div className="py-6 sm:py-8">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="sm:hidden mb-4">
                                <h1 className="text-xl font-bold text-slate-900">{title}</h1>
                            </div>
                            {children}
                        </div>
                    </div>
                </main>

                <footer className="border-t border-slate-200 bg-white py-4 px-6">
                    <p className="text-center text-xs text-slate-400">
                        © {new Date().getFullYear()} University of Dodoma — Visitor Management System
                    </p>
                </footer>
            </div>
        </div>
    );
}
