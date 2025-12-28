import { getPeople, createPerson, deletePerson, getAllAccounts, deleteAccount } from './actions';
import { verifySession } from '@/lib/session';
import { Settings, Users, ArrowLeft, Trash2, Plus, Shield } from 'lucide-react';
import Link from 'next/link';

import { DeleteAccountButton } from './DeleteAccountButton';

export default async function SettingsPage() {
    const people = await getPeople();
    const session = await verifySession();
    const isSuperAdmin = session?.username === 'facundo' || session?.userId === 'user_facundo'; // Check username or ID if available in session payload
    // Note: session payload currently only has userId. We'd need to fetch user to know username, or check ID if 'user_facundo' is fixed ID.
    // In seed_user.sql: ID='user_facundo', username='facundo'. So checking ID is safe.

    const allAccounts = isSuperAdmin ? await getAllAccounts() : [];

    return (
        <div className="animate-ready" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem' }}>

            <header style={{ marginBottom: '3rem' }}>
                <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', marginBottom: '1.5rem', textDecoration: 'none', fontWeight: 500 }}>
                    <ArrowLeft size={18} /> Volver
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="icon-box" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }}>
                        <Settings size={28} />
                    </div>
                    <h1 className="title-metallic" style={{ fontSize: '2rem', margin: 0 }}> Configuración</h1>
                </div>
            </header>

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

            {isSuperAdmin && (
                <div className="section-card" style={{ marginTop: '3rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <div className="section-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Shield size={24} color="#10b981" />
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>Gestión de Cuentas (Admin)</h2>
                        </div>
                    </div>

                    <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>
                        Visualización de todos los usuarios registrados en el sistema.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {allAccounts.map((acc: any) => (
                            <div key={acc.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1rem',
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: '16px',
                                border: '1px solid var(--border)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '12px',
                                        background: '#3f3f46',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 700,
                                        color: '#fff'
                                    }}>
                                        {acc.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{acc.username}</span>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                                            ID: {acc.id} • Creado: {new Date(acc.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {acc.id !== 'user_facundo' && (
                                        <DeleteAccountButton userId={acc.id} />
                                    )}
                                    {acc.id === 'user_facundo' && (
                                        <span style={{ fontSize: '0.8rem', color: 'var(--primary)', padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
                                            Admin Principal
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
            }
        </div >
    );
}
