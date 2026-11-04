import { useEffect, useState } from 'react';

import OrderManagementPage from
        '../features/orders/management/OrderManagementPage';

import type {
    OrderRecord,
} from '../features/orders/management/types/OrderRecord';

import {
    getOrders,
    updateOrderStatus,
} from '../services/ordersManagementApi';

type LoadStatus = 'loading' | 'ready' | 'error';

export function Pedidos() {
    const [orders, setOrders] = useState<OrderRecord[]>([]);

    const [status, setStatus] =
        useState<LoadStatus>('loading');

    useEffect(() => {
        const controller = new AbortController();

        getOrders(controller.signal)
            .then((data) => {
                if (controller.signal.aborted) {
                    return;
                }

                setOrders(data);
                setStatus('ready');
            })
            .catch((error: unknown) => {
                if (controller.signal.aborted) {
                    return;
                }

                console.error(
                    'No se pudieron consultar los pedidos:',
                    error
                );

                setStatus('error');
            });

        return () => {
            controller.abort();
        };
    }, []);

    return (
        <OrderManagementPage
            initialOrders={orders}
            status={status}
            onStatusChange={updateOrderStatus}
        />
    );
}