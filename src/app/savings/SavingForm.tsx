'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles } from 'lucide-react';
import { createSaving } from '../savings_actions';
import { MonthSelector } from '@/components/MonthSelector';

interface SavingFormProps {
    initialAmount?: number;
    initialCurrency?: string;
    onClose?: () => void;
}

export function SavingForm({ initialAmount = 0, initialCurrency = 'ARS', onClose }: SavingFormProps) {
    const [amount, setAmount] = useState(initialAmount > 0 ? initialAmount.toString() : '');
    const [currency, setCurrency] = useState(initialCurrency);
    const [description, setDescription] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    async function handleSubmit(formData: FormData) {
        await createSaving(formData);
        if (onClose) onClose();
    }

    if (!mounted) return null;

    return createPortal(
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 999999 }}>
            <div className="modal-window animate-ready" onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 850, letterSpacing: '-0.5px', marginBottom: '4px' }}>Nuevo Ahorro</h2>
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Registra un nuevo ingreso a tus ahorros.</p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: 'none',
                            color: 'var(--text-dim)',
                            padding: '10px',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            display: 'flex'
                        }}
                    >
                        <X size={20} />
                    </button>
                </header>

                <form action={handleSubmit}>
                    <div className="modal-body">
                        {/* Amount & Currency Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', marginBottom: '1.75rem' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label-premium" style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.75rem' }}>Monto</label>
                                <input
                                    type="number"
                                    name="amount"
                                    step="0.01"
                                    required
                                    className="input-premium"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label-premium" style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.75rem' }}>Moneda</label>
                                <div style={{ display: 'flex', background: 'var(--bg-main)', borderRadius: '12px', padding: '4px', border: '1px solid var(--border)' }}>
                                    {['ARS', 'USD'].map((cur) => (
                                        <button
                                            key={cur}
                                            type="button"
                                            onClick={() => setCurrency(cur)}
                                            style={{
                                                flex: 1,
                                                padding: '0.5rem',
                                                borderRadius: '8px',
                                                border: 'none',
                                                background: currency === cur ? 'var(--primary)' : 'transparent',
                                                color: currency === cur ? '#fff' : 'var(--text-dim)',
                                                fontWeight: 700,
                                                cursor: 'pointer',
                                                fontSize: '0.9rem',
                                                transition: '0.2s'
                                            }}
                                        >
                                            {cur}
                                        </button>
                                    ))}
                                </div>
                                <input type="hidden" name="currency" value={currency} />
                            </div>
                        </div>

                        {/* Date (Month Selector) */}
                        <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                            <label className="form-label-premium" style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.75rem' }}>Mes del Ahorro</label>
                            <MonthSelector name="date" required />
                        </div>

                        {/* Description */}
                        <div className="form-group">
                            <label className="form-label-premium" style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.75rem' }}>Concepto (Opcional)</label>
                            <input
                                type="text"
                                name="description"
                                className="input-premium"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Ej: Aguinaldo, Retorno inversión..."
                            />
                        </div>
                    </div>

                    <footer className="modal-footer">
                        <button type="button" onClick={onClose} className="btn-premium btn-ghost">
                            Cancelar
                        </button>
                        <button type="submit" className="btn-premium btn-primary-wave" style={{ background: 'var(--primary)' }}>
                            <Sparkles size={20} />
                            Guardar Ahorro
                        </button>
                    </footer>
                </form>
            </div>
        </div>,
        document.body
    );
}
