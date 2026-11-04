import { useEffect, useState } from 'react';

import DashboardPage from '../features/dashboard/DashboardPage';

import { useAuth } from '../features/auth/AuthProvider';

import { getOrders } from '../services/ordersManagementApi';
import { getPaymentOrders } from '../services/paymentsApi';

import type {
    OrderRecord,
} from '../features/orders/management/types/OrderRecord';

import type {
    PaymentOrder,
} from '../features/payments/types/Payment';

import type {
    DashboardPermissions,
    DashboardRole,
    DashboardViewer,
} from '../features/dashboard/types/Dashboard';

type LoadStatus = 'loading' | 'ready' | 'error';

const permissionsByRole: Record<
    DashboardRole,
    DashboardPermissions
> = {
    admin: {
        viewOrders: true,
        createOrders: true,
        viewCatalog: true,
        viewAgenda: true,
        viewPayments: true,
        viewFinancialSummary: true,
    },

    customer_service: {
        viewOrders: true,
        createOrders: true,
        viewCatalog: true,
        viewAgenda: true,
        viewPayments: true,
        viewFinancialSummary: true,
    },

    production: {
        viewOrders: true,
        createOrders: false,
        viewCatalog: false,
        viewAgenda: true,
        viewPayments: false,
        viewFinancialSummary: false,
    },
};

export function Dashboard() {
    const { session } = useAuth();

    const [orders, setOrders] = useState<OrderRecord[]>([]);

    const [paymentOrders, setPaymentOrders] =
        useState<PaymentOrder[]>([]);

    const [status, setStatus] =
        useState<LoadStatus>('loading');

    const userId = session?.user.id ?? null;

    const roleName =
        session?.user.role.trim().toLowerCase() ?? '';

    const role: DashboardRole | null =
        roleName === 'admin' ||
        roleName === 'customer_service' ||
        roleName === 'production'
            ? roleName
            : null;

    useEffect(() => {
        if (!userId || !role) {
            return;
        }

        const controller = new AbortController();

        async function loadDashboard() {
            try {
                const [ordersData, paymentsData] =
                    await Promise.all([
                        getOrders(controller.signal),

                        role === 'production'
                            ? Promise.resolve(
                                [] as PaymentOrder[]
                            )
                            : getPaymentOrders(
                                controller.signal
                            ),
                    ]);

                if (controller.signal.aborted) {
                    return;
                }

                setOrders(ordersData);
                setPaymentOrders(paymentsData);
                setStatus('ready');

            } catch (error) {
                if (controller.signal.aborted) {
                    return;
                }

                console.error(
                    'Error al cargar el dashboard:',
                    error
                );

                setStatus('error');
            }
        }

        void loadDashboard();

        return () => {
            controller.abort();
        };

    }, [userId, role]);

    if (!session || !role) {
        return (
            <main style={{ padding: 32 }}>
                <h1>Rol no configurado</h1>

                <p>
                    No se pudo identificar un rol válido
                    para este usuario.
                </p>
            </main>
        );
    }

    const viewer: DashboardViewer = {
        name: session.user.fullName,
        role,
        permissions: permissionsByRole[role],
    };

    return (
        <DashboardPage
            orders={orders}
            paymentOrders={paymentOrders}
            viewer={viewer}
            status={status}
        />
    );
}