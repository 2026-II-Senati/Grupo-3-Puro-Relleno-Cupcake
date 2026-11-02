import PaymentManagementPage from '../features/payments/PaymentManagementPage';

import { samplePaymentOrders } from '../features/payments/data/samplePayments';

export function Pagos() {
    return (
        <PaymentManagementPage
            initialOrders={samplePaymentOrders}
        />
    );
}