'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    MoreVertical,
    Trash2,
    X,
    Sparkles,
    RefreshCw,
    Calendar,
    CreditCard,
    AlertTriangle,
    Users
} from 'lucide-react';
import { deleteExpense, updateExpense } from '@/app/actions';
import { MonthSelector } from './MonthSelector';

interface Category {
    id: string;
    name: string;
}

interface ExpenseItemProps {
    expense: any;
    categories: Category[];
}

export function ExpenseItem({ expense, categories }: ExpenseItemProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const [editIsShared, setEditIsShared] = useState(expense.isShared);
    const [editPaidBy, setEditPaidBy] = useState(expense.paidBy || 'me');

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'SUBSCRIPTION': return <RefreshCw size={14} />;
            case 'INSTALLMENT': return <CreditCard size={14} />;
            default: return <Calendar size={14} />;
        }
    };

    const getTypeLabel = (type: string, current?: number, total?: number) => {
        switch (type) {
            case 'SUBSCRIPTION': return 'Suscripción';
            case 'INSTALLMENT': return `Cuota ${current}/${total}`;
            default: return 'Gasto Único';
        }
    };

    const handleDeleteClick = () => {
        setIsMenuOpen(false);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        setIsDeleting(true);
        await deleteExpense(expense.id);
        setIsDeleting(false);
        setShowDeleteConfirm(false);
    };

    const handleUpdate = async (formData: FormData) => {
        await updateExpense(formData);
        setIsEditOpen(false);
        setIsMenuOpen(false);
    };

    const ModalContent = (
        <div className="modal-overlay" onClick={() => setIsEditOpen(false)} style={{ zIndex: 999999 }}>
            <div className="modal-window" onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 850, letterSpacing: '-0.5px', marginBottom: '4px' }}>Editar Gasto</h2>
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Modifica los detalles del movimiento.</p>
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
                    <input type="hidden" name="id" value={expense.id} />

                    <div className="modal-body">
                        <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                            <label className="form-label-premium" style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.75rem' }}>Concepto</label>
                            <input
                                name="description"
                                className="input-premium"
                                defaultValue={expense.description}
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
                                    defaultValue={expense.amount}
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label-premium" style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.75rem' }}>Categoría</label>
                                <select name="category" className="input-premium" defaultValue={expense.category} required>
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
                                defaultValue={new Date(expense.date).toISOString().slice(0, 7)}
                                required
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                            <div
                                onClick={() => setEditIsShared(!editIsShared)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    background: editIsShared ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255,255,255,0.03)',
                                    padding: '1rem',
                                    borderRadius: '16px',
                                    cursor: 'pointer',
                                    border: '1px solid',
                                    borderColor: editIsShared ? 'var(--primary)' : 'transparent',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        background: editIsShared ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                        padding: '8px',
                                        borderRadius: '10px',
                                        color: editIsShared ? '#fff' : 'var(--text-muted)'
                                    }}>
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <span style={{ display: 'block', fontWeight: 700, fontSize: '0.95rem' }}>Gasto Compartido</span>
                                        <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                                            {editIsShared ? 'Se dividirá 50/50' : 'Gasto personal'}
                                        </span>
                                    </div>
                                </div>
                                <div style={{
                                    width: '40px',
                                    height: '24px',
                                    background: editIsShared ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
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
                                        left: editIsShared ? '19px' : '3px',
                                        transition: '0.3s',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                    }} />
                                </div>
                            </div>
                            <input type="hidden" name="isShared" value={editIsShared ? 'on' : ''} />

                            {editIsShared && (
                                <div className="animate-ready" style={{ marginTop: '1rem', paddingLeft: '0.5rem' }}>
                                    <label className="form-label-premium" style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.75rem' }}>Pagado Por</label>
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        {[
                                            { id: 'me', label: 'Mí' },
                                            { id: 'other', label: 'Otro / Roommate' }
                                        ].map((p) => (
                                            <button
                                                key={p.id}
                                                type="button"
                                                onClick={() => setEditPaidBy(p.id)}
                                                style={{
                                                    flex: 1,
                                                    padding: '0.75rem',
                                                    borderRadius: '12px',
                                                    border: '1px solid',
                                                    borderColor: editPaidBy === p.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                                    background: editPaidBy === p.id ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.02)',
                                                    color: editPaidBy === p.id ? 'var(--primary)' : 'var(--text-dim)',
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
                                    <input type="hidden" name="paidBy" value={editPaidBy} />
                                </div>
                            )}
                        </div>
                    </div>

                    <footer className="modal-footer">
                        <button type="button" onClick={() => setIsEditOpen(false)} className="btn-premium btn-ghost">
                            Cancelar
                        </button>
                        <button type="submit" className="btn-premium btn-primary-wave" style={{ background: 'var(--primary)' }}>
                            <Sparkles size={20} />
                            Guardar Cambios
                        </button>
                    </footer>
                </form>
            </div >
        </div >
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
                        background: 'var(--bg-card-hover)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-dim)',
                        border: '1px solid var(--border)'
                    }}>
                        {getTypeIcon(expense.type)}
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>{expense.description}</h3>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            <span style={{ color: 'var(--primary)', fontWeight: 600, background: 'rgba(99, 102, 241, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>{expense.category}</span>
                            <span>•</span>

                            {expense.isShared && (
                                <>
                                    <span style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        color: expense.paidBy === 'other' ? 'var(--warning)' : 'var(--text-dim)'
                                    }}>
                                        <Users size={12} />
                                        {expense.paidBy === 'other' ? 'Pagó Otro' : 'Compartido'}
                                    </span>
                                    <span>•</span>
                                </>
                            )}
                            <span>{getTypeLabel(expense.type, expense.installmentNumber || 1, expense.installmentsTotal || 1)}</span>
                            <span>•</span>
                            <span>{new Date(expense.date).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 850, color: 'var(--text-main)' }}>
                        -${expense.amount.toLocaleString()}
                    </div>

                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMenuOpen(!isMenuOpen);
                            }}
                            style={{
                                background: isMenuOpen ? 'var(--primary)' : 'transparent',
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

            {/* Render Modal via Portal to escape stacking context */}
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
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>¿Eliminar Gasto?</h3>
                            <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>
                                Esta acción no se puede deshacer. ¿Estás seguro de que quieres continuar?
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
