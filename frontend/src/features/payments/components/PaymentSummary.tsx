import Card from '../../../components/Card/Card';
import Badge from '../../../components/Badge/Badge';

import {
    calculatePaymentTotals,
    formatSoles,
    paymentStatusLabels,
} from '../types/Payment';

import type {
    PaymentOrder,
    PaymentStatus,
} from '../types/Payment';

interface PaymentSummaryProps {
    order: PaymentOrder;
}

const badgeVariants: Record<
    PaymentStatus,
    'warning' | 'info' | 'success'
> = {
    pending: 'warning',
    partial: 'info',
    paid: 'success',
};

export default function PaymentSummary({
                                           order,
                                       }: PaymentSummaryProps) {
    const totals = calculatePaymentTotals(order);

    return (
        <Card
            heading="Resumen económico"
            description={`Pedido ${order.id} — ${order.customerName}`}
        >
            <div className="prc-payment-status">
                <Badge variant={badgeVariants[totals.status]}>
                    {paymentStatusLabels[totals.status]}
                </Badge>
            </div>

            <dl className="prc-payment-summary">
                <div>
                    <dt>Importe total</dt>
                    <dd>{formatSoles(totals.totalCents)}</dd>
                </div>

                <div>
                    <dt>Importe pagado</dt>
                    <dd>{formatSoles(totals.paidCents)}</dd>
                </div>

                <div className="prc-payment-balance">
                    <dt>Saldo pendiente</dt>
                    <dd>{formatSoles(totals.balanceCents)}</dd>
                </div>
            </dl>
        </Card>
    );
}