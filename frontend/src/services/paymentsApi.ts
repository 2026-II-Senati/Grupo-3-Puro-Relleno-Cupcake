import { authorizedFetch } from './authorizedFetch';

import type {
    PaymentDraft,
    PaymentMethod,
    PaymentMovement,
    PaymentOrder,
} from '../features/payments/types/Payment';

type ApiPaymentMethod =
    | 'cash'
    | 'bank_transfer'
    | 'yape'
    | 'plin';

interface ApiClient {
    id: number;
    firstName: string;
    lastName: string;
}

interface ApiOrder {
    id: number;
    clientId: number;
    totalAmount: string | number;
    client?: ApiClient | null;
}

interface ApiPayment {
    id: number;
    orderId: number;
    amount: string | number;
    method: ApiPaymentMethod;
    reference: string | null;
    paymentDate: string;
}

function moneyToCents(value: string | number): number {
    const text = String(value);

    const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(text);

    if (!match) {
        throw new Error(
            `Importe monetario inválido: ${text}`
        );
    }

    const cents =
        Number(match[1]) * 100 +
        Number((match[2] ?? '').padEnd(2, '0'));

    if (!Number.isSafeInteger(cents)) {
        throw new Error(
            'El importe supera el límite permitido.'
        );
    }

    return cents;
}

function frontendPaymentMethod(
    method: ApiPaymentMethod
): PaymentMethod {
    return method === 'bank_transfer'
        ? 'transfer'
        : method;
}

function backendPaymentMethod(
    method: PaymentMethod
): ApiPaymentMethod {
    return method === 'transfer'
        ? 'bank_transfer'
        : method;
}

function mapPayment(payment: ApiPayment): PaymentMovement {
    return {
        id: String(payment.id),
        amountCents: moneyToCents(payment.amount),
        paymentDate: payment.paymentDate.slice(0, 10),
        method: frontendPaymentMethod(payment.method),
        reference: payment.reference ?? undefined,
    };
}

async function readApiResponse<T>(
    response: Response
): Promise<T> {
    const data: unknown = await response.json().catch(
        () => null
    );

    if (!response.ok) {
        let message = `Error HTTP ${response.status}`;

        if (
            data !== null &&
            typeof data === 'object' &&
            'message' in data &&
            typeof data.message === 'string'
        ) {
            message = data.message;
        }

        throw new Error(message);
    }

    return data as T;
}

async function getPayments(
    orderId: string,
    signal?: AbortSignal
): Promise<PaymentMovement[]> {
    const response = await authorizedFetch(
        `/api/v1/orders/${encodeURIComponent(orderId)}/payments`,
        { signal }
    );

    const payments =
        await readApiResponse<ApiPayment[]>(response);

    if (!Array.isArray(payments)) {
        throw new Error(
            'El servidor no devolvió una lista de pagos.'
        );
    }

    return payments.map(mapPayment);
}

export async function getPaymentOrders(
    signal?: AbortSignal
): Promise<PaymentOrder[]> {
    const response = await authorizedFetch(
        '/api/v1/orders',
        { signal }
    );

    const orders =
        await readApiResponse<ApiOrder[]>(response);

    if (!Array.isArray(orders)) {
        throw new Error(
            'El servidor no devolvió una lista de pedidos.'
        );
    }

    /*
     * Algunos pedidos pueden venir sin los datos
     * completos del cliente. En ese caso consultamos
     * la API de clientes como respaldo.
     */
    let clients: ApiClient[] = [];

    if (orders.some((order) => !order.client)) {
        const clientsResponse = await authorizedFetch(
            '/api/v1/clients',
            { signal }
        );

        if (clientsResponse.ok) {
            const data: unknown =
                await clientsResponse.json();

            if (Array.isArray(data)) {
                clients = data as ApiClient[];
            }
        }
    }

    const clientById = new Map(
        clients.map((client) => [client.id, client])
    );

    /*
     * Consultamos los pagos en grupos de hasta
     * cinco solicitudes simultáneas.
     */
    const results: PaymentOrder[] =
        new Array(orders.length);

    let nextIndex = 0;

    async function worker(): Promise<void> {
        while (nextIndex < orders.length) {
            const index = nextIndex;
            nextIndex += 1;

            const order = orders[index];

            const client =
                order.client ??
                clientById.get(Number(order.clientId));

            const customerName = client
                ? `${client.firstName} ${client.lastName}`.trim()
                : `Cliente #${order.clientId}`;

            const orderId = String(order.id);

            const payments = await getPayments(
                orderId,
                signal
            );

            results[index] = {
                id: orderId,
                customerName,
                totalCents: moneyToCents(
                    order.totalAmount
                ),
                payments,
            };
        }
    }

    const numberOfWorkers = Math.min(
        5,
        orders.length
    );

    await Promise.all(
        Array.from(
            { length: numberOfWorkers },
            () => worker()
        )
    );

    return results;
}

export async function registerPayment(
    orderId: string,
    draft: PaymentDraft
): Promise<PaymentMovement> {
    const body = {
        amount: draft.amountCents / 100,
        method: backendPaymentMethod(draft.method),
        paymentDate: draft.paymentDate,
        reference: draft.reference ?? null,
    };

    const response = await authorizedFetch(
        `/api/v1/orders/${encodeURIComponent(orderId)}/payments`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        }
    );

    const savedPayment =
        await readApiResponse<ApiPayment>(response);

    return mapPayment(savedPayment);
}