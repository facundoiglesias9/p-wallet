'use client';

import { Trash2, ExternalLink, Calculator, CalendarClock, ShoppingCart, Check, X, Calendar as CalendarIcon, Tag } from 'lucide-react';
import { deletePlan, executePlan } from '@/actions/plans';
import { useTransition, useState, MouseEvent } from 'react';

export function PlanItem({ plan, categories }: { plan: any, categories: any[] }) {
    const [isPending, startTransition] = useTransition();
    const [isExecuting, setIsExecuting] = useState(false);

    // Estado para form de ejecución
    const [selectedCategory, setSelectedCategory] = useState(categories[0]?.name || '');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const handleDelete = (e: MouseEvent) => {
        e.stopPropagation();
        if (confirm('¿Borrar este plan?')) {
            startTransition(() => {
                deletePlan(plan.id);
            });
        }
    };

    const handleExecute = (e: MouseEvent) => {
        e.stopPropagation();
        if (!selectedCategory) {
            alert('Por favor selecciona una categoría');
            return;
        }
        startTransition(async () => {
            const res = await executePlan(plan.id, {
                category: selectedCategory,
                date: selectedDate
            });
            if (res?.success) {
                setIsExecuting(false);
            }
        });
    };

    const toggleExecutionMode = (e: MouseEvent) => {
        e.stopPropagation();
        setIsExecuting(!isExecuting);
    }

    const quotaAmount = plan.installments > 1 ? plan.amount / plan.installments : plan.amount;

    // Prevenir propagación de clicks dentro del panel de edición
    const handlePanelClick = (e: MouseEvent) => {
        // No propagar clicks al contenedor padre si tuviera algún handler
        e.stopPropagation();
    };

    return (
        <div style={{
            background: 'var(--bg-card-hover)',
            padding: '1.25rem',
            borderRadius: '16px',
            border: isExecuting ? '1px solid var(--primary)' : '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            transition: 'all 0.3s ease',
            position: 'relative',
            opacity: isPending ? 0.5 : 1,
            boxShadow: isExecuting ? '0 0 20px rgba(99, 102, 241, 0.15)' : 'none'
        }} className="hover-scale-sm">

            {/* Modo Ejecución superpuesto o expandido */}
            {isExecuting ? (
                <div
                    className="animate-fade-in"
                    onClick={handlePanelClick}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>Asignar Gasto</h4>
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsExecuting(false); }}
                            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '4px' }}
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Grupo Categoría: DIV aislado */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', position: 'relative' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px', pointerEvents: 'none' }}>
                                <Tag size={12} /> Categoría
                            </div>
                            <select
                                value={selectedCategory}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                style={{
                                    width: '100%',
                                    background: 'rgba(0,0,0,0.2)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'white',
                                    padding: '0.6rem',
                                    borderRadius: '8px',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    appearance: 'none',
                                    position: 'relative',
                                    zIndex: 2,
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 0.5rem center',
                                    backgroundSize: '16px'
                                }}
                            >
                                {categories.map((c: any) => (
                                    <option key={c.id} value={c.name} style={{ background: '#1a1b26' }}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Grupo Fecha: DIV aislado */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', position: 'relative' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px', pointerEvents: 'none' }}>
                                <CalendarIcon size={12} /> Fecha de Imputación
                            </div>
                            <input
                                type="date"
                                value={selectedDate}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                style={{
                                    width: '100%',
                                    background: 'rgba(0,0,0,0.2)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'white',
                                    padding: '0.6rem',
                                    borderRadius: '8px',
                                    outline: 'none',
                                    fontFamily: 'inherit',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    zIndex: 2
                                }}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleExecute}
                        className="btn btn-primary"
                        style={{
                            marginTop: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            padding: '0.6rem',
                            fontWeight: 600,
                            borderRadius: '10px'
                        }}
                    >
                        <Check size={16} /> Confirmar Compra
                    </button>
                </div>
            ) : (
                /* Modo Normal */
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-main)' }}>
                                {plan.name}
                            </h3>
                            {plan.description && (
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.4' }}>
                                    {plan.description}
                                </p>
                            )}
                            {plan.link && (
                                <a href={plan.link} target="_blank" rel="noopener noreferrer" style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '0.85rem',
                                    color: 'var(--primary)',
                                    marginTop: '0.5rem',
                                    textDecoration: 'none',
                                    fontWeight: 600
                                }}>
                                    <ExternalLink size={14} /> Ver producto
                                </a>
                            )}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                                ${plan.amount.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    <div style={{
                        borderTop: '1px solid var(--border)',
                        paddingTop: '0.75rem',
                        marginTop: '0.25rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {plan.installments > 1 ? (
                                <span style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '0.85rem',
                                    color: 'var(--warning)',
                                    fontWeight: 600,
                                    background: 'rgba(245, 158, 11, 0.1)',
                                    padding: '4px 8px',
                                    borderRadius: '8px'
                                }}>
                                    <Calculator size={14} />
                                    {plan.installments} x ${quotaAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </span>
                            ) : (
                                <span style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '0.85rem',
                                    color: 'var(--success)',
                                    fontWeight: 600,
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    padding: '4px 8px',
                                    borderRadius: '8px'
                                }}>
                                    <CalendarClock size={14} />
                                    Pago único
                                </span>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={toggleExecutionMode}
                                title="Marcar como comprado"
                                style={{
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    border: '1px solid rgba(99, 102, 241, 0.2)',
                                    color: 'var(--primary)',
                                    cursor: 'pointer',
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    transition: 'all 0.2s',
                                    zIndex: 5
                                }}
                            >
                                <ShoppingCart size={16} /> Comprar
                            </button>

                            <button
                                onClick={handleDelete}
                                disabled={isPending}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'color 0.2s',
                                    zIndex: 5
                                }}
                                onMouseOver={(e) => e.currentTarget.style.color = 'var(--error)'}
                                onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
