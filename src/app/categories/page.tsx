import {
    Plus,
    Utensils,
    Car,
    Tv,
    Home,
    ShoppingBag,
    Heart,
    Gamepad2,
    Coffee,
    MoreVertical,
    Shapes,
    LucideIcon,
    Zap, Bus, Shirt, Music, Plane, GraduationCap, CreditCard, Banknote, Coins
} from 'lucide-react';
import prisma from '@/lib/prisma';
import { CategoryForm } from '@/components/features/categories/CategoryForm';
import { CategoryItem } from '@/components/features/categories/CategoryItem';

import { verifySession } from '@/lib/session';

export default async function CategoriesPage() {
    const categoriesDb = await prisma.category.findMany();

    const session = await verifySession();
    const userId = session?.userId as string;

    // Explicitly scope expenses to the current user using raw SQL to ensure correctness and bypass stale types
    let expensesDb: any[] = [];
    if (userId) {
        try {
            expensesDb = await prisma.$queryRaw`
                SELECT * FROM Expense 
                WHERE userId = ${userId}
            ` as any[];
        } catch (e) {
            console.error("Failed to fetch expenses for categories", e);
            expensesDb = [];
        }
    }

    const iconMap: Record<string, LucideIcon> = {
        Utensils, Car, Tv, Home, ShoppingBag, Heart, Gamepad2, Coffee, Zap, Bus, Shirt, Music, Plane, GraduationCap, CreditCard, Banknote, Coins,
        Hash: Shapes
    };

    const categories = categoriesDb.map((cat: any) => {
        const relatedExpenses = expensesDb.filter((e: any) => e.category === cat.name);
        // Calculate Total per Category
        const total = relatedExpenses.reduce((sum: number, e: any) => sum + e.amount, 0);
        return {
            ...cat,
            // Pass icon NAME as check, but we need component for render if we want to pass it down properly or handle inside.
            // Actually CategoryItem expects the Icon Component or handles string mapping?
            // CategoryItem prop iconComponent expects component.
            count: relatedExpenses.length,
            total: `$${total.toLocaleString()}`
        };
    });

    return (
        <div className="animate-ready" style={{ maxWidth: '1200px', margin: '0 auto' }}>

            <header style={{
                marginBottom: '4rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2rem'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <h1 className="title-metallic-category">
                        Categorías
                    </h1>
                    <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', fontWeight: 500, marginTop: '0.5rem' }}>
                        Organiza tus gastos e ingresos con etiquetas.
                    </p>
                </div>

                <CategoryForm />
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {categories.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-dim)', padding: '4rem' }}>
                        No hay categorías creadas aún.
                    </div>
                ) : (
                    categories.map((cat: any) => (
                        <CategoryItem
                            key={cat.id}
                            category={cat}
                            iconName={cat.icon}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
