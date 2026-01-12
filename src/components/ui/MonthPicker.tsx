'use client';

import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { setDateFilter } from '@/actions/app-settings';

interface MonthPickerProps {
    initialMonth: number;
    initialYear: number;
}

export function MonthPicker({ initialMonth, initialYear }: MonthPickerProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const changeMonth = (direction: number) => {
        let newMonth = initialMonth + direction;
        let newYear = initialYear;

        if (newMonth > 11) {
            newMonth = 0;
            newYear += 1;
        } else if (newMonth < 0) {
            newMonth = 11;
            newYear -= 1;
        }

        startTransition(async () => {
            // 1. Guardar en cookie (Servidor)
            await setDateFilter(newMonth, newYear);
            // 2. Refrescar la página actual (Servidor renderizará con nueva cookie)
            router.refresh();
        });
    };

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
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            opacity: isPending ? 0.7 : 1,
            pointerEvents: isPending ? 'none' : 'auto',
            transition: 'opacity 0.2s'
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
                    {months[initialMonth]} {initialYear}
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
