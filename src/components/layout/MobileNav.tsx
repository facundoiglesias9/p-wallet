'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CreditCard, Banknote, Target, Settings, CheckCircle2, Users, Layers } from 'lucide-react';

const menuItems = [
    { name: 'Inicio', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Gastos', icon: CreditCard, href: '/expenses' },
    { name: 'Pagos', icon: CheckCircle2, href: '/payments' },
    { name: 'Ingresos', icon: Banknote, href: '/incomes' },
    { name: 'Planes', icon: Target, href: '/plans' },
    { name: 'Categ.', icon: Layers, href: '/categories' },
    { name: 'Grupo', icon: Users, href: '/shared' },
    { name: 'Ajustes', icon: Settings, href: '/settings' },
];

export function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="mobile-nav">
            <div className="mobile-nav-container">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                        >
                            <div className="icon-wrapper">
                                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className="nav-label">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
