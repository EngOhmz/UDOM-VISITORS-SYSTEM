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
    PlusIcon
} from '@heroicons/react/24/outline';
import { Menu } from '@headlessui/react';

const getNavigation = (userRole) => {
    const baseNav = [
        { name: 'Dashboard', href: '/', icon: HomeIcon, roles: ['admin', 'staff', 'secretary', 'visitor'] },
        { name: 'Visit Requests', href: '/requests', icon: CalendarIcon, roles: ['admin', 'staff', 'secretary', 'visitor'] },
        { name: 'Visitor Logs', href: '/logs', icon: ClipboardDocumentCheckIcon, roles: ['admin', 'staff', 'secretary'] },
    ];
    
    const visitorNav = [
        { name: 'New Request', href: '/visitor/request', icon: PlusIcon, roles: ['visitor'] },
    ];
    
    const adminNav = [
        { name: 'Offices', href: '/offices', icon: OfficeBuildingIcon, roles: ['admin'] },
        { name: 'Visitors', href: '/visitors', icon: UsersIcon, roles: ['admin'] },
        { name: 'Users', href: '/users', icon: UsersIcon, roles: ['admin'] },
        { name: 'Roles & Permissions', href: '/roles', icon: ShieldCheckIcon, roles: ['admin'] },
        { name: 'Reports', href: '/reports', icon: DocumentReportIcon, roles: ['admin', 'staff'] },
    ];
    
    let navigation = [...baseNav, ...visitorNav, ...adminNav].filter(item => item.roles.includes(userRole));
    
    // Rename "Visit Requests" to "My Requests" for visitors
    if (userRole === 'visitor') {
        navigation = navigation.map(item => {
            if (item.name === 'Visit Requests') {
                return { ...item, name: 'My Requests' };
            }
            return item;
        });
    }
    
    return navigation;
};

export default function AuthenticatedLayout({ children, title }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { url, props } = usePage();
    const user = props.auth.user;
    const navigation = getNavigation(user.role);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile sidebar */}
            <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-40 md:hidden">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
                />

                <div className="fixed inset-0 flex">
                    <DialogPanel
                        transition
                        className="relative flex w-full max-w-xs flex-1 transform flex-col bg-indigo-700 transition duration-300 ease-in-out data-[closed]:-translate-x-full"
                    >
                        <Transition show={sidebarOpen} as={Fragment}>
                            <div className="absolute top-0 right-0 -mr-12 pt-2">
                                <TransitionChild
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <button
                                        type="button"
                                        className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <span className="sr-only">Close sidebar</span>
                                        <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                    </button>
                                </TransitionChild>
                            </div>
                        </Transition>
                        
                        <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                            <div className="flex-shrink-0 flex items-center px-4">
                            <span className="text-white text-2xl font-bold tracking-wider">UDOM VMS</span>
                        </div>
                            <nav className="mt-5 px-2 space-y-1">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors duration-150 ${
                                            url === item.href || (item.href !== '/' && url.startsWith(item.href))
                                                ? 'bg-indigo-800 text-white'
                                                : 'text-white hover:bg-indigo-600'
                                        }`}
                                    >
                                        <item.icon className={`mr-4 flex-shrink-0 h-6 w-6 transition-colors duration-150 ${
                                            url === item.href || (item.href !== '/' && url.startsWith(item.href))
                                                ? 'text-white'
                                                : 'text-indigo-300 group-hover:text-white'
                                        }`} aria-hidden="true" />
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                        <div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
                            <Link href="/logout" method="post" as="button" className="flex-shrink-0 group block w-full">
                                <div className="flex items-center">
                                    <div>
                                        <LogoutIcon className="inline-block h-9 w-9 text-indigo-300" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-base font-medium text-white">Logout</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </DialogPanel>
                    <div className="w-14 flex-shrink-0" aria-hidden="true">
                        {/* Dummy element to force sidebar to shrink to fit close icon */}
                    </div>
                </div>
            </Dialog>

            {/* Static sidebar for desktop */}
            <div className={`hidden md:flex md:flex-col md:fixed md:inset-y-0 transition-all duration-300 ease-in-out ${isCollapsed ? 'md:w-20' : 'md:w-64'}`}>
                <div className="flex-1 flex flex-col min-h-0 bg-indigo-700 relative">
                    {/* Collapse/Expand Toggle Button */}
                    <button 
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="absolute -right-3 top-10 bg-indigo-800 text-white rounded-full p-1 border border-indigo-600 z-50 hover:bg-indigo-900 transition-colors"
                    >
                        {isCollapsed ? <ChevronRightIcon className="h-4 w-4" /> : <ChevronLeftIcon className="h-4 w-4" />}
                    </button>

                    <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto overflow-x-hidden">
                        <div className={`flex items-center flex-shrink-0 px-4 transition-all duration-300 ${isCollapsed ? 'justify-center' : ''}`}>
                            {isCollapsed ? (
                                <span className="text-white text-xl font-bold tracking-wider">U</span>
                            ) : (
                                <span className="text-white text-2xl font-bold tracking-wider">UDOM VMS</span>
                            )}
                        </div>
                        <nav className="mt-8 flex-1 px-2 space-y-2">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    title={isCollapsed ? item.name : ''}
                                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                                        url === item.href || (item.href !== '/' && url.startsWith(item.href))
                                            ? 'bg-indigo-800 text-white shadow-sm'
                                            : 'text-white hover:bg-indigo-600'
                                    } ${isCollapsed ? 'justify-center' : ''}`}
                                >
                                    <item.icon className={`flex-shrink-0 h-6 w-6 transition-colors duration-150 ${
                                        url === item.href || (item.href !== '/' && url.startsWith(item.href))
                                            ? 'text-white'
                                            : 'text-indigo-300 group-hover:text-white'
                                    } ${isCollapsed ? '' : 'mr-3'}`} aria-hidden="true" />
                                    {!isCollapsed && <span className="truncate">{item.name}</span>}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
                        <Link href="/logout" method="post" as="button" className={`flex-shrink-0 group block w-full transition-all duration-300 ${isCollapsed ? 'flex justify-center' : ''}`}>
                            <div className="flex items-center">
                                <LogoutIcon className="inline-block h-6 w-6 text-indigo-300 group-hover:text-white" />
                                {!isCollapsed && (
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-white">Logout</p>
                                    </div>
                                )}
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${isCollapsed ? 'md:pl-20' : 'md:pl-64'}`}>
                {/* Top Navigation Bar */}
                <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-20">
                    <div className="flex items-center md:hidden">
                        <button
                            type="button"
                            className="p-2 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <MenuIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>

                    <div className="flex-1 flex justify-end">
                        <Menu as="div" className="ml-3 relative">
                            <div>
                                <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 p-1 hover:bg-gray-50 transition-colors border border-gray-100">
                                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-2">
                                        {user.name.charAt(0)}
                                    </div>
                                    <span className="hidden sm:block text-gray-700 font-medium mr-1">{user.name}</span>
                                    <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                                </Menu.Button>
                            </div>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                href="/profile"
                                                className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700 flex items-center`}
                                            >
                                                <UserCircleIcon className="h-4 w-4 mr-2 text-gray-400" />
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
                                                className={`${active ? 'bg-gray-100' : ''} block w-full text-left px-4 py-2 text-sm text-gray-700 flex items-center`}
                                            >
                                                <LogoutIcon className="h-4 w-4 mr-2 text-gray-400" />
                                                Sign out
                                            </Link>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </header>

                <main className="flex-1">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            <h1 className="text-2xl font-bold text-gray-900 mb-6">{title}</h1>
                        </div>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
