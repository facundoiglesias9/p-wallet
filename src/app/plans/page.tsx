import { PlanForm } from '@/components/features/plans/PlanForm';
import { PlanItem } from '@/components/features/plans/PlanItem';
import { getPlans } from '@/actions/plans';
import { getCategories } from '@/actions/expenses';
import { Target, Sparkles } from 'lucide-react';

export default async function PlansPage() {
    const plans = await getPlans();
    const categories = await getCategories();

    const totalEstimated = plans.reduce((sum, p) => sum + p.amount, 0);

    return (
        <div className="animate-ready" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem' }}>

            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 className="title-metallic-plans" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                    Planes de Gastos
                </h1>
                <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
                    Tu lista de deseos inteligente. Planifica tus próximas inversiones y calcula su impacto.
                </p>
            </header>

            <PlanForm />

            {/* Resumen flotante si hay planes */}
            {plans.length > 0 && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '2rem',
                    background: 'rgba(255,255,255,0.03)',
                    padding: '1rem 1.5rem',
                    borderRadius: '16px',
                    border: '1px solid var(--border)'
                }}>
                    <Sparkles size={20} className="text-yellow-400" />
                    <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>Total Estimado:</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        ${totalEstimated.toLocaleString()}
                    </span>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {plans.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem 2rem',
                        gridColumn: '1 / -1',
                        border: '2px dashed var(--border)',
                        borderRadius: '24px',
                        color: 'var(--text-dim)'
                    }}>
                        <p style={{ marginBottom: '1rem' }}>Aún no tienes planes guardados.</p>
                        <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Usa el botón "Nuevo Plan" para agregar tu primera meta de compra.</p>
                    </div>
                ) : (
                    plans.map((plan) => (
                        <PlanItem key={plan.id} plan={plan} categories={categories} />
                    ))
                )}
            </div>
        </div>
    );
}
