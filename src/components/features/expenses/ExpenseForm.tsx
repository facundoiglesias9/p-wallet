'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles, CreditCard, RefreshCw, Calendar, Plus, Users } from 'lucide-react';
import { createExpense } from '@/actions/expenses';
import { MonthSelector } from '@/components/ui/MonthSelector';

interface Category {
    id: string;
    name: string;
}

interface Person {
    id: string;
    name: string;
}

export function ExpenseForm({
    categories,
    people = [],
    currentUserName = 'Yo',
    defaultMonth = 0,
    defaultYear = 2026
}: {
    categories: Category[],
    people?: Person[],
    currentUserName?: string,
    defaultMonth?: number,
    defaultYear?: number
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState('SINGLE');
    const [isShared, setIsShared] = useState(false);
    const [paidBy, setPaidBy] = useState('me');
    // Default to everyone selected initially
    const [selectedParticipants, setSelectedParticipants] = useState<string[]>(people.map(p => p.id));

    // Format for MonthSelector: YYYY-MM
    const defaultDateStr = `${defaultYear}-${(defaultMonth + 1).toString().padStart(2, '0')}`;

    // Update selection when people list changes (or on init)
    useEffect(() => {
        setSelectedParticipants(people.map(p => p.id));
    }, [people]);

    // Build paidBy options
    const paidByOptions = [
        { id: 'me', label: currentUserName },
        ...people.map(p => ({ id: p.id, label: p.name }))
    ];

    // Fallback if no people are added
    if (people.length === 0) {
        paidByOptions.push({ id: 'other', label: 'Otro / Roommate' });
    }

    async function handleSubmit(formData: FormData) {
        await createExpense(formData);
        setIsOpen(false);
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="btn-premium btn-red-pulse"
                style={{
                    background: 'var(--error)',
                    color: '#fff',
                    padding: '0.75rem 1.75rem',
                    borderRadius: '16px',
                }}
            >
                <Plus size={18} />
                Nuevo Gasto
            </button>

            {isOpen && (
                <div className="modal-overlay" onClick={() => setIsOpen(false)}>
                    <div className="modal-window" onClick={(e) => e.stopPropagation()}>
                        <header className="modal-header">
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 850, letterSpacing: '-0.5px', marginBottom: '4px' }}>Detalles del Gasto</h2>
                                <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Completa la información del movimiento.</p>
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
                                        placeholder="¿En qué gastaste?"
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
                                        <label className="form-label-premium" style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.75rem' }}>Categoría</label>
                                        <select name="category" className="input-premium" style={{ cursor: 'pointer' }} required>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                                    <label className="form-label-premium" style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.75rem' }}>Mes del Gasto</label>
                                    <MonthSelector
                                        name="date"
                                        defaultValue={defaultDateStr}
                                        required
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                                    <div
                                        onClick={() => setIsShared(!isShared)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            background: isShared ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.03)',
                                            padding: '1rem',
                                            borderRadius: '16px',
                                            cursor: 'pointer',
                                            border: '1px solid',
                                            borderColor: isShared ? 'var(--primary)' : 'transparent',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{
                                                background: isShared ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                                padding: '8px',
                                                borderRadius: '10px',
                                                color: isShared ? '#fff' : 'var(--text-muted)'
                                            }}>
                                                <Users size={20} />
                                            </div>
                                            <div>
                                                <span style={{ display: 'block', fontWeight: 700, fontSize: '0.95rem' }}>Gasto Compartido</span>
                                                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                                                    {isShared
                                                        ? `Se dividirá entre ${selectedParticipants.length + 1} personas`
                                                        : 'Gasto personal'}
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{
                                            width: '40px',
                                            height: '24px',
                                            background: isShared ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                            borderRadius: '99px',
                                            position: 'relative',
                                            transition: '0.3s'
                                        }}>
                                            <div style={{
                                                width: '18px',
                                                height: '18px',
                                                background: '#fff',
                                                borderRadius: '50%',
                                                position: 'absolute',
                                                top: '3px',
                                                left: isShared ? '19px' : '3px',
                                                transition: '0.3s',
                                                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                            }} />
                                        </div>
                                    </div>
                                    <input type="hidden" name="isShared" value={isShared ? 'on' : ''} />
                                    <input type="hidden" name="participantIds" value={JSON.stringify(selectedParticipants)} />

                                    {isShared && (
                                        <div className="animate-ready" style={{ marginTop: '1rem', paddingLeft: '0.5rem' }}>

                                            {/* Participants Selection */}
                                            {people.length > 0 && (
                                                <div style={{ marginBottom: '1.5rem' }}>
                                                    <label className="form-label-premium" style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.75rem' }}>¿Quiénes participan?</label>
                                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                        {people.map(person => {
                                                            const isSelected = selectedParticipants.includes(person.id);
                                                            return (
                                                                <button
                                                                    key={person.id}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        if (isSelected) {
                                                                            setSelectedParticipants(prev => prev.filter(id => id !== person.id));
                                                                        } else {
                                                                            setSelectedParticipants(prev => [...prev, person.id]);
                                                                        }
                                                                    }}
                                                                    style={{
                                                                        padding: '0.5rem 1rem',
                                                                        borderRadius: '99px',
                                                                        border: '1px solid',
                                                                        borderColor: isSelected ? 'var(--secondary)' : 'rgba(255,255,255,0.1)',
                                                                        background: isSelected ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                                                                        color: isSelected ? '#fff' : 'var(--text-dim)',
                                                                        fontSize: '0.85rem',
                                                                        fontWeight: 600,
                                                                        cursor: 'pointer',
                                                                        transition: 'all 0.2s'
                                                                    }}
                                                                >
                                                                    {person.name}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            <label className="form-label-premium" style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.75rem' }}>Pagado Por</label>
                                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                                {paidByOptions.map((p) => (
                                                    <button
                                                        key={p.id}
                                                        type="button"
                                                        onClick={() => setPaidBy(p.id)}
                                                        style={{
                                                            flex: 1,
                                                            minWidth: '45%',
                                                            padding: '0.75rem',
                                                            borderRadius: '12px',
                                                            border: '1px solid',
                                                            borderColor: paidBy === p.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                                            background: paidBy === p.id ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.02)',
                                                            color: paidBy === p.id ? 'var(--primary)' : 'var(--text-dim)',
                                                            fontWeight: 600,
                                                            fontSize: '0.9rem',
                                                            cursor: 'pointer',
                                                            transition: '0.2s'
                                                        }}
                                                    >
                                                        {p.label}
                                                    </button>
                                                ))}
                                            </div>
                                            <input type="hidden" name="paidBy" value={paidBy} />
                                        </div>
                                    )}
                                </div>

                                <div className="form-group" style={{ marginBottom: type === 'INSTALLMENT' ? '1.75rem' : 0 }}>
                                    <label className="form-label-premium" style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.75rem' }}>Modalidad de Gasto</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                                        {[
                                            { id: 'SINGLE', label: 'Único', icon: <Calendar size={18} /> },
                                            { id: 'SUBSCRIPTION', label: 'Suscrip.', icon: <RefreshCw size={18} /> },
                                            { id: 'INSTALLMENT', label: 'Cuotas', icon: <CreditCard size={18} /> },
                                        ].map((t) => (
                                            <button
                                                key={t.id}
                                                type="button"
                                                onClick={() => setType(t.id)}
                                                style={{
                                                    padding: '1.1rem 0.5rem',
                                                    borderRadius: '16px',
                                                    border: '1px solid',
                                                    borderColor: type === t.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                                    background: type === t.id ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255,255,255,0.02)',
                                                    color: type === t.id ? 'var(--primary)' : 'var(--text-dim)',
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
                                                {t.icon}
                                                {t.label}
                                            </button>
                                        ))}
                                    </div>
                                    <input type="hidden" name="type" value={type} />
                                </div>

                                {type === 'INSTALLMENT' && (
                                    <div className="form-group animate-ready" style={{ marginTop: '1.5rem' }}>
                                        <label className="form-label-premium" style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.75rem' }}>Cantidad de Cuotas</label>
                                        <input name="installmentsTotal" type="number" min="2" max="24" className="input-premium" defaultValue="3" required />
                                    </div>
                                )}
                            </div>

                            <footer className="modal-footer">
                                <button type="button" onClick={() => setIsOpen(false)} className="btn-premium btn-ghost">
                                    Descartar
                                </button>
                                <button type="submit" className="btn-premium btn-primary-wave" style={{ background: 'var(--primary)' }}>
                                    <Sparkles size={20} />
                                    Registrar Gasto
                                </button>
                            </footer>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
