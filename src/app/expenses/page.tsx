import {
    Search,
    Filter,
    FileSpreadsheet
} from 'lucide-react';
import { MonthPicker } from '@/components/ui/MonthPicker';
import prisma from '@/lib/prisma';
import { getExpenses, getCategories } from '@/actions/expenses';
import { ExpenseForm } from '@/components/features/expenses/ExpenseForm';
import { ExpenseItem } from '@/components/features/expenses/ExpenseItem';
import { getPeople } from '@/actions/settings';

export default async function ExpensesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { month: monthStr, year: yearStr } = await searchParams;

    const month = monthStr ? parseInt(monthStr as string) : 0;
    const year = yearStr ? parseInt(yearStr as string) : 2026;

    const expensesRaw = await getExpenses(month, year);
    const categories = await getCategories();
    // Use the robust getPeople action which handles potential client generation issues
    const people = await getPeople();

    const session = await (await import('@/lib/session')).verifySession();
    const userId = session?.userId as string;
    const userRec = userId ? await prisma.$queryRaw`SELECT username FROM User WHERE id = ${userId}` as any[] : [];
    const currentUserName = userRec[0]?.username || 'Yo';

    // Serializamos las fechas para evitar advertencias de "Date object" en props de Client Component
    const expenses = expensesRaw.map((e: any) => ({
        ...e,
        date: e.date.toISOString(),
        createdAt: e.createdAt.toISOString(),
        updatedAt: e.updatedAt.toISOString()
    }));

    const totalAmount = expenses.reduce((sum: number, e: any) => sum + e.amount, 0);

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>

            {/* Header Section */}
            <header style={{
                marginBottom: '4rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2rem'
            }}>
                <div className="animate-ready" style={{ textAlign: 'center' }}>
                    <h1 className="title-metallic-expense">
                        Gastos
                    </h1>
                    <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', fontWeight: 500, marginTop: '0.5rem' }}>
                        Detalle de tus consumos y financiamientos.
                    </p>
                </div>

                {/* Filters Row */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    width: '100%',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                }}>
                    <MonthPicker />
                    <div style={{ height: '30px', width: '1px', background: 'var(--border)' }}></div>
                </div>

                {/* Actions Row */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-shimmer" style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        color: '#10b981',
                        padding: '0.75rem 1.75rem',
                        fontWeight: 700,
                        borderRadius: '16px'
                    }}>
                        <FileSpreadsheet size={18} />
                        Exportar CSV
                    </button>

                    <ExpenseForm
                        categories={categories}
                        people={people}
                        currentUserName={currentUserName}
                        defaultMonth={month}
                        defaultYear={year}
                    />
                </div>
            </header>

            {/* Monthly Total Summary */}
            <div className="animate-ready" style={{
                textAlign: 'center',
                marginBottom: '2rem',
                background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.1) 0%, rgba(244, 63, 94, 0.05) 100%)',
                padding: '1.5rem',
                borderRadius: '20px',
                border: '1px solid rgba(244, 63, 94, 0.2)',
                maxWidth: '400px',
                margin: '0 auto 3rem auto',
                boxShadow: '0 20px 40px -10px rgba(244, 63, 94, 0.2)'
            }}>
                <span style={{ display: 'block', color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Total Gastado
                </span>
                <span style={{ fontSize: '2.5rem', fontWeight: 850, color: 'var(--error)', textShadow: '0 0 40px rgba(244, 63, 94, 0.3)' }}>
                    ${totalAmount.toLocaleString()}
                </span>
            </div>

            {/* List */}
            <div className="animate-ready" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {expenses.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '5rem', background: 'var(--bg-card)', borderRadius: '24px', border: '1px dashed var(--border)' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No hay gastos registrados.</p>
                    </div>
                ) : (
                    expenses.map((expense: any) => (
                        <ExpenseItem
                            key={expense.id}
                            expense={expense}
                            categories={categories}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
