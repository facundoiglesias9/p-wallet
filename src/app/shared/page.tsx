import { getSharedData } from '@/actions/shared';
import { Users, User, ArrowRight, Home, DollarSign, Wallet } from 'lucide-react';
import { MonthPicker } from '@/components/ui/MonthPicker';
import { getDateFilter } from '@/actions/app-settings';

export default async function SharedPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { allTime } = await searchParams;
    const { month: cookieMonth, year: cookieYear } = await getDateFilter();

    // If allTime is present, we pass -1 to signal getSharedData to fetch everything
    const isAllTime = allTime === 'true';
    const month = isAllTime ? -1 : cookieMonth;
    const year = cookieYear;

    const data = await getSharedData(month, year);
    const { oneTimePeople, cohabitants, expenses } = data;
    // const { oneTimePeople, cohabitants, expenses } = data; // Eliminada por duplicación
    const cohabitantStats = data.cohabitantStats as any || { totalPool: 0, myStats: { name: 'Yo', totalContributed: 0, balance: 0 } };
    const myStats = cohabitantStats.myStats || { name: 'Yo', totalContributed: 0, balance: 0 };

    return (
        <div className="animate-ready" style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>
            <header style={{ marginBottom: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
                <div>
                    <h1 className="title-metallic" style={{ fontSize: '2.5rem', margin: 0 }}>Saldos</h1>
                    <p style={{ color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                        {isAllTime ? 'Balance histórico total' : 'Control de deudas mensual'}
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.03)', padding: '0.4rem', borderRadius: '14px', border: '1px solid var(--border)' }}>
                    <a
                        href="/shared"
                        style={{
                            padding: '0.6rem 1.2rem',
                            borderRadius: '10px',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                            transition: '0.2s',
                            background: !isAllTime ? 'var(--primary)' : 'transparent',
                            color: !isAllTime ? '#fff' : 'var(--text-dim)'
                        }}
                    >
                        Mensual
                    </a>
                    <a
                        href="/shared?allTime=true"
                        style={{
                            padding: '0.6rem 1.2rem',
                            borderRadius: '10px',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                            transition: '0.2s',
                            background: isAllTime ? 'var(--primary)' : 'transparent',
                            color: isAllTime ? '#fff' : 'var(--text-dim)'
                        }}
                    >
                        Total
                    </a>
                </div>

                {!isAllTime && <MonthPicker initialMonth={cookieMonth} initialYear={cookieYear} />}
            </header>

            <div className="dashboard-grid">

                {/* SECTION 1: ONE TIME DEBTS */}
                <section className="section-card" style={{ height: 'fit-content' }}>
                    <div className="section-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <DollarSign size={24} color="#f43f5e" />
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Deudas (Únicas)</h2>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {oneTimePeople.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)', border: '1px dashed var(--border)', borderRadius: '12px' }}>
                                Sin gastos únicos.
                            </div>
                        ) : (
                            oneTimePeople.map((person: any) => {
                                const isOwed = person.balance > 0;
                                const isDebt = person.balance < 0;
                                const isZero = person.balance === 0;

                                return (
                                    <details key={person.id} style={{
                                        background: 'var(--bg-card-hover)',
                                        borderRadius: '16px',
                                        border: '1px solid var(--border)',
                                        overflow: 'hidden'
                                    }}>
                                        <summary style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '1rem',
                                            cursor: 'pointer',
                                            listStyle: 'none'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    background: '#f43f5e',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 700,
                                                    color: '#fff',
                                                    fontSize: '0.8rem'
                                                }}>
                                                    {person.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{person.name}</div>
                                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Detalle</div>
                                                </div>
                                            </div>

                                            <div style={{ textAlign: 'right' }}>
                                                {isZero ? (
                                                    <span style={{ color: 'var(--text-dim)', fontWeight: 500, fontSize: '0.8rem' }}>Saldado</span>
                                                ) : (
                                                    <>
                                                        <div style={{
                                                            color: isOwed ? 'var(--success)' : 'var(--error)',
                                                            fontWeight: 800,
                                                            fontSize: '1rem'
                                                        }}>
                                                            {isOwed ? '+' : '-'}${Math.abs(person.balance).toLocaleString()}
                                                        </div>
                                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                                                            {isOwed ? 'cobra' : 'paga'}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </summary>

                                        <div style={{ padding: '0 1rem 1rem 1rem', borderTop: '1px solid var(--border)' }}>
                                            <h4 style={{ margin: '0.75rem 0 0.5rem 0', fontSize: '0.8rem', color: 'var(--text-dim)' }}>Historial</h4>
                                            {person.history && person.history.length > 0 ? (
                                                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
                                                    {person.history.map((h: any, idx: number) => {
                                                        const isMyDebt = h.amount < 0;
                                                        return (
                                                            <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0.4rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                                                                <div>
                                                                    <div style={{ fontWeight: 500 }}>{h.description}</div>
                                                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{new Date(h.date).toLocaleDateString()}</div>
                                                                </div>
                                                                <div style={{ textAlign: 'right' }}>
                                                                    <div style={{ fontWeight: 600, color: isMyDebt ? 'var(--error)' : 'var(--success)' }}>
                                                                        {isMyDebt ? '-' : '+'}${Math.abs(h.amount).toLocaleString()}
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            ) : (
                                                <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', fontStyle: 'italic' }}>Sin historial.</p>
                                            )}
                                        </div>
                                    </details>
                                );
                            })
                        )}
                    </div>
                </section>


                {/* SECTION 2: COHABITATION / CONVIVENCIA */}
                <section className="section-card" style={{ height: 'fit-content' }}>
                    <div className="section-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Home size={24} color="#3b82f6" />
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Convivencia</h2>
                        </div>
                    </div>

                    <div style={{
                        padding: '1.25rem',
                        background: 'linear-gradient(145deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.02))',
                        borderRadius: '20px',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        marginBottom: '1rem'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <span style={{ color: 'var(--text-dim)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.25rem' }}>Consumo Grupal</span>
                            <span className="title-metallic-dashboard" style={{ fontSize: '2.5rem', lineHeight: 1 }}>
                                ${cohabitantStats.totalPool.toLocaleString()}
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            {/* Box 1: User */}
                            <div style={{
                                background: 'rgba(255,255,255,0.02)',
                                padding: '1.25rem 1rem',
                                borderRadius: '20px',
                                border: '1px solid rgba(255,255,255,0.08)',
                                textAlign: 'center',
                                backdropFilter: 'blur(20px)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem'
                            }}>
                                <div style={{
                                    fontSize: '1rem',
                                    color: 'var(--text-dim)',
                                    fontWeight: 700,
                                    textTransform: 'capitalize'
                                }}>
                                    {myStats.name}
                                </div>
                                <div style={{
                                    fontSize: '1.25rem',
                                    fontWeight: 850,
                                    color: '#fff'
                                }}>
                                    ${(myStats.totalContributed || 0).toLocaleString()}
                                </div>
                            </div>

                            {/* Box 2: First Cohabitant */}
                            {cohabitants.length > 0 && cohabitants.map((person: any) => (
                                <div key={person.id} style={{
                                    background: 'rgba(255,255,255,0.02)',
                                    padding: '1.25rem 1rem',
                                    borderRadius: '20px',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    textAlign: 'center',
                                    backdropFilter: 'blur(20px)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.5rem'
                                }}>
                                    <div style={{
                                        fontSize: '1rem',
                                        color: 'var(--text-dim)',
                                        fontWeight: 700,
                                        textTransform: 'capitalize'
                                    }}>
                                        {person.name}
                                    </div>
                                    <div style={{
                                        fontSize: '1.25rem',
                                        fontWeight: 850,
                                        color: '#fff'
                                    }}>
                                        ${person.totalContributed.toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Debt Summary Line at the bottom */}
                        <div style={{
                            borderTop: '1px solid rgba(255,255,255,0.05)',
                            paddingTop: '1rem',
                            textAlign: 'center'
                        }}>
                            {(() => {
                                const users = [
                                    { name: myStats.name as string, balance: myStats.balance as number },
                                    ...cohabitants.map((c: any) => ({ name: c.name as string, balance: c.balance as number }))
                                ];

                                const debtor = users.find(u => u.balance < -1);
                                if (!debtor) return <span style={{ color: 'var(--success)', fontWeight: 800, fontSize: '1rem' }}>✨ ¡Al día! ✨</span>;

                                return (
                                    <div style={{
                                        fontSize: '1.5rem',
                                        fontWeight: 900,
                                        color: 'var(--error)',
                                        letterSpacing: '-0.5px'
                                    }}>
                                        {debtor.name} <span style={{ opacity: 0.8 }}>-${Math.abs(debtor.balance).toLocaleString()}</span>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
