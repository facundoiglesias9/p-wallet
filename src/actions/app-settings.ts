'use server';

import { cookies } from 'next/headers';

export async function setDateFilter(month: number, year: number) {
    const cookieStore = await cookies();
    cookieStore.set('dashboard_month', month.toString());
    cookieStore.set('dashboard_year', year.toString());
}

export async function getDateFilter() {
    const cookieStore = await cookies();
    const month = cookieStore.get('dashboard_month');
    const year = cookieStore.get('dashboard_year');

    // Default: Mes siguiente al actual (según lógica de negocio existente)
    const now = new Date();
    // Argentina Timezone adjustment simplified
    let defaultMonth = now.getMonth() + 1;
    let defaultYear = now.getFullYear();

    if (defaultMonth > 11) {
        defaultMonth = 0;
        defaultYear += 1;
    }

    return {
        month: month ? parseInt(month.value) : defaultMonth,
        year: year ? parseInt(year.value) : defaultYear
    };
}
