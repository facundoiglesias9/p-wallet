'use client';

import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export function MonthPicker() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentMonth = searchParams.get('month')
        ? parseInt(searchParams.get('month')!)
        : 0; // Default January

    const currentYear = searchParams.get('year')
        ? parseInt(searchParams.get('year')!)
        : 2026; // Default 2026

    const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const changeMonth = useCallback((direction: number) => {
        let newMonth = currentMonth + direction;
        let newYear = currentYear;

        if (newMonth > 11) {
            newMonth = 0;
            newYear += 1;
        } else if (newMonth < 0) {
            newMonth = 11;
            newYear -= 1;
        }

        // Bloquear fechas anteriores a Enero 2026
        if (newYear < 2026) return;

        const params = new URLSearchParams(searchParams.toString());
        params.set('month', newMonth.toString());
        params.set('year', newYear.toString());

        // Use the current pathname to stay on the same page (Expenses, Incomes, etc.)
        const pathname = window.location.pathname;
        router.push(`${pathname}?${params.toString()}`);
    }, [currentMonth, currentYear, router, searchParams]);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '0.75rem 1.5rem',
            borderRadius: '24px',
            border: '1px solid var(--border)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
        }}>
            <button
                onClick={() => changeMonth(-1)}
                style={{
                    background: 'var(--bg-card-hover)',
                    border: 'none',
                    color: 'var(--text-main)',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: '0.2s'
                }}
            >
                <ChevronLeft size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: '180px', justifyContent: 'center' }}>
                <Calendar size={20} color="var(--primary)" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.5px', color: 'var(--text-main)' }}>
                    {months[currentMonth]} {currentYear}
                </h2>
            </div>

            <button
                onClick={() => changeMonth(1)}
                style={{
                    background: 'var(--bg-card-hover)',
                    border: 'none',
                    color: 'var(--text-main)',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: '0.2s'
                }}
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
}
