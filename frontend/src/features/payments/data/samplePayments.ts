import type {
    PaymentOrder,
} from '../types/Payment';

export const samplePaymentOrders: PaymentOrder[] = [
    {
        id: 'PED-1001',
        customerName: 'María López',
        totalCents: 15000,
        payments: [
            {
                id: 'PAG-001',
                amountCents: 6000,
                paymentDate: '2026-11-01',
                method: 'yape',
                reference: 'YP-001234',
            },
        ],
    },
    {
        id: 'PED-1002',
        customerName: 'Carlos Ramírez',
        totalCents: 24000,
        payments: [],
    },
    {
        id: 'PED-1003',
        customerName: 'Ana Torres',
        totalCents: 3500,
        payments: [
            {
                id: 'PAG-002',
                amountCents: 1500,
                paymentDate: '2026-10-30',
                method: 'cash',
            },
            {
                id: 'PAG-003',
                amountCents: 2000,
                paymentDate: '2026-10-31',
                method: 'transfer',
                reference: 'TR-008765',
            },
        ],
    },
    {
        id: 'PED-1004',
        customerName: 'Luis Fernández',
        totalCents: 7800,
        payments: [
            {
                id: 'PAG-004',
                amountCents: 7800,
                paymentDate: '2026-10-31',
                method: 'plin',
                reference: 'PL-009876',
            },
        ],
    },
    {
        id: 'PED-1005',
        customerName: 'Sofía Mendoza',
        totalCents: 18500,
        payments: [],
    },
];