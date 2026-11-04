import type {
    OrderRecord,
    OrderStatus,
} from '../features/orders/management/types/OrderRecord';

import { authorizedFetch } from './authorizedFetch';

interface ApiClient {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    email: string | null;
}

interface ApiProduct {
    id: number;
    name: string;
}

interface ApiOrderDetail {
    id: number;
    productId: number;
    quantity: number;

    flavor: string | null;
    filling: string | null;
    size: string | null;
    decoration: string | null;
    personalizedMessage: string | null;
    notes: string | null;

    product?: ApiProduct | null;
}

interface ApiOrder {
    id: number;
    status: OrderStatus;

    deliveryDate: string;
    deliveryMethod: 'pickup' | 'delivery';
    deliveryAddress: string | null;

    notes: string | null;
    createdAt: string;

    client?: ApiClient | null;
    details?: ApiOrderDetail[];
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
});

function formatDateTime(value: string): {
    date: string;
    time: string;
} {
    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
        return {
            date: '',
            time: '',
        };
    }

    const parts = dateFormatter.formatToParts(parsedDate);

    const getPart = (type: string): string =>
        parts.find((part) => part.type === type)?.value ?? '';

    return {
        date:
            `${getPart('year')}-${getPart('month')}-${getPart('day')}`,

        time:
            `${getPart('hour')}:${getPart('minute')}`,
    };
}

function convertOrder(order: ApiOrder): OrderRecord {
    const details = order.details ?? [];

    const delivery = formatDateTime(order.deliveryDate);
    const creation = formatDateTime(order.createdAt);

    const joinDetails = (
        selectValue: (detail: ApiOrderDetail) => string | null
    ): string => {
        return details
            .map(selectValue)
            .filter((value): value is string =>
                typeof value === 'string' &&
                value.trim().length > 0
            )
            .join(' / ');
    };

    const productName = details
        .map((detail) =>
            detail.product?.name ??
            `Producto ${detail.productId}`
        )
        .join(' / ');

    const totalQuantity = details.reduce(
        (total, detail) => total + detail.quantity,
        0
    );

    const customerName = order.client
        ? `${order.client.firstName} ${order.client.lastName}`
        : 'Cliente no disponible';

    const orderNotes = [
        order.notes,
        ...details.map((detail) => detail.notes),
    ]
        .filter((value): value is string =>
            typeof value === 'string' &&
            value.trim().length > 0
        )
        .join(' / ');

    return {
        id: String(order.id),

        customerName,
        customerPhone: order.client?.phone ?? '',
        customerEmail: order.client?.email ?? undefined,

        productName: productName || 'Sin productos',
        quantity: totalQuantity,

        flavor: joinDetails((detail) => detail.flavor),
        filling: joinDetails((detail) => detail.filling),
        size: joinDetails((detail) => detail.size),
        decoration: joinDetails((detail) => detail.decoration),

        personalizedMessage: joinDetails(
            (detail) => detail.personalizedMessage
        ),

        notes: orderNotes || undefined,

        deliveryMode: order.deliveryMethod,
        deliveryAddress: order.deliveryAddress ?? undefined,

        deliveryDate: delivery.date,
        deliveryTime: delivery.time,

        createdAt: creation.date,

        status: order.status,
    };
}

async function getErrorMessage(
    response: Response
): Promise<string> {
    const data: unknown = await response.json().catch(
        () => null
    );

    if (
        data !== null &&
        typeof data === 'object' &&
        'message' in data &&
        typeof data.message === 'string'
    ) {
        return data.message;
    }

    return `Error del servidor: ${response.status}`;
}

export async function getOrders(
    signal?: AbortSignal
): Promise<OrderRecord[]> {
    const response = await authorizedFetch('/api/v1/orders', {
        method: 'GET',
        signal,
    });

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }

    const data: unknown = await response.json();

    if (!Array.isArray(data)) {
        throw new Error(
            'La API devolvió un listado de pedidos inválido.'
        );
    }

    return (data as ApiOrder[]).map(convertOrder);
}

export async function updateOrderStatus(
    orderId: string,
    status: OrderStatus
): Promise<void> {
    const response = await authorizedFetch(
        `/api/v1/orders/${encodeURIComponent(orderId)}/status`,
        {
            method: 'PATCH',

            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                status,
            }),
        }
    );

    if (!response.ok) {
        throw new Error(await getErrorMessage(response));
    }
}