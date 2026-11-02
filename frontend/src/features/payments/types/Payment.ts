export type PaymentMethod =
    | 'cash'
    | 'transfer'
    | 'yape'
    | 'plin';

export type PaymentStatus =
    | 'pending'
    | 'partial'
    | 'paid';

export interface PaymentMovement {
    id: string;
    amountCents: number;
    paymentDate: string;
    method: PaymentMethod;
    reference?: string;
}

export interface PaymentOrder {
    id: string;
    customerName: string;
    totalCents: number;
    payments: PaymentMovement[];
}

export interface PaymentTotals {
    totalCents: number;
    paidCents: number;
    balanceCents: number;
    status: PaymentStatus;
}

export interface PaymentDraft {
    amountCents: number;
    paymentDate: string;
    method: PaymentMethod;
    reference?: string;
}

export const paymentMethodLabels: Record<
    PaymentMethod,
    string
> = {
    cash: 'Efectivo',
    transfer: 'Transferencia bancaria',
    yape: 'Yape',
    plin: 'Plin',
};

export const paymentStatusLabels: Record<
    PaymentStatus,
    string
> = {
    pending: 'Pendiente de pago',
    partial: 'Parcialmente pagado',
    paid: 'Pagado',
};

// Todos los importes se expresan internamente
// en céntimos para evitar errores de decimales.
// Al integrar la API, se adaptará el formato
// acordado con el equipo de backend.

export function calculatePaymentTotals(
    order: PaymentOrder
): PaymentTotals {
    const paidCents = order.payments.reduce(
        (sum, payment) => sum + payment.amountCents,
        0
    );

    const balanceCents = Math.max(
        0,
        order.totalCents - paidCents
    );

    let status: PaymentStatus = 'pending';

    if (balanceCents === 0) {
        status = 'paid';
    } else if (paidCents > 0) {
        status = 'partial';
    }

    return {
        totalCents: order.totalCents,
        paidCents,
        balanceCents,
        status,
    };
}

export function formatSoles(cents: number): string {
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
    }).format(cents / 100);
}

export function getLocalToday(): string {
    const today = new Date();

    return [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, '0'),
        String(today.getDate()).padStart(2, '0'),
    ].join('-');
}