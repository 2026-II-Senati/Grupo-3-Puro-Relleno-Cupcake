import type { OrderRecord } from '../types/OrderRecord';

export const sampleOrders: OrderRecord[] = [
    {
        id: 'PED-1001',

        customerName: 'María López',
        customerPhone: '999111222',
        customerEmail: 'maria@ejemplo.com',

        productName: 'Cupcake de vainilla',
        quantity: 12,

        flavor: 'Vainilla',
        filling: 'Manjar blanco',
        size: 'Individual',
        decoration: 'Decoración rosada con flores',
        personalizedMessage: 'Feliz cumpleaños',

        notes: 'Preparar en caja de regalo.',

        deliveryMode: 'pickup',

        deliveryDate: '2026-11-04',
        deliveryTime: '10:00',

        createdAt: '2026-11-01',

        status: 'pending',
    },

    {
        id: 'PED-1002',

        customerName: 'Carlos Ramírez',
        customerPhone: '988333444',

        productName: 'Cupcake de chocolate',
        quantity: 24,

        flavor: 'Chocolate',
        filling: 'Chocolate',
        size: 'Individual',
        decoration: 'Decoración temática de fútbol',

        notes: 'Colores azul y blanco.',

        deliveryMode: 'delivery',
        deliveryAddress: 'Av. Los Olivos 250, Lima',

        deliveryDate: '2026-11-05',
        deliveryTime: '15:30',

        createdAt: '2026-11-01',

        status: 'in_production',
    },

    {
        id: 'PED-1003',

        customerName: 'Ana Torres',
        customerPhone: '977555666',

        productName: 'Mini torta de chocolate',
        quantity: 1,

        flavor: 'Chocolate',
        size: 'Mediano',
        decoration: 'Cobertura de chocolate y fresas',
        personalizedMessage: 'Feliz aniversario',

        deliveryMode: 'pickup',

        deliveryDate: '2026-11-03',
        deliveryTime: '12:00',

        createdAt: '2026-10-31',

        status: 'ready',
    },

    {
        id: 'PED-1004',

        customerName: 'Luis Fernández',
        customerPhone: '966777888',

        productName: 'Box de cupcakes surtidos',
        quantity: 2,

        flavor: 'Surtido',
        size: 'Individual',
        decoration: 'Decoración de colores variados',

        notes: 'Entregar con tarjeta de regalo.',

        deliveryMode: 'delivery',
        deliveryAddress: 'Jr. Las Flores 145, Lima',

        deliveryDate: '2026-11-01',
        deliveryTime: '09:00',

        createdAt: '2026-10-29',

        status: 'delivered',
    },

    {
        id: 'PED-1005',

        customerName: 'Sofía Mendoza',
        customerPhone: '955999111',

        productName: 'Cupcake Red Velvet',
        quantity: 18,

        flavor: 'Red Velvet',
        filling: 'Manjar blanco',
        size: 'Individual',
        decoration: 'Temática de cumpleaños infantil',
        personalizedMessage: 'Felices 8 años',

        deliveryMode: 'pickup',

        deliveryDate: '2026-11-07',
        deliveryTime: '16:00',

        createdAt: '2026-11-01',

        status: 'pending',
    },
];