import {
    useEffect,
    useState,
} from 'react';

import PaymentManagementPage from '../features/payments/PaymentManagementPage';

import type {
    PaymentDraft,
    PaymentOrder,
} from '../features/payments/types/Payment';

import {
    getPaymentOrders,
    registerPayment,
} from '../services/paymentsApi';

type PageStatus = 'loading' | 'ready' | 'error';

export function Pagos() {
    const [orders, setOrders] = useState<PaymentOrder[]>([]);

    const [status, setStatus] =
        useState<PageStatus>('loading');

    useEffect(() => {
        const controller = new AbortController();

        getPaymentOrders(controller.signal)
            .then((data) => {
                if (controller.signal.aborted) {
                    return;
                }

                setOrders(data);
                setStatus('ready');
            })
            .catch((error) => {
                if (controller.signal.aborted) {
                    return;
                }

                console.error(
                    'Error al cargar los pagos:',
                    error
                );

                setStatus('error');
            });

        return () => controller.abort();
    }, []);

    async function handleRegisterPayment(
        orderId: string,
        draft: PaymentDraft
    ): Promise<void> {
        /*
         * Primero guardamos en PostgreSQL.
         * Solo después actualizamos React.
         */
        const savedPayment = await registerPayment(
            orderId,
            draft
        );

        setOrders((previous) =>
            previous.map((order) =>
                order.id === orderId
                    ? {
                        ...order,
                        payments: [
                            ...order.payments,
                            savedPayment,
                        ],
                    }
                    : order
            )
        );
    }

    return (
        <PaymentManagementPage
            orders={orders}
            status={status}
            onRegisterPayment={handleRegisterPayment}
        />
    );
}