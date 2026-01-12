import { getPeople, createPerson, deletePerson } from '@/actions/settings';
import { Settings, Users, ArrowLeft, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';
import { LogoutButton } from '@/components/features/auth/LogoutButton';

export default async function SettingsPage() {
    const people = await getPeople();

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
            </div>

            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                <LogoutButton />
            </div>
        </div>
    );
}
