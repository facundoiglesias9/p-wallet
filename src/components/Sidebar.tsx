'use client';
import {
    Wallet,
    Settings,
    LogOut,
    History,
    LayoutDashboard,
    CreditCard,
    LayoutGrid,
    PiggyBank,
    CheckCircle2,
    Users
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/app/login/actions';

export function Sidebar() {
    const pathname = usePathname();

    if (pathname === '/login') return null;

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
        { name: 'Gastos', icon: CreditCard, href: '/expenses' },
        { name: 'Pagos Mensuales', icon: CheckCircle2, href: '/payments' },
        { name: 'Saldos', icon: Users, href: '/shared' },
        { name: 'Ingresos', icon: Wallet, href: '/incomes' },
        { name: 'Categorías', icon: LayoutGrid, href: '/categories' },
        { name: 'Ahorros', icon: PiggyBank, href: '/savings' },
        { name: 'Historial', icon: History, href: '/history' },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <Wallet size={32} strokeWidth={2.5} style={{ color: 'var(--primary)' }} />
                <span>P-Wallet</span>
            </div>

            <nav style={{ flex: 1 }}>
                <ul className="nav-list">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`nav-item ${isActive ? 'active' : ''}`}
                                >
                                    <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                    {item.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="sidebar-footer" style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
                <ul className="nav-list">
                    <li>
                        <Link href="/settings" className={`nav-item nav-item-settings ${pathname === '/settings' ? 'active' : ''}`}>
                            <Settings size={20} />
                            Configuración
                        </Link>
                    </li>
                    <li>
                        <button
                            onClick={() => logout()}
                            className="nav-item nav-item-logout"
                            style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', marginTop: '0.5rem' }}
                        >
                            <LogOut size={20} />
                            Cerrar Sesión
                        </button>
                    </li>
                </ul>
            </div>
        </aside>
    );
}
