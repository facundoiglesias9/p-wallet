import { getExpenses, getCategories } from '../actions';
import { MonthPicker } from '@/components/MonthPicker';
import { CheckCircle2, Circle, Layers } from 'lucide-react';
import { toggleCategoryPaid } from './actions';
import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';

export default async function PaymentsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { month: monthStr, year: yearStr } = await searchParams;
    const month = monthStr ? parseInt(monthStr as string) : new Date().getMonth();
    const year = yearStr ? parseInt(yearStr as string) : new Date().getFullYear();

    const expensesRaw = await getExpenses(month, year);
    const categoriesDb = await getCategories();

    const session = await verifySession();
    const userId = session?.userId as string;

    // Fetch Payment Status for all categories in this month
    let categoryPayments: any[] = [];
    try {
        // Safe access to model for dev environment stability
        if ((prisma as any).categoryPayment) {
            categoryPayments = await prisma.categoryPayment.findMany({
                where: {
                    month,
                    year,
                    userId
                }
            });
        } else {
            console.warn("CategoryPayment model not found on client, using raw query fallback.");
            categoryPayments = await prisma.$queryRaw`SELECT * FROM CategoryPayment WHERE month = ${month} AND year = ${year} AND userId = ${userId}`;
            // Map raw results if necessary (usually SQLite returns matching column names, but booleans might be 1/0)
            categoryPayments = categoryPayments.map(cp => ({
                ...cp,
                isPaid: Boolean(cp.isPaid) // Ensure boolean
            }));
        }
    } catch (e) {
        console.error("Failed to fetch category payments:", e);
    }

    const categoryPaymentMap = new Map(categoryPayments.map(cp => [cp.categoryId, cp.isPaid]));

    // Group by category
    const grouped: Record<string, any[]> = {};
    expensesRaw.forEach((e: any) => {
        // Skip "Efectivo" or "efectivo" from payments view
        if (e.category.toLowerCase() === 'efectivo') return;

        if (!grouped[e.category]) {
            grouped[e.category] = [];
        }
        grouped[e.category].push(e);
    });

    const categoriesList = Object.keys(grouped).sort();

    return (
        <div className="animate-ready" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem' }}>
            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 className="title-metallic-income" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                    Pagos Mensuales
                </h1>
                <p style={{ color: 'var(--text-dim)' }}>
                    Controla el pago total de cada categoría.
                </p>
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                    <MonthPicker />
                </div>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {categoriesList.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)', border: '1px dashed var(--border)', borderRadius: '16px' }}>
                        No hay gastos para este mes.
                    </div>
                ) : (
                    categoriesList.map(catName => {
                        const items = grouped[catName];
                        const total = items.reduce((sum, i) => sum + i.amount, 0);

                        // Find category ID
                        const catObj = categoriesDb.find((c: any) => c.name === catName);
                        // Default to false if not found or no payment record
                        const isCategoryPaid = catObj ? (categoryPaymentMap.get(catObj.id) ?? false) : false;
                        const categoryId = catObj?.id ?? '';

                        return (
                            <section key={catName} className="section-card" style={{ padding: '0', overflow: 'hidden', border: isCategoryPaid ? '1px solid var(--success-bg)' : '1px solid var(--border)', transition: '0.3s' }}>
                                <div style={{
                                    padding: '1.25rem 1.5rem',
                                    background: isCategoryPaid ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255,255,255,0.02)',
                                    borderBottom: '1px solid var(--border)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        {/* Main Toggle Button */}
                                        {categoryId && (
                                            <form action={async () => {
                                                'use server';
                                                await toggleCategoryPaid(categoryId, month, year, isCategoryPaid);
                                            }}>
                                                <button
                                                    type="submit"
                                                    style={{
                                                        background: 'transparent',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        color: isCategoryPaid ? 'var(--success)' : 'var(--text-muted)'
                                                    }}
                                                >
                                                    {isCategoryPaid ? <CheckCircle2 size={28} fill="rgba(16, 185, 129, 0.2)" /> : <Circle size={28} />}
                                                </button>
                                            </form>
                                        )}

                                        <div>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: isCategoryPaid ? 'var(--success)' : 'var(--text-main)' }}>{catName}</h3>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                                                {items.length} movimientos
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ fontWeight: 800, fontSize: '1.25rem', display: 'block' }}>${total.toLocaleString()}</span>
                                        {isCategoryPaid && <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>PAGADO</span>}
                                    </div>
                                </div>

                                <div style={{ opacity: isCategoryPaid ? 0.5 : 1, transition: '0.3s', pointerEvents: 'none' }}>
                                    {items.map((item: any) => (
                                        <div
                                            key={item.id}
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '1.25rem 1.5rem',
                                                borderBottom: '1px solid var(--border)',
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div>
                                                    <div style={{
                                                        fontWeight: 600,
                                                        fontSize: '0.95rem',
                                                        color: 'var(--text-dim)',
                                                        marginBottom: '2px'
                                                    }}>
                                                        {item.description}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                        {new Date(item.date).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{
                                                fontWeight: 600,
                                                fontSize: '0.95rem',
                                                color: 'var(--text-dim)'
                                            }}>
                                                ${item.amount.toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        );
                    })
                )}
            </div>
        </div>
    );
}
