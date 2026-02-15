import { Fragment, useState } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, LogOut, Menu, X, Plus } from 'lucide-react';

export default function Layout() {
    const { logout, user } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Leads', href: '/leads', icon: Users },
        { name: 'Add Lead', href: '/leads/new', icon: Plus },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 z-50 flex w-72 flex-col bg-white shadow-lg transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex h-16 shrink-0 items-center px-6">
                    <Link to="/" className="flex items-center" onClick={() => setSidebarOpen(false)}>
                        <LayoutDashboard className="h-8 w-8 text-blue-600" />
                        <span className="ml-2 text-xl font-bold tracking-tight text-gray-900">Mini CRM</span>
                    </Link>
                    <button className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}>
                        <X className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                <nav className="flex flex-1 flex-col px-6 py-4">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                            <ul role="list" className="-mx-2 space-y-1">
                                {navigation.map((item) => (
                                    <li key={item.name}>
                                        <NavLink
                                            to={item.href}
                                            end={item.href === '/'}
                                            onClick={() => setSidebarOpen(false)}
                                            className={({ isActive }) =>
                                                `group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 ${isActive
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                                                }`
                                            }
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    <item.icon
                                                        className={`h-6 w-6 shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                                                            }`}
                                                    />
                                                    {item.name}
                                                </>
                                            )}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </li>

                        <li className="mt-auto">
                            <div className="flex items-center gap-x-4 py-3 text-sm font-semibold leading-6 text-gray-900">
                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    {user?.username?.charAt(0).toUpperCase() || 'A'}
                                </div>
                                <span className="sr-only">Your profile</span>
                                <span aria-hidden="true">{user?.username || 'Admin'}</span>
                                <button
                                    onClick={logout}
                                    className="ml-auto text-gray-400 hover:text-gray-500"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Main content */}
            <div className="lg:pl-72">
                <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
                    <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
                        <span className="sr-only">Open sidebar</span>
                        <Menu className="h-6 w-6" />
                    </button>
                    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                        <div className="flex flex-1"></div>
                        <div className="flex items-center gap-x-4 lg:gap-x-6">
                            {/* Header actions can go here */}
                        </div>
                    </div>
                </div>

                <main className="py-10">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
