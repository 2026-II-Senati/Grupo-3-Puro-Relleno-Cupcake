import { sampleOrders } from '../../orders/management/data/sampleOrders';

import { samplePaymentOrders } from '../../payments/data/samplePayments';

import type { DashboardViewer } from '../types/Dashboard';

// Reutilizamos los mismos pedidos de demostración
// que aparecen en los módulos de pedidos y agenda.

export const demoDashboardOrders = sampleOrders;

// Reutilizamos los datos económicos de G3PRC-30.

export const demoDashboardPayments = samplePaymentOrders;

// Configuraciones EXCLUSIVAMENTE ilustrativas.
// No representan la matriz definitiva de permisos.
// La autorización real deberá aplicarse en el backend.

export const demoDashboardViewers: DashboardViewer[] = [
    {
        name: 'Usuario de prueba',
        role: 'admin',
        permissions: {
            viewOrders: true,
            createOrders: true,
            viewCatalog: true,
            viewAgenda: true,
            viewPayments: true,
            viewFinancialSummary: true,
        },
    },
    {
        name: 'Usuario de prueba',
        role: 'customer_service',
        permissions: {
            viewOrders: true,
            createOrders: true,
            viewCatalog: true,
            viewAgenda: true,
            viewPayments: false,
            viewFinancialSummary: false,
        },
    },
    {
        name: 'Usuario de prueba',
        role: 'production',
        permissions: {
            viewOrders: true,
            createOrders: false,
            viewCatalog: false,
            viewAgenda: true,
            viewPayments: false,
            viewFinancialSummary: false,
        },
    },
];