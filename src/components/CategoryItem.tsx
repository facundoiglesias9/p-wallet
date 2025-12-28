'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    MoreVertical,
    X,
    Sparkles,
    Trash2,
    AlertTriangle,
    Utensils, Car, Tv, Home, ShoppingBag, Heart, Gamepad2, Coffee, Zap, Bus, Shirt, Music, Plane, GraduationCap, CreditCard, Banknote, Coins
} from 'lucide-react';
import { updateCategory, deleteCategory } from '@/app/actions';

const ICONS = [
    { name: 'Utensils', icon: Utensils },
    { name: 'Car', icon: Car },
    { name: 'Tv', icon: Tv },
    { name: 'Home', icon: Home },
    { name: 'ShoppingBag', icon: ShoppingBag },
    { name: 'Heart', icon: Heart },
    { name: 'Gamepad2', icon: Gamepad2 },
    { name: 'Coffee', icon: Coffee },
    { name: 'Zap', icon: Zap },
    { name: 'Bus', icon: Bus },
    { name: 'Shirt', icon: Shirt },
    { name: 'Music', icon: Music },
    { name: 'Plane', icon: Plane },
    { name: 'GraduationCap', icon: GraduationCap },
    { name: 'CreditCard', icon: CreditCard },
    { name: 'Banknote', icon: Banknote },
];

const COLORS = [
    '#6366f1', '#ec4899', '#ef4444', '#f59e0b',
    '#10b981', '#3b82f6', '#8b5cf6', '#06b6d4'
];

interface CategoryItemProps {
    category: {
        id: string;
        name: string;
        color: string;
        icon: string;
        count: number;
        total: string;
    };
    iconName: string;
}

export function CategoryItem({ category, iconName }: CategoryItemProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [mounted, setMounted] = useState(false); // Fix hydration mismatch

    // Find the icon component from the local ICONS array
    const Icon = ICONS.find(i => i.name === iconName)?.icon || Sparkles;

    // Edit Form State
    const [selectedIcon, setSelectedIcon] = useState(category.icon);
    const [selectedColor, setSelectedColor] = useState(category.color);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleDeleteClick = () => {
        setIsMenuOpen(false);
        setShowDeleteConfirm(true);
    };

    const handleUpdate = async (formData: FormData) => {
        await updateCategory(formData);
        setIsEditOpen(false);
    };

    const confirmDelete = async () => {
        await deleteCategory(category.id);
        setShowDeleteConfirm(false);
    };

    return (
        <>
            <div className="section-card" style={{
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                transition: '0.3s',
                cursor: 'pointer',
                position: 'relative',
                transform: isMenuOpen ? 'scale(1.02)' : 'scale(1)',
                zIndex: isMenuOpen ? 50 : 1
            }}>
                <div style={{
                    width: '56px',
                    height: '56px',
                    background: `${category.color}15`,
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: category.color,
                    border: `1px solid ${category.color}30`
                }}>
                    <Icon size={28} />
                </div>

                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>{category.name}</h3>
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsMenuOpen(!isMenuOpen);
                                }}
                                style={{
                                    background: isMenuOpen ? category.color : 'transparent',
                                    border: 'none',
                                    color: isMenuOpen ? '#fff' : 'var(--text-muted)',
                                    cursor: 'pointer',
                                    padding: '0.4rem',
                                    borderRadius: '8px',
                                    transition: '0.2s',
                                    display: 'flex'
                                }}
                            >
                                <MoreVertical size={18} />
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
                                        width: '160px',
                                        boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
                                    }}>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setIsEditOpen(true); setIsMenuOpen(false); }}
                                            className="btn"
                                            style={{
                                                justifyContent: 'flex-start',
                                                fontSize: '0.9rem',
                                                color: 'var(--text-main)',
                                                background: 'rgba(255,255,255,0.03)',
                                                width: '100%'
                                            }}
                                        >
                                            ✏️ Editar
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDeleteClick(); }}
                                            className="btn"
                                            style={{
                                                justifyContent: 'flex-start',
                                                fontSize: '0.9rem',
                                                color: '#ff4d4d',
                                                background: 'rgba(244, 63, 94, 0.1)',
                                                width: '100%'
                                            }}
                                        >
                                            🗑️ Eliminar
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                        <span>{category.count} movimientos</span>
                        <span>•</span>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{category.total} total</span>
                    </div>
                </div>
            </div>

            {/* EDIT MODAL */}
            {isEditOpen && mounted && createPortal(
                <div className="modal-overlay" onClick={() => setIsEditOpen(false)} style={{ zIndex: 99999 }}>
                    <div className="modal-window animate-ready" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <header className="modal-header">
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 850, letterSpacing: '-0.5px', marginBottom: '4px' }}>Editar Categoría</h2>
                                <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Modifica los detalles de esta etiqueta.</p>
                            </div>
                            <button
                                onClick={() => setIsEditOpen(false)}
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    border: 'none',
                                    color: 'var(--text-dim)',
                                    padding: '10px',
                                    borderRadius: '12px',
                                    cursor: 'pointer'
                                }}
                            >
                                <X size={20} />
                            </button>
                        </header>

                        <form action={handleUpdate}>
                            <input type="hidden" name="id" value={category.id} />
                            <div className="modal-body">
                                <div className="form-group" style={{ marginBottom: '2rem' }}>
                                    <label className="form-label-premium">Nombre</label>
                                    <input
                                        name="name"
                                        className="input-premium"
                                        defaultValue={category.name}
                                        required
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: '2rem' }}>
                                    <label className="form-label-premium">Color</label>
                                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                        {COLORS.map(color => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => setSelectedColor(color)}
                                                style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    borderRadius: '50%',
                                                    background: color,
                                                    border: selectedColor === color ? '3px solid white' : '2px solid transparent',
                                                    cursor: 'pointer',
                                                    transition: '0.2s',
                                                    boxShadow: selectedColor === color ? `0 0 15px ${color}` : 'none',
                                                    transform: selectedColor === color ? 'scale(1.1)' : 'scale(1)'
                                                }}
                                            />
                                        ))}
                                        <input type="hidden" name="color" value={selectedColor} />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label-premium">Ícono</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: '0.75rem' }}>
                                        {ICONS.map(({ name, icon: IconItem }) => (
                                            <button
                                                key={name}
                                                type="button"
                                                onClick={() => setSelectedIcon(name)}
                                                style={{
                                                    padding: '0.75rem',
                                                    borderRadius: '14px',
                                                    background: selectedIcon === name ? `${selectedColor}20` : 'var(--bg-card-hover)',
                                                    border: `1px solid ${selectedIcon === name ? selectedColor : 'transparent'}`,
                                                    color: selectedIcon === name ? selectedColor : 'var(--text-dim)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    transition: '0.2s'
                                                }}
                                            >
                                                <IconItem size={22} />
                                            </button>
                                        ))}
                                        <input type="hidden" name="icon" value={selectedIcon} />
                                    </div>
                                </div>
                            </div>

                            <footer className="modal-footer">
                                <button type="button" onClick={() => setIsEditOpen(false)} className="btn-premium btn-ghost">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-premium btn-primary-wave">
                                    <Sparkles size={20} />
                                    Guardar
                                </button>
                            </footer>
                        </form>
                    </div>
                </div>,
                document.body
            )}

            {/* DELETE CONFIRM */}
            {showDeleteConfirm && mounted && createPortal(
                <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)} style={{ zIndex: 999999 }}>
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
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>¿Borrar Categoría?</h3>
                            <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem' }}>
                                Si eliminas esta categoría, los gastos asociados quedarán sin etiqueta.
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
