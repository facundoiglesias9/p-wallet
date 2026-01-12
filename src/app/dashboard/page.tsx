import { ArrowUpCircle, ArrowDownCircle, Banknote, Target, PieChart, RefreshCw, CreditCard, Users } from 'lucide-react';
import prisma from '@/lib/prisma';
import { MonthPicker } from '@/components/ui/MonthPicker';
import { getIncomes } from '@/actions/incomes';
import { SavingsGoalWidget } from '@/components/features/savings/SavingsGoalWidget';
import { verifySession } from '@/lib/session';
import { getPeople } from '@/actions/settings';
import { getDateFilter } from '@/actions/app-settings';
import { InstallPWA } from '@/components/ui/InstallPWA';

export default async function Dashboard() {
  // Obtener fecha desde cookies
  const { month: selectedMonth, year: selectedYear } = await getDateFilter();

  const startOfMonth = new Date(selectedYear, selectedMonth, 1);
  const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0);

  // Fetch real data filtered by current range
  const session = await verifySession();
  const userId = session?.userId as string;

  // Use raw query to bypass stale Prisma Client types
  const expenses: any[] = await prisma.$queryRaw`
    SELECT * FROM "Expense" 
    WHERE "userId" = ${userId} 
    AND date >= ${startOfMonth} 
    AND date <= ${endOfMonth}
  `;

  /* Total Incomes Calculation using shared Recurring Logic */
  const incomes = await getIncomes(selectedMonth + 1, selectedYear);
  const totalIncome = incomes.reduce((sum: any, i: any) => sum + i.amount, 0);

  // Get count of people involved in general shared expenses.
  // Initially we assume ALL people participate in shared expenses unless we complicate the schema further.
  // Get count of people involved in general shared expenses.
  const people = await getPeople();
  const participantCount = people.length + 1; // Me + Others

  const totalSpent = expenses.reduce((sum: number, e: any) => {
    const isShared = e.isShared;
    return sum + (isShared ? e.amount / participantCount : e.amount);
  }, 0);

  const balance = totalIncome - totalSpent;

  const stats = [
    { label: 'Total Ingresos', value: `$${totalIncome.toLocaleString()}`, icon: <ArrowUpCircle />, color: 'var(--success)' },
    { label: 'Total Gastado', value: `$${totalSpent.toLocaleString()}`, icon: <ArrowDownCircle />, color: 'var(--error)' },
    { label: 'Balance Final', value: `$${balance.toLocaleString()}`, icon: <Banknote />, color: 'var(--primary)' },
  ];

  const importantPayments = expenses
    .filter((e: any) => e.type !== 'SINGLE')
    .slice(0, 3)
    .map((e: any) => ({
      name: e.type === 'INSTALLMENT' ? `${e.description} (Cuota ${e.installmentNumber}/${e.installmentsTotal})` : e.description,
      amount: `$${e.amount.toLocaleString()}`,
      type: e.type === 'SUBSCRIPTION' ? 'subscription' : 'installment',
      icon: e.type === 'SUBSCRIPTION' ? <RefreshCw size={14} /> : <CreditCard size={14} />
    }));

  // Categories calculation
  const catSums: Record<string, number> = {};
  expenses.forEach((e: any) => {
    catSums[e.category] = (catSums[e.category] || 0) + e.amount;
  });

  const categorySpending = Object.entries(catSums).map(([name, spent]) => ({
    name,
    spent: `$${spent.toLocaleString()}`,
    percentage: totalSpent > 0 ? Math.round((spent / totalSpent) * 100) : 0,
    color: '#6366f1' // Default color
  })).sort((a, b) => parseFloat(b.spent.replace('$', '').replace(',', '')) - parseFloat(a.spent.replace('$', '').replace(',', ''))).slice(0, 3);

  return (
    <div className="animate-ready">
      <header style={{
        marginBottom: '3rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
        position: 'relative' // Needed for absolute positioning if we wanted, but flex is better
      }}>
        {/* PWA Install Button Helper */}
        <div style={{ position: 'absolute', top: 0, right: 0 }}>
          <InstallPWA />
        </div>

        <div style={{ textAlign: 'center' }}>
          <h1 className="title-metallic-dashboard">
            Resumen Mensual
          </h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', fontWeight: 500, marginTop: '0.5rem' }}>
            Tu salud financiera de un vistazo.
          </p>
        </div>

        {/* Client Component for interactivity */}
        <MonthPicker initialMonth={selectedMonth} initialYear={selectedYear} />
      </header>

      <section className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div style={{ color: stat.color, marginBottom: '1.5rem', transform: 'scale(1.2)', display: 'inline-block' }}>
              {stat.icon}
            </div>
            <span className="stat-label">{stat.label}</span>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Category Breakdown */}
          <section className="section-card">
            <div className="section-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <PieChart size={24} color="var(--primary)" />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Gastos por Categoría</h2>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {categorySpending.length === 0 ? (
                <p style={{ color: 'var(--text-dim)', textAlign: 'center' }}>Sin datos este mes.</p>
              ) : (
                categorySpending.map((cat, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span style={{ fontWeight: 600 }}>{cat.name}</span>
                      <span style={{ color: 'var(--text-dim)' }}>{cat.spent}</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'var(--bg-card-hover)', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ width: `${cat.percentage}%`, height: '100%', background: cat.color, borderRadius: '99px' }}></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Recurrent & Installments Info */}
          <section className="section-card">
            <div className="section-header">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Pagos Fijos del Mes</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {importantPayments.length === 0 ? (
                <p style={{ color: 'var(--text-dim)', gridColumn: 'span 2', textAlign: 'center' }}>No hay pagos fijos registrados.</p>
              ) : (
                importantPayments.map((pay: any, i: any) => (
                  <div key={i} style={{ background: 'var(--bg-card-hover)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', color: pay.type === 'subscription' ? 'var(--primary)' : 'var(--warning)', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {pay.icon} {pay.type}
                      </span>
                      <span style={{ fontWeight: 700 }}>{pay.amount}</span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{pay.name}</div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Savings Goal / Insight using interactive widget */}
        <SavingsGoalWidget currentSavings={balance} />
      </div>
    </div>
  );
}
