'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    MoreVertical,
    Trash2,
    X,
    Sparkles,
    Wallet,
    Banknote,
    AlertTriangle,
    Calendar
} from 'lucide-react';
import { deleteIncome, updateIncome } from '@/actions/incomes';
import { MonthSelector } from '@/components/ui/MonthSelector';

interface IncomeItemProps {
    income: {
        id: string;
        description: string;
        amount: number;
        source: string;
        date: Date;
        type: string;
        isRecurring?: boolean;
        startDate?: Date; // For recurring logic context
        personId?: string;
    };
    people?: any[];
    currentUserName?: string;
    viewMonth?: number;
    viewYear?: number;
}

export function IncomeItem({ income, people = [], currentUserName = 'Yo', viewMonth, viewYear }: IncomeItemProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const getTypeIcon = (type: string) => {
        return type === 'EXTRA' ? <Banknote size={14} /> : <Wallet size={14} />;
    };

    const handleDeleteClick = () => {
        setIsMenuOpen(false);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        setIsDeleting(true);
        // Pass isRecurring flag to action
        await deleteIncome(income.id, !!income.isRecurring);
        setIsDeleting(false);
        setShowDeleteConfirm(false);
    };

    const handleUpdate = async (formData: FormData) => {
        // Inject isRecurring flag
        formData.append('isRecurring', income.isRecurring ? 'true' : 'false');
        await updateIncome(formData);
        setIsEditOpen(false);
        setIsMenuOpen(false);
    };

    // Determine date to show in Input
    // If recurring, we show the VIEW month context, so user feels they are editing "This Month".
    const displayDate = income.isRecurring && viewMonth && viewYear
        ? new Date(viewYear, viewMonth - 1, 1).toISOString().slice(0, 7) // YYYY-MM
        : new Date(income.date).toISOString().slice(0, 7);

    const ModalContent = (
        <div className="modal-overlay" onClick={() => setIsEditOpen(false)} style={{ zIndex: 999999 }}>
            <div className="modal-window" onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 850, letterSpacing: '-0.5px', marginBottom: '4px' }}>Editar Ingreso</h2>
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                            {income.isRecurring
                                ? "Modificando Ingreso Mensual (Sueldo)."
                                : "Modifica los detalles del ingreso."}
                        </p>
                    </div>
                    <button
                        onClick={() => setIsEditOpen(false)}
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

                <form action={handleUpdate}>
                    <input type="hidden" name="id" value={income.id} />

                    <div className="modal-body">
                        <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                            <label className="form-label-premium" style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.75rem' }}>Concepto</label>
                            <input
                                name="description"
                                className="input-premium"
                                defaultValue={income.description}
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
                                    defaultValue={income.amount}
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label-premium" style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.75rem' }}>Origen</label>
                                <input
                                    name="source"
                                    className="input-premium"
                                    defaultValue={income.source}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                            <label className="form-label-premium" style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.75rem' }}>
                                {income.isRecurring ? 'Mes de Inicio / Efectivo' : 'Fecha'}
                            </label>

                            {income.isRecurring ? (
                                <>
                                    <MonthSelector
                                        name="date"
                                        defaultValue={displayDate}
                                        required
                                    />
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.5rem', lineHeight: '1.4' }}>
                                        Si cambias la fecha o monto, se aplicará como un aumento/ajuste desde ese mes en adelante.
                                    </p>
                                </>
                            ) : (
                                <div style={{ position: 'relative' }}>
                                    <input
                                        name="date"
                                        type="date"
                                        className="input-premium"
                                        defaultValue={new Date(income.date).toISOString().split('T')[0]}
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

                        {/* Person Selector */}
                        <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                            <label className="form-label-premium" style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.75rem' }}>¿Quién lo recibe?</label>
                            <select
                                name="personId"
                                defaultValue={income.personId || 'me'}
                                className="input-premium"
                                style={{ appearance: 'none', cursor: 'pointer' }}
                            >
                                <option value="me">{currentUserName}</option>
                                {people.map((p) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <footer className="modal-footer">
                        <button type="button" onClick={() => setIsEditOpen(false)} className="btn-premium btn-ghost">
                            Cancelar
                        </button>
                        <button type="submit" className="btn-premium btn-primary-wave" style={{ background: 'var(--success)' }}>
                            <Sparkles size={20} />
                            Guardar Cambios
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );

    return (
        <>
            <div
                className="expense-item"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1.25rem 1.75rem',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '20px',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    zIndex: isMenuOpen ? 50 : 1,
                    opacity: isDeleting ? 0.5 : 1,
                    transform: isMenuOpen ? 'scale(1.02)' : 'scale(1)',
                    boxShadow: isMenuOpen ? '0 10px 40px -10px rgba(0,0,0,0.5)' : 'none'
                }}
                onClick={() => !isMenuOpen && console.log("View details")}
            >
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{
                        width: '52px',
                        height: '52px',
                        background: 'var(--success-bg)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--success)',
                        border: '1px solid rgba(16, 185, 129, 0.2)'
                    }}>
                        {getTypeIcon(income.type)}
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>{income.description}</h3>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            <span style={{ color: 'var(--success)', fontWeight: 600, background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>{income.source}</span>
                            <span>•</span>
                            <span>{income.isRecurring ? 'Mensual (Fijo)' : 'Ingreso Extra'}</span>
                            <span>•</span>
                            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                                {income.personId ? (people.find(p => p.id === income.personId)?.name || 'Persona') : currentUserName}
                            </span>
                            {/* Only show day date if NOT recurring, or just show Month if recurring */}
                            <span>•</span>
                            <span>
                                {income.isRecurring && viewMonth && viewYear
                                    ? new Date(viewYear, viewMonth - 1, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
                                    : new Date(income.date).toLocaleDateString()
                                }
                            </span>
                        </div>
                    </div>
                </div>

                <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 850, color: 'var(--success)' }}>
                        +${income.amount.toLocaleString()}
                    </div>

                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMenuOpen(!isMenuOpen);
                            }}
                            style={{
                                background: isMenuOpen ? 'var(--success)' : 'transparent',
                                border: 'none',
                                color: isMenuOpen ? '#fff' : 'var(--text-muted)',
                                cursor: 'pointer',
                                padding: '0.5rem',
                                borderRadius: '50%',
                                transition: '0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <MoreVertical size={20} />
                        </button>

                        {isMenuOpen && (
                            <>
                                <div
                                    style={{ position: 'fixed', inset: 0, zIndex: 10 }}
                                    onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }}
                                />
                                <div className="animate-ready" style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: '120%',
                                    background: '#1a1d26',
                                    border: '1px solid var(--border)',
                                    borderRadius: '16px',
                                    padding: '0.75rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.5rem',
                                    zIndex: 100,
                                    width: '180px',
                                    boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                                    animationDuration: '0.2s'
                                }}>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setIsEditOpen(true); setIsMenuOpen(false); }}
                                        className="btn"
                                        style={{
                                            justifyContent: 'flex-start',
                                            fontSize: '0.95rem',
                                            color: 'var(--text-main)',
                                            background: 'rgba(255,255,255,0.03)',
                                            padding: '0.75rem 1rem',
                                            borderRadius: '10px'
                                        }}
                                    >
                                        <span style={{ marginRight: '8px' }}>✏️</span> Editar
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDeleteClick(); }}
                                        className="btn"
                                        style={{
                                            justifyContent: 'flex-start',
                                            fontSize: '0.95rem',
                                            color: '#ff4d4d',
                                            background: 'rgba(244, 63, 94, 0.1)',
                                            padding: '0.75rem 1rem',
                                            borderRadius: '10px',
                                            fontWeight: 600
                                        }}
                                    >
                                        <span style={{ marginRight: '8px' }}>🗑️</span> Eliminar
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Render Modal via Portal */}
            {isEditOpen && mounted && createPortal(ModalContent, document.body)}

            {/* Custom Delete Confirmation Modal */}
            {showDeleteConfirm && mounted && createPortal(
                <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)} style={{ zIndex: 9999999 }}>
                    <div
                        className="modal-window animate-ready"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            maxWidth: '400px',
                            textAlign: 'center',
                            padding: '2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '1.5rem'
                        }}
                    >
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: 'rgba(244, 63, 94, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fb7185'
                        }}>
                            <AlertTriangle size={32} />
                        </div>

                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>¿Eliminar Ingreso?</h3>
                            <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>
                                Esta acción irreversable.
                                {income.isRecurring && " Se detendrá este ingreso mensual."}
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%' }}>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="btn-premium btn-ghost"
                                style={{ justifyContent: 'center' }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="btn-premium"
                                style={{
                                    background: 'var(--error)',
                                    justifyContent: 'center',
                                    color: 'white',
                                    boxShadow: '0 4px 12px rgba(244, 63, 94, 0.4)'
                                }}
                            >
                                Sí, Eliminar
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
