import { getPeople, createPerson, deletePerson } from '@/actions/settings';
import { getCategories, createCategory, deleteCategoryForm } from '@/actions/expenses';
import { Settings, Users, ArrowLeft, Trash2, Plus, Layers } from 'lucide-react';
import Link from 'next/link';
import { LogoutButton } from '@/components/features/auth/LogoutButton';

export default async function SettingsPage() {
    const people = await getPeople();
    const categories = await getCategories();

    return (
        <div className="animate-ready" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem' }}>

            <header style={{ marginBottom: '3rem' }}>
                <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', marginBottom: '1.5rem', textDecoration: 'none', fontWeight: 500 }}>
                    <ArrowLeft size={18} /> Volver
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="icon-box" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }}>
                            <Settings size={28} />
                        </div>
                        <h1 className="title-metallic" style={{ fontSize: '2rem', margin: 0 }}> AJUSTES DE CUENTA</h1>
                    </div>
                </div>
            </header>

            {/* SECCIÓN: PERSONAS / ROOMMATES */}
            <div className="section-card">
                <div className="section-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Users size={24} color="var(--primary)" />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Personas / Roommates</h2>
                    </div>
                </div>

                <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>
                    Administra quiénes comparten gastos contigo. Si agregas personas aquí, podrás seleccionarlas al crear gastos compartidos.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {people.map((person: any) => (
                        <div key={person.id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '1rem',
                            background: 'var(--bg-card-hover)',
                            borderRadius: '16px',
                            border: '1px solid var(--border)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: 'var(--primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    color: '#fff'
                                }}>
                                    {person.name.charAt(0).toUpperCase()}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{person.name}</span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                                        {person.role === 'COHABITANT' ? 'Convive (Gastos Compartidos)' : 'Gasto Único (Deuda)'}
                                    </span>
                                </div>
                            </div>

                            <form action={deletePerson}>
                                <input type="hidden" name="id" value={person.id} />
                                <button type="submit" style={{
                                    background: 'rgba(244, 63, 94, 0.1)',
                                    border: 'none',
                                    padding: '0.5rem',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    color: 'var(--error)'
                                }}>
                                    <Trash2 size={18} />
                                </button>
                            </form>
                        </div>
                    ))}

                    <form action={createPerson} style={{ marginTop: '1rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <input
                                name="name"
                                placeholder="Nombre (ej. Juan)"
                                className="input-premium"
                                style={{ flex: 2 }}
                                required
                            />
                            <select
                                name="role"
                                className="input-premium"
                                style={{ flex: 1, minWidth: '150px' }}
                            >
                                <option value="ONETIME">Gasto Único</option>
                                <option value="COHABITANT">Convive</option>
                            </select>
                            <button type="submit" className="btn-premium btn-primary-wave" style={{ background: 'var(--primary)', padding: '0 1.5rem' }}>
                                <Plus size={20} />
                                Agregar
                            </button>
                        </div>
                    </form>
                </div>
                {/* SECCIÓN: CATEGORÍAS */}
                <div className="section-card" style={{ marginTop: '2rem' }}>
                    <div className="section-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Layers size={24} color="var(--primary)" />
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Categorías de Gastos</h2>
                        </div>
                    </div>

                    <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>
                        Personaliza las categorías para clasificar tus movimientos.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {categories.map((cat: any) => (
                            <div key={cat.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0.75rem 1rem',
                                background: 'var(--bg-card-hover)',
                                borderRadius: '12px',
                                border: '1px solid var(--border)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '8px',
                                        background: cat.color || '#6366f1',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff'
                                    }}>
                                        {/* Simplification: Just show first letter if dynamic icon isn't easy */}
                                        <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{cat.name.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <span style={{ fontWeight: 600 }}>{cat.name}</span>
                                </div>

                                <form action={deleteCategoryForm}>
                                    <input type="hidden" name="id" value={cat.id} />
                                    <button type="submit" style={{
                                        background: 'transparent',
                                        border: 'none',
                                        padding: '0.5rem',
                                        cursor: 'pointer',
                                        color: 'var(--text-dim)',
                                        opacity: 0.7
                                    }}>
                                        <Trash2 size={16} />
                                    </button>
                                </form>
                            </div>
                        ))}

                        <form action={createCategory} style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
                            <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-dim)' }}>Nueva Categoría</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <input
                                    name="name"
                                    placeholder="Nombre (ej. Supermercado)"
                                    className="input-premium"
                                    required
                                />
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
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            background: 'transparent'
                                        }}
                                    />
                                    <select name="icon" className="input-premium" style={{ flex: 1 }}>
                                        <option value="ShoppingCart">Carrito</option>
                                        <option value="Home">Casa</option>
                                        <option value="Car">Auto</option>
                                        <option value="Utensils">Comida</option>
                                        <option value="Zap">Servicios</option>
                                        <option value="Heart">Salud</option>
                                        <option value="Globe">Viajes</option>
                                        <option value="Music">Ocio</option>
                                        <option value="Tag">Otros</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="btn-premium" style={{ width: '100%', justifyContent: 'center', background: 'var(--primary)' }}>
                                <Plus size={18} /> Crear Categoría
                            </button>
                        </form>
                    </div>
                </div>
                <LogoutButton />
            </div>
        </div>
    );
}
