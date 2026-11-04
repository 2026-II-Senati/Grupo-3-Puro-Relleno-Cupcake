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

import {
    useAuth,
} from '../features/auth/AuthProvider';

type LoadStatus = 'loading' | 'ready' | 'error';

export function Pedidos() {

    // Identificamos al usuario autenticado.
    const { session } = useAuth();

    const role =
        session?.user.role.trim().toLowerCase() ?? '';

    // Administrador y Producción pueden cambiar estados.
    const canUpdateStatus =
        role === 'admin' ||
        role === 'production';

    // Administrador y Atención pueden registrar pedidos.
    const canCreateOrders =
        role === 'admin' ||
        role === 'customer_service';

    // Pedidos recuperados de PostgreSQL.
    const [orders, setOrders] =
        useState<OrderRecord[]>([]);

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
            key={status}
            initialOrders={orders}
            status={status}
            onStatusChange={updateOrderStatus}

            canUpdateStatus={canUpdateStatus}
            canCreateOrders={canCreateOrders}
        />
    );
}