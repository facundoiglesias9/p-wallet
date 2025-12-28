'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, Sparkles, Utensils, Car, Tv, Home, ShoppingBag, Heart, Gamepad2, Coffee, Zap, Bus, Shirt, Music, Plane, GraduationCap, CreditCard } from 'lucide-react';
import { createCategory } from '@/actions/expenses'; // Category actions merged into expenses for now

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
];

const COLORS = [
    '#6366f1', // Indigo
    '#ec4899', // Pink
    '#ef4444', // Red
    '#f59e0b', // Amber
    '#10b981', // Emerald
    '#3b82f6', // Blue
    '#8b5cf6', // Violet
    '#06b6d4', // Cyan
];

export function CategoryForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState('Utensils');
    const [selectedColor, setSelectedColor] = useState('#6366f1');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    async function handleSubmit(formData: FormData) {
        // Append manually selected icon & color if not in formData already via hidden inputs?
        // Actually hidden inputs are easier for Server Actions.
        await createCategory(formData);
        setIsOpen(false);
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="btn-premium btn-primary-wave" // Using the wave style for categories, or maybe a new one?
                style={{ boxShadow: '0 8px 20px -8px rgba(99, 102, 241, 0.4)' }}
            >
                <Plus size={18} />
                Crear Categoría
            </button>

            {isOpen && mounted && createPortal(
                <div className="modal-overlay" onClick={() => setIsOpen(false)} style={{ zIndex: 99999 }}>
                    <div className="modal-window animate-ready" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <header className="modal-header">
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 850, letterSpacing: '-0.5px', marginBottom: '4px' }}>Nueva Categoría</h2>
                                <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Personaliza etiquetas para organizar tus movimientos.</p>
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
                                <div className="form-group" style={{ marginBottom: '2rem' }}>
                                    <label className="form-label-premium">Nombre de la Categoría</label>
                                    <input
                                        name="name"
                                        className="input-premium"
                                        placeholder="Ej: Entretenimiento"
                                        autoFocus
                                        required
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: '2rem' }}>
                                    <label className="form-label-premium">Selecciona un Color</label>
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
                                    <label className="form-label-premium">Ícono Representativo</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: '0.75rem' }}>
                                        {ICONS.map(({ name, icon: Icon }) => (
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
                                                <Icon size={22} />
                                            </button>
                                        ))}
                                        <input type="hidden" name="icon" value={selectedIcon} />
                                    </div>
                                </div>
                            </div>

                            <footer className="modal-footer">
                                <button type="button" onClick={() => setIsOpen(false)} className="btn-premium btn-ghost">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-premium btn-primary-wave">
                                    <Sparkles size={20} />
                                    Crear Categoría
                                </button>
                            </footer>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
