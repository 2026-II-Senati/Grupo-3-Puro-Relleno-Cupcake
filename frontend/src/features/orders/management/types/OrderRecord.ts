export type OrderStatus =
    | 'pending'
    | 'in_production'
    | 'ready'
    | 'delivered';

export type OrderDeliveryMode =
    | 'pickup'
    | 'delivery';

export interface OrderRecord {
    id: string;

    customerName: string;
    customerPhone: string;
    customerEmail?: string;

    productName: string;
    quantity: number;

    flavor: string;
    filling?: string;
    size: string;
    decoration: string;
    personalizedMessage?: string;

    notes?: string;

    deliveryMode: OrderDeliveryMode;
    deliveryAddress?: string;

    deliveryDate: string;
    deliveryTime: string;

    createdAt: string;

    status: OrderStatus;
}