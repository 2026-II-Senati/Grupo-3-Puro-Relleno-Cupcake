import { useEffect, useState } from 'react';

import AgendaPage from '../features/agenda/AgendaPage';

import type {
    OrderRecord,
} from '../features/orders/management/types/OrderRecord';

import {
    getOrders,
} from '../services/ordersManagementApi';

type AgendaStatus = 'loading' | 'ready' | 'error';

export function Agenda() {

    const [orders, setOrders] = useState<OrderRecord[]>([]);

    const [status, setStatus] =
        useState<AgendaStatus>('loading');

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
                    'Error al consultar la agenda:',
                    error
                );

                setStatus('error');
            });

        return () => {
            controller.abort();
        };

    }, []);

    return (
        <AgendaPage
            orders={orders}
            status={status}
        />
    );
}