'use client';

import { useClerk } from '@clerk/nextjs';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
    const { signOut } = useClerk();

    const handleSignOut = async () => {
        const btn = document.getElementById('logout-btn');
        if (btn) {
            btn.innerHTML = 'Cerrando sesión...';
            btn.style.opacity = '0.7';
            btn.style.pointerEvents = 'none'; // Evitar doble clic
        }

        // Forzamos el cierre de sesión y redirigimos explícitamente
        await signOut({ redirectUrl: '/' });

        // Si signOut devuelve la promesa resuelta, forzamos recarga por si acaso
        // para limpiar cualquier estado en memoria
        window.location.href = '/';
    };

    return (
        <button
            id="logout-btn"
            onClick={handleSignOut}
            className="btn"
            style={{
                background: 'rgba(244, 63, 94, 0.15)',
                color: '#f43f5e',
                border: '1px solid #f43f5e',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '1rem',
                transition: 'all 0.2s ease',
                width: 'auto'
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.background = '#f43f5e';
                e.currentTarget.style.color = '#fff';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(244, 63, 94, 0.15)';
                e.currentTarget.style.color = '#f43f5e';
            }}
        >
            <LogOut size={20} />
            Cerrar Sesión Ahora
        </button>
    );
}
