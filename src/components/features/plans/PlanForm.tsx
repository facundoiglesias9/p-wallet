'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { createPlan } from '@/actions/plans';
import { Plus, Loader2, X, Link as LinkIcon, DollarSign, List, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function PlanForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        // Bloquear scroll cuando se abre
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        const res = await createPlan(formData);
        setIsPending(false);
        if (res?.success) {
            setIsOpen(false);
            router.refresh();
        } else {
            alert('Error al crear plan');
        }
    }

    // Botón normal (siempre visible en su lugar original)
    const triggerButton = (
        <button
            onClick={() => setIsOpen(true)}
            className="btn-shimmer"
            style={{
                background: 'var(--primary)',
                color: '#fff',
                padding: '0.75rem 2rem',
                borderRadius: '16px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer',
                fontSize: '1rem',
                margin: '0 auto 2rem auto'
            }}
        >
            <Plus size={22} strokeWidth={2.5} />
            Nuevo Plan
        </button>
    );

    // Contenido del Modal
    const modalContent = isOpen ? (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            animation: 'fadeIn 0.2s ease-out'
        }} onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
        }}>
            <div
                className="animate-scale-in custom-scrollbar"
                style={{
                    background: '#1a1b26',
                    width: '100%',
                    maxWidth: '500px', // Un poco más angosto para elegancia
                    maxHeight: '90vh', // Evitar que se salga si la pantalla es chica
                    overflowY: 'auto', // Scroll interno si hace falta
                    borderRadius: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                {/* Header decorativo fijo arriba del scroll */}
                <div style={{
                    height: '6px',
                    width: '100%',
                    background: 'linear-gradient(90deg, #6366f1, #ec4899)',
                    flexShrink: 0
                }} />

                <div style={{ padding: '1.5rem 2rem', flexShrink: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', margin: 0 }}>
                                Nuevo Plan
                            </h3>
                            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginTop: '4px' }}>Define tu próxima meta de compra.</p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: 'none',
                                color: 'var(--text-dim)',
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: '0.2s'
                            }}
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <div style={{ padding: '0 2rem 2rem 2rem', overflowY: 'auto' }}>
                    <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                        <div className="input-modern-group">
                            <label className="input-label-modern">Nombre del Producto</label>
                            <input
                                name="name"
                                type="text"
                                className="input-modern"
                                placeholder="Ej. iPhone 15 Pro"
                                required
                                autoFocus
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="input-modern-group">
                                <label className="input-label-modern">
                                    <DollarSign size={14} style={{ marginRight: '4px' }} /> Precio Total
                                </label>
                                <input name="amount" type="number" step="0.01" className="input-modern" placeholder="0.00" required />
                            </div>
                            <div className="input-modern-group">
                                <label className="input-label-modern">
                                    <List size={14} style={{ marginRight: '4px' }} /> Cuotas
                                </label>
                                <input name="installments" type="number" min="1" max="60" defaultValue="1" className="input-modern" />
                            </div>
                        </div>

                        <div className="input-modern-group">
                            <label className="input-label-modern">
                                <LinkIcon size={14} style={{ marginRight: '4px' }} /> Link (Opcional)
                            </label>
                            <input name="link" type="url" className="input-modern" placeholder="https://..." />
                        </div>

                        <div className="input-modern-group">
                            <label className="input-label-modern">
                                <FileText size={14} style={{ marginRight: '4px' }} /> Notas
                            </label>
                            <textarea
                                name="description"
                                className="input-modern"
                                rows={3}
                                placeholder="Detalles, color, tienda..."
                                style={{ resize: 'none', minHeight: '80px' }}
                            ></textarea>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                style={{
                                    flex: 1,
                                    background: 'transparent',
                                    color: 'var(--text-dim)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    padding: '0.85rem',
                                    borderRadius: '12px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: '0.2s',
                                    fontSize: '0.95rem'
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isPending}
                                style={{
                                    flex: 2,
                                    background: 'var(--primary)',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '0.85rem',
                                    borderRadius: '12px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                                    fontSize: '0.95rem'
                                }}
                            >
                                {isPending ? <Loader2 className="animate-spin" size={20} /> : 'Guardar Plan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <style jsx global>{`
                .input-modern-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.4rem;
                }
                .input-label-modern {
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: #a1a1aa;
                    display: flex;
                    align-items: center;
                    margin-left: 2px;
                }
                .input-modern {
                    background: rgba(0, 0, 0, 0.2);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 12px;
                    padding: 0.75rem 1rem;
                    color: #fff;
                    font-size: 0.95rem;
                    transition: all 0.2s ease;
                    outline: none;
                }
                .input-modern:focus {
                    background: rgba(0, 0, 0, 0.4);
                    border-color: var(--primary);
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
                }
                .input-modern::placeholder {
                    color: rgba(255, 255, 255, 0.2);
                }
                @keyframes scale-in {
                    0% { opacity: 0; transform: scale(0.95) translateY(10px); }
                    100% { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-scale-in {
                    animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    ) : null;

    if (!mounted) {
        return <>{triggerButton}</>;
    }

    return (
        <>
            {triggerButton}
            {createPortal(modalContent, document.body)}
        </>
    );
}
