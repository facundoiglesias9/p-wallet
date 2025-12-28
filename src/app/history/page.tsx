import { Search, Filter, ArrowUpCircle, ArrowDownCircle, Download, Calendar } from 'lucide-react';
import { getExpenses } from '@/actions/expenses';
import { getIncomes } from '@/actions/incomes';

export default async function HistoryPage() {
    const expenses = await getExpenses();
    const incomes = await getIncomes();

    const movements = [
        ...expenses.map((e: any) => ({ ...e, type_entity: 'expense' })),
        ...incomes.map((i: any) => ({ ...i, type_entity: 'income' }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="animate-ready" style={{ maxWidth: '1000px', margin: '0 auto' }}>

            <header style={{
                marginBottom: '4rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2rem'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <h1 className="title-metallic-expense" style={{ background: 'linear-gradient(135deg, #fff 0%, #94a3b8 50%, #fff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 0 30px rgba(255,255,255,0.1)' }}>
                        Historial
                    </h1>
                    <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', fontWeight: 500, marginTop: '0.5rem' }}>
                        Todos tus ingresos y gastos registrados.
                    </p>
                </div>

                <button className="btn-premium btn-shimmer" style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    color: '#fff',
                    borderRadius: '16px',
                    padding: '1rem 2rem'
                }}>
                    <Download size={20} />
                    Exportar Todo
                </button>
            </header>

            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Buscar por descripción o categoría..."
                        style={{
                            width: '100%',
                            padding: '1rem 1.25rem 1rem 3.5rem',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--text-main)',
                            fontSize: '1rem'
                        }}
                    />
                </div>
                <button className="btn" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: '#fff' }}>
                    <Calendar size={18} />
                    Todo el Tiempo
                </button>
                <button className="btn" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: '#fff' }}>
                    <Filter size={18} />
                    Filtros
                </button>
            </div>

            <div className="section-card">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Detalle</th>
                            <th>Categoría / Origen</th>
                            <th>Fecha</th>
                            <th style={{ textAlign: 'right' }}>Monto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movements.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                                    Aún no hay movimientos registrados.
                                </td>
                            </tr>
                        ) : (
                            movements.map((mov: any) => (
                                <tr key={mov.id}>
                                    <td>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <div style={{
                                                width: '36px',
                                                height: '36px',
                                                background: mov.type_entity === 'income' ? 'var(--success-bg)' : 'var(--error-bg)',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: mov.type_entity === 'income' ? 'var(--success)' : 'var(--error)'
                                            }}>
                                                {mov.type_entity === 'income' ? <ArrowUpCircle size={18} /> : <ArrowDownCircle size={18} />}
                                            </div>
                                            <span style={{ fontWeight: 600 }}>{mov.description}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem', background: 'var(--bg-card-hover)', padding: '0.3rem 0.6rem', borderRadius: '6px' }}>
                                            {mov.category || mov.source}
                                        </span>
                                    </td>
                                    <td style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        {new Date(mov.date).toLocaleDateString()}
                                    </td>
                                    <td style={{
                                        textAlign: 'right',
                                        fontWeight: 800,
                                        color: mov.type_entity === 'income' ? 'var(--success)' : 'var(--error)',
                                        fontSize: '1.1rem'
                                    }}>
                                        {mov.type_entity === 'income' ? `+$${mov.amount.toLocaleString()}` : `-$${mov.amount.toLocaleString()}`}
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
