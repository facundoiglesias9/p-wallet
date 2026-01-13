import { getCategoriesWithStats, createCategory } from '@/actions/expenses';
import { CategoryItem } from '@/components/features/categories/CategoryItem';
import { Layers, Plus, ShoppingCart, Home, Car, Utensils, Zap, Heart, Globe, Music, Tag } from 'lucide-react';

export default async function CategoriesPage() {
    const categories = await getCategoriesWithStats();

    return (
        <div className="animate-ready" style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>

            {/* Header */}
            <header style={{ marginBottom: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
                <div>
                    <h1 className="title-metallic-category" style={{ fontSize: '2.5rem', margin: 0, lineHeight: 1.2 }}>
                        Categorías
                    </h1>
                    <p style={{ color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                        Gestiona tus etiquetas de gastos
                    </p>
                </div>
            </header>

            {/* Create Section */}
            <div className="section-card" style={{ marginBottom: '3rem', background: 'linear-gradient(145deg, rgba(99, 102, 241, 0.05) 0%, rgba(99, 102, 241, 0.01) 100%)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={20} className="text-primary" /> Crear Nueva Categoría
                </h3>

                <form action={createCategory}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', alignItems: 'end' }}>
                        <div>
                            <label className="form-label-premium">Nombre</label>
                            <input
                                name="name"
                                placeholder="Ej. Supermercado"
                                className="input-premium"
                                required
                            />
                        </div>

                        <div>
                            <label className="form-label-premium">Color e Ícono</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="color"
                                    name="color"
                                    defaultValue="#6366f1"
                                    style={{
                                        height: '45px',
                                        width: '45px',
                                        padding: '0',
                                        border: 'none',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        background: 'transparent'
                                    }}
                                />
                                <select name="icon" className="input-premium" style={{ flex: 1, cursor: 'pointer' }}>
                                    <option value="ShoppingCart">Carrito 🛒</option>
                                    <option value="Home">Casa 🏠</option>
                                    <option value="Car">Auto 🚗</option>
                                    <option value="Utensils">Comida 🍽️</option>
                                    <option value="Zap">Servicios ⚡</option>
                                    <option value="Heart">Salud ❤️</option>
                                    <option value="Globe">Viajes 🌎</option>
                                    <option value="Music">Ocio 🎵</option>
                                    <option value="Tag">Otro 🏷️</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="btn-premium btn-primary-wave" style={{ justifyContent: 'center' }}>
                            <Plus size={20} />
                            Crear
                        </button>
                    </div>
                </form>
            </div>

            {/* List */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {categories.map(cat => (
                    <CategoryItem
                        key={cat.id}
                        category={cat}
                        iconName={cat.icon}
                    />
                ))}
            </div>

            {categories.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)', border: '1px dashed var(--border)', borderRadius: '24px' }}>
                    No tienes categorías creadas. ¡Crea la primera arriba!
                </div>
            )}
        </div>
    );
}
