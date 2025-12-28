'use client';

import { useState } from 'react';
import { X, Plus, Sparkles, Calendar, Wallet, Banknote } from 'lucide-react';
import { createIncome } from '../income_actions';
import { MonthSelector } from '@/components/MonthSelector';

export function IncomeForm({ people = [], currentUserName = 'Yo' }: { people?: any[], currentUserName?: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState('MONTHLY'); // MONTHLY, EXTRA
    const [personId, setPersonId] = useState('me');

    async function handleSubmit(formData: FormData) {
        await createIncome(formData);
        setIsOpen(false);
        setType('MONTHLY'); // Reset default
        setPersonId('me');
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="btn-premium btn-green-pulse"
                style={{
                    background: 'var(--success)',
                    color: '#fff',
                    padding: '0.75rem 1.75rem',
                    borderRadius: '16px',
                }}
            >
                <Plus size={18} />
                Nuevo Ingreso
            </button>

            {isOpen && (
                <div className="modal-overlay" onClick={() => setIsOpen(false)}>
                    <div className="modal-window" onClick={(e) => e.stopPropagation()}>
                        <header className="modal-header">
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 850, letterSpacing: '-0.5px', marginBottom: '4px' }}>Registrar Ingreso</h2>
                                <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Añade dinero a tu cuenta.</p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    border: 'none',
                                    color: 'var(--text-dim)',
                                    padding: '10px',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    transition: '0.2s',
                                    display: 'flex'
                                }}
                            >
                                <X size={20} />
                            </button>
                        </header>

                        <form action={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                                    <label className="form-label-premium" style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.75rem' }}>Concepto / Descripción</label>
                                    <input
                                        name="description"
                                        className="input-premium"
                                        placeholder="Ej: Sueldo, Venta de..."
                                        autoFocus
                                        required
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.75rem' }}>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label-premium" style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.75rem' }}>Monto</label>
                                        <input
                                            name="amount"
                                            type="number"
                                            step="0.01"
                                            className="input-premium"
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label-premium" style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.75rem' }}>Origen</label>
                                        <input
                                            name="source"
                                            className="input-premium"
                                            placeholder="Ej: Trabajo, Changas..."
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Income Type Selector */}
                                <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                                    <label className="form-label-premium" style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.75rem' }}>Tipo de Ingreso</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                        <button
                                            type="button"
                                            onClick={() => setType('MONTHLY')}
                                            style={{
                                                padding: '1.1rem 0.5rem',
                                                borderRadius: '16px',
                                                border: '1px solid',
                                                borderColor: type === 'MONTHLY' ? 'var(--success)' : 'rgba(255,255,255,0.05)',
                                                background: type === 'MONTHLY' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255,255,255,0.02)',
                                                color: type === 'MONTHLY' ? 'var(--success)' : 'var(--text-dim)',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '0.6rem',
                                                fontSize: '0.8rem',
                                                fontWeight: 700,
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                            }}
                                        >
                                            <Wallet size={20} />
                                            Mensual / Sueldo
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setType('EXTRA')}
                                            style={{
                                                padding: '1.1rem 0.5rem',
                                                borderRadius: '16px',
                                                border: '1px solid',
                                                borderColor: type === 'EXTRA' ? 'var(--success)' : 'rgba(255,255,255,0.05)',
                                                background: type === 'EXTRA' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255,255,255,0.02)',
                                                color: type === 'EXTRA' ? 'var(--success)' : 'var(--text-dim)',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '0.6rem',
                                                fontSize: '0.8rem',
                                                fontWeight: 700,
                                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                            }}
                                        >
                                            <Banknote size={20} />
                                            Diario / Extra
                                        </button>
                                    </div>
                                    <input type="hidden" name="type" value={type} />
                                </div>

                                {/* Person Selector */}
                                <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                                    <label className="form-label-premium" style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.75rem' }}>¿Quién lo recibe?</label>
                                    <select
                                        name="personId"
                                        value={personId}
                                        onChange={(e) => setPersonId(e.target.value)}
                                        className="input-premium"
                                        style={{ appearance: 'none', cursor: 'pointer' }}
                                    >
                                        <option value="me">{currentUserName}</option>
                                        {people.map((p) => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label-premium" style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.75rem' }}>
                                        {type === 'MONTHLY' ? 'Mes de Recepción' : 'Fecha de Recepción'}
                                    </label>

                                    {type === 'MONTHLY' ? (
                                        <MonthSelector
                                            name="date"
                                            defaultValue="2026-01"
                                            required
                                        />
                                    ) : (
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                name="date"
                                                type="date"
                                                className="input-premium"
                                                defaultValue="2026-01-01"
                                                required
                                                style={{ cursor: 'pointer' }}
                                            />
                                            <Calendar
                                                size={20}
                                                color="white"
                                                style={{
                                                    position: 'absolute',
                                                    right: '1.25rem',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    pointerEvents: 'none',
                                                    zIndex: 10
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <footer className="modal-footer">
                                <button type="button" onClick={() => setIsOpen(false)} className="btn-premium btn-ghost">
                                    Descartar
                                </button>
                                <button type="submit" className="btn-premium btn-primary-wave" style={{ background: 'var(--success)' }}>
                                    <Sparkles size={20} />
                                    Guardar Ingreso
                                </button>
                            </footer>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
