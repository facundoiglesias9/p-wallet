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
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="icon-box" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)' }}>
                        <Users size={28} />
                    </div>
                    <div>
                        <h1 className="title-metallic" style={{ fontSize: '2rem', margin: 0 }}>Saldos</h1>
                        <p style={{ color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                            {isAllTime ? 'Balance histórico total' : 'Control de deudas mensual'}
                        </p>
                    </div>
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>

                {/* SECTION 1: ONE TIME DEBTS */}
                <section className="section-card" style={{ height: 'fit-content' }}>
                    <div className="section-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <DollarSign size={24} color="#f43f5e" />
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Deudas (Gasto Único)</h2>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {oneTimePeople.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)', border: '1px dashed var(--border)', borderRadius: '12px' }}>
                                No hay personas registradas para gastos únicos.
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
                                            padding: '1.25rem',
                                            cursor: 'pointer',
                                            listStyle: 'none'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '50%',
                                                    background: '#f43f5e',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: 700,
                                                    color: '#fff'
                                                }}>
                                                    {person.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{person.name}</div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Gasto Único • Ver detalle</div>
                                                </div>
                                            </div>

                                            <div style={{ textAlign: 'right' }}>
                                                {isZero ? (
                                                    <span style={{ color: 'var(--text-dim)', fontWeight: 500 }}>Saldado</span>
                                                ) : (
                                                    <>
                                                        <div style={{
                                                            color: isOwed ? 'var(--success)' : 'var(--error)',
                                                            fontWeight: 800,
                                                            fontSize: '1.2rem'
                                                        }}>
                                                            {isOwed ? '+' : '-'}${Math.abs(person.balance).toLocaleString()}
                                                        </div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                                                            {isOwed ? 'te debe' : 'le debes'}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </summary>

                                        <div style={{ padding: '0 1.25rem 1.25rem 1.25rem', borderTop: '1px solid var(--border)' }}>
                                            <h4 style={{ margin: '1rem 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-dim)' }}>Historial</h4>
                                            {person.history && person.history.length > 0 ? (
                                                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto' }}>
                                                    {person.history.map((h: any, idx: number) => {
                                                        const isMyDebt = h.amount < 0;
                                                        return (
                                                            <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                                                                <div>
                                                                    <div style={{ fontWeight: 500 }}>{h.description}</div>
                                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{new Date(h.date).toLocaleDateString()}</div>
                                                                </div>
                                                                <div style={{ textAlign: 'right' }}>
                                                                    <div style={{ fontWeight: 600, color: isMyDebt ? 'var(--error)' : 'var(--success)' }}>
                                                                        {isMyDebt ? '-' : '+'}${Math.abs(h.amount).toLocaleString()}
                                                                    </div>
                                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                                        Total: ${h.totalAmount.toLocaleString()}
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            ) : (
                                                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', fontStyle: 'italic' }}>No hay historial detallado disponible.</p>
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
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Convivencia</h2>
                        </div>
                    </div>

                    <div style={{
                        padding: '1.5rem',
                        background: 'linear-gradient(145deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.02))',
                        borderRadius: '16px',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        marginBottom: '2rem'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2.5rem' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>Total Consumo Grupal</span>
                            <span className="title-metallic-dashboard" style={{ fontSize: '3rem', lineHeight: 1 }}>
                                ${cohabitantStats.totalPool.toLocaleString()}
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                            {/* Box 1: User */}
                            <div style={{
                                background: 'rgba(255,255,255,0.02)',
                                padding: '2rem 1.5rem',
                                borderRadius: '24px',
                                border: '1px solid rgba(255,255,255,0.08)',
                                textAlign: 'center',
                                backdropFilter: 'blur(20px)',
                                boxShadow: 'inset 0 0 20px rgba(99, 102, 241, 0.05)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem'
                            }}>
                                <div style={{
                                    fontSize: '1.25rem',
                                    color: 'var(--text-main)',
                                    fontWeight: 850,
                                    textTransform: 'capitalize',
                                    letterSpacing: '-0.5px'
                                }}>
                                    {myStats.name}
                                </div>
                                <div style={{
                                    fontSize: '1.75rem',
                                    fontWeight: 850,
                                    color: '#fff',
                                    textShadow: '0 0 20px rgba(255,255,255,0.2)'
                                }}>
                                    ${(myStats.totalContributed || 0).toLocaleString()}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Puso
                                </div>
                            </div>

                            {/* Box 2: First Cohabitant */}
                            {cohabitants.length > 0 && cohabitants.map((person: any) => {

                                return (
                                    <div key={person.id} style={{
                                        background: 'rgba(255,255,255,0.02)',
                                        padding: '2rem 1.5rem',
                                        borderRadius: '24px',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        textAlign: 'center',
                                        backdropFilter: 'blur(20px)',
                                        boxShadow: 'inset 0 0 20px rgba(139, 92, 246, 0.05)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '1rem'
                                    }}>
                                        <div style={{
                                            fontSize: '1.25rem',
                                            color: 'var(--text-main)',
                                            fontWeight: 850,
                                            textTransform: 'capitalize',
                                            letterSpacing: '-0.5px'
                                        }}>
                                            {person.name}
                                        </div>
                                        <div style={{
                                            fontSize: '1.75rem',
                                            fontWeight: 850,
                                            color: '#fff',
                                            textShadow: '0 0 20px rgba(255,255,255,0.2)'
                                        }}>
                                            ${person.totalContributed.toLocaleString()}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Puso
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Debt Summary Line at the bottom */}
                        <div style={{
                            borderTop: '1px solid rgba(255,255,255,0.05)',
                            paddingTop: '1.5rem',
                            textAlign: 'center'
                        }}>
                            {(() => {
                                // Logic: Find who is in negative (owes)
                                const users = [
                                    { name: myStats.name as string, balance: myStats.balance as number },
                                    ...cohabitants.map((c: any) => ({ name: c.name as string, balance: c.balance as number }))
                                ];

                                const debtor = users.find(u => u.balance < -1);
                                if (!debtor) return <span style={{ color: 'var(--success)', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.5px' }}>✨ ¡Están al día! ✨</span>;

                                return (
                                    <div style={{
                                        fontSize: '2rem',
                                        fontWeight: 900,
                                        color: 'var(--error)',
                                        textTransform: 'capitalize',
                                        letterSpacing: '-1px',
                                        textShadow: '0 0 20px rgba(244, 63, 94, 0.3)'
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
