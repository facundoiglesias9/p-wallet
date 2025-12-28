'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { SavingForm } from '@/components/features/savings/SavingForm';

interface AddSavingButtonProps {
    currency: string;
}

export function AddSavingButton({ currency }: AddSavingButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    background: 'var(--bg-card-hover)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-main)',
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: '0.2s'
                }}
                title={`Agregar Ahorro en ${currency}`}
            >
                <Plus size={18} />
            </button>

            {isOpen && (
                <SavingForm
                    initialCurrency={currency}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
