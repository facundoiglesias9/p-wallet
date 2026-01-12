'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CreditCard, Banknote, Target, Settings, Wallet, CheckCircle2, Users } from 'lucide-react';
import { UserButton, useUser } from "@clerk/nextjs";

const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Gastos', icon: CreditCard, href: '/expenses' },
    { name: 'Pagos Mensuales', icon: CheckCircle2, href: '/payments' },
    { name: 'Ingresos', icon: Banknote, href: '/incomes' },
    { name: 'Planes de Gastos', icon: Target, href: '/plans' },
    { name: 'Compartidos', icon: Users, href: '/shared' },
    { name: 'Configuración', icon: Settings, href: '/settings' },
];

export function Sidebar() {
    const pathname = usePathname();
    const { user, isLoaded } = useUser();

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo-container">
                    <Wallet size={32} className="text-primary" />
                </div>
                <h1 className="app-title">
                    P-Wallet
                </h1>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-item ${isActive ? 'active' : ''}`}
                        >
                            <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile Section */}
            <div style={{
                marginTop: 'auto',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                paddingLeft: '0.5rem'
            }}>
                {isLoaded && (
                    <>
                        <UserButton afterSignOutUrl="/" />
                        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <span style={{
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                color: 'var(--text-main)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {user?.fullName || user?.firstName || user?.username || 'Usuario'}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                                Cuenta Personal
                            </span>
                        </div>
                    </>
                )}
            </div>
        </aside>
    );
}
