'use client';

import { useState } from 'react';
import { Trash2, AlertTriangle, X, Check } from 'lucide-react';
import { deleteAccount } from './actions';
import { createPortal } from 'react-dom';

export function DeleteAccountButton({ userId }: { userId: string }) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const formData = new FormData();
            formData.append('id', userId);
            await deleteAccount(formData);
        } catch (e) {
            console.error(e);
            setIsDeleting(false);
        }
        setShowConfirm(false);
    };

    return (
        <>
            <button
                onClick={() => setShowConfirm(true)}
                style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#ef4444',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    transition: 'all 0.2s'
                }}
            >
                <Trash2 size={16} />
                Eliminar
            </button>

            {showConfirm && createPortal(
                <div className="modal-overlay" onClick={() => setShowConfirm(false)} style={{ zIndex: 999999 }}>
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
                            gap: '1.5rem',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            boxShadow: '0 25px 50px -12px rgba(239, 68, 68, 0.25)'
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
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: '#ef4444' }}>¿Eliminar Cuenta?</h3>
                            <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                Esta acción es <strong>irreversible</strong>.<br />
                                Se borrarán todos los gastos, ingresos y datos asociados a este usuario permanentemente.
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%' }}>
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="btn-premium btn-ghost"
                                style={{ justifyContent: 'center' }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                className="btn-premium"
                                disabled={isDeleting}
                                style={{
                                    background: 'var(--error)',
                                    justifyContent: 'center',
                                    color: 'white',
                                    boxShadow: '0 4px 12px rgba(244, 63, 94, 0.4)',
                                    opacity: isDeleting ? 0.7 : 1
                                }}
                            >
                                {isDeleting ? 'Borrando...' : 'Sí, Eliminar'}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
