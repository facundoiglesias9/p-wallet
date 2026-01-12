import { FileSpreadsheet } from 'lucide-react';
import { getIncomes } from '@/actions/incomes';
import { IncomeForm } from '@/components/features/incomes/IncomeForm';
import { IncomeItem } from '@/components/features/incomes/IncomeItem';
import { MonthPicker } from '@/components/ui/MonthPicker';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';

import { getDateFilter } from '@/actions/app-settings';

export default async function IncomesPage() {
    // Cookie based filter
    const { month: selectedMonth, year } = await getDateFilter();
    // Incomes logic expects "human month" (1-12) usually, but let's check getIncomes.
    // getIncomes param name is "month", previously it was adding +1.
    // Let's assume getIncomes expects 1-based month if it was doing "parseInt + 1".
    // getDateFilter returns 0-based month. So we add 1.
    const month = selectedMonth + 1;

    const incomes = await getIncomes(month, year);

    // Fetch pool of people for the income form (Raw SQL for stability)
    const session = await verifySession();
    const userId = session?.userId as string;
    const people = userId ? await prisma.$queryRaw`
        SELECT * FROM "Person" 
        WHERE "userId" = ${userId} AND role = 'COHABITANT'
        ORDER BY name ASC
    ` as any[] : [];

    const userRec = userId ? await prisma.$queryRaw`SELECT username FROM "User" WHERE id = ${userId}` as any[] : [];
    const dbName = userRec[0]?.username;
    const currentUserName = (dbName && !dbName.startsWith('user_')) ? dbName : 'Yo';

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
                    <h1 className="title-metallic-income">
                        Ingresos
                    </h1>
                    <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', fontWeight: 500, marginTop: '0.5rem' }}>
                        Gestiona tus entradas de dinero.
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
                    <MonthPicker initialMonth={selectedMonth} initialYear={year} />
                    <div style={{ height: '30px', width: '1px', background: 'var(--border)' }}></div>
                    <IncomeForm people={people} currentUserName={currentUserName} />
                </div>
            </header>

            <div className="animate-ready" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {incomes.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '5rem', background: 'var(--bg-card)', borderRadius: '24px', border: '1px dashed var(--border)' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No hay ingresos registrados en este mes.</p>
                    </div>
                ) : (
                    incomes.map((income: any) => (
                        <IncomeItem
                            key={income.id + (income.isRecurring ? '-rec' : '')}
                            income={income}
                            people={people}
                            currentUserName={currentUserName}
                            viewMonth={month}
                            viewYear={year}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
