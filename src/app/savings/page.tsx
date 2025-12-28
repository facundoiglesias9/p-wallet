import { Trash2, PiggyBank, TrendingUp } from 'lucide-react';
import { getSavings, deleteSaving } from '@/actions/savings';
import { AddSavingButton } from '@/components/features/savings/AddSavingButton';
import { MonthPicker } from '@/components/ui/MonthPicker';

export default async function SavingsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams; // Await searchParams for Next 15 compatibility
    // Note: getSavings currently returns ALL savings, ignoring year param for now as per requirement for "Saved month by month" table, 
    // but we might want to filter or just show all. User asked for "tabla de los ahorros que se cargaron mes a mes".
    // Showing all history is safer for "Total Saved".
    const savings = await getSavings();

    const totalARS = savings
        .filter((s: any) => s.currency === 'ARS')
        .reduce((sum: any, s: any) => sum + s.amount, 0);

    const totalUSD = savings
        .filter((s: any) => s.currency === 'USD')
        .reduce((sum: any, s: any) => sum + s.amount, 0);

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>
            <header style={{
                marginBottom: '4rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2rem'
            }}>
                <div className="animate-ready" style={{ textAlign: 'center' }}>
                    <h1 className="title-metallic-income" style={{
                        background: 'linear-gradient(to right, #10b981, #3b82f6)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent'
                    }}>
                        Ahorros
                    </h1>
                    <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', fontWeight: 500, marginTop: '0.5rem' }}>
                        Gestiona tu patrimonio acumulado.
                    </p>
                </div>

                {/* Total Cards */}
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
                    <div className="stat-card" style={{ flex: '1 1 300px', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}><PiggyBank size={32} /></div>
                            <AddSavingButton currency="ARS" />
                        </div>
                        <span className="stat-label">Total Ahorrado (ARS)</span>
                        <div className="stat-value">${totalARS.toLocaleString()}</div>
                    </div>
                    <div className="stat-card" style={{ flex: '1 1 300px', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ color: '#10b981', marginBottom: '1rem' }}><TrendingUp size={32} /></div>
                            <AddSavingButton currency="USD" />
                        </div>
                        <span className="stat-label">Total Ahorrado (USD)</span>
                        <div className="stat-value">US$ {totalUSD.toLocaleString()}</div>
                    </div>
                </div>

                <div style={{ height: '1px', width: '100%', background: 'var(--border)', maxWidth: '600px' }}></div>
            </header>

            <div className="animate-ready" style={{ background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Descripción</th>
                            <th>Monto</th>
                            <th>Moneda</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {savings.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                                    No hay ahorros registrados.
                                </td>
                            </tr>
                        ) : (
                            savings.map((s: any) => (
                                <tr key={s.id}>
                                    <td>
                                        {new Date(s.date).toLocaleDateString()}
                                    </td>
                                    <td>
                                        {s.description || '-'}
                                    </td>
                                    <td style={{ fontWeight: 700, color: s.currency === 'USD' ? '#10b981' : 'var(--text-main)' }}>
                                        {s.currency === 'USD' ? 'US$' : '$'} {s.amount.toLocaleString()}
                                    </td>
                                    <td>
                                        <span style={{
                                            background: s.currency === 'USD' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                                            color: s.currency === 'USD' ? '#10b981' : 'var(--primary)',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '99px',
                                            fontSize: '0.8rem',
                                            fontWeight: 700
                                        }}>
                                            {s.currency}
                                        </span>
                                    </td>
                                    <td>
                                        <form action={deleteSaving.bind(null, s.id)}>
                                            <button
                                                type="submit"
                                                style={{
                                                    background: 'rgba(239, 68, 68, 0.1)',
                                                    color: 'var(--error)',
                                                    border: 'none',
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    transition: '0.2s'
                                                }}
                                                title="Eliminar Ahorro"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
