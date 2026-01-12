'use client';

import { migrateOldDataToCurrentUser } from '@/actions/migration';
import { DatabaseBackup, Loader2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

export function DataMigration() {
    const [isPending, startTransition] = useTransition();
    const [migrated, setMigrated] = useState(false);

    const handleMigration = () => {
        if (!confirm('¿Estás seguro?\n\nEsto buscará todos los datos en la base de datos que NO te pertenezcan y te los asignará a TI.\n\nÚsalo solo si estás recuperando datos de una instalación anterior.')) {
            return;
        }

        startTransition(async () => {
            const result = await migrateOldDataToCurrentUser();
            if (result.success) {
                toast.success(result.message);
                setMigrated(true);
            } else {
                toast.error(result.error);
            }
        });
    };

    if (migrated) {
        return (
            <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '12px', border: '1px solid var(--success)' }}>
                ¡Migración exitosa! Tus datos antiguos ahora están asociados a tu cuenta.
            </div>
        );
    }

    return (
        <div style={{
            background: 'var(--bg-card-hover)',
            padding: '1.5rem',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
        }}>
            <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <DatabaseBackup size={20} className="text-warning" />
                    Recuperación de Datos
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
                    Si tenías datos creados antes de iniciar sesión con Clerk, usa este botón para recuperarlos y asignarlos a tu usuario actual.
                </p>
            </div>

            <button
                onClick={handleMigration}
                disabled={isPending}
                className="btn-premium"
                style={{
                    background: 'var(--warning)',
                    color: '#000', // Texto negro para mejor contraste en botón amarillo
                    width: 'fit-content',
                    minWidth: '200px',
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                {isPending ? <Loader2 className="animate-spin" /> : 'Recuperar Datos Antiguos'}
            </button>
        </div>
    );
}
