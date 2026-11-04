import type {
    OrderFormValues,
} from '../features/orders/types/OrderForm';

import { authorizedFetch } from './authorizedFetch';

interface ApiClient {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    email: string | null;
}

export interface CreatedOrder {
    id: number;
    status: string;
    totalAmount: string | number;
}

async function apiRequest<T>(
    url: string,
    options?: RequestInit
): Promise<T> {
    const response = await authorizedFetch(url, options);

    const result: unknown = await response.json().catch(() => null);

    if (!response.ok) {
        let message = `Error HTTP ${response.status}`;

        if (
            result !== null &&
            typeof result === 'object' &&
            'message' in result &&
            typeof result.message === 'string'
        ) {
            message = result.message;
        }

        throw new Error(message);
    }

    return result as T;
}

function normalize(value: string): string {
    return value.trim().toLocaleLowerCase('es-PE');
}

async function findOrCreateClient(
    values: OrderFormValues
): Promise<number> {
    const email = normalize(values.email);

    if (email) {
        const clients = await apiRequest<ApiClient[]>(
            '/api/v1/clients'
        );

        const existing = clients.find(
            (client) => normalize(client.email ?? '') === email
        );

        if (existing) {
            const sameFirstName =
                normalize(existing.firstName) ===
                normalize(values.customerFirstName);

            const sameLastName =
                normalize(existing.lastName) ===
                normalize(values.customerLastName);

            const samePhone =
                existing.phone.trim() === values.phone.trim();

            if (
                !sameFirstName ||
                !sameLastName ||
                !samePhone
            ) {
                throw new Error(
                    'Este correo ya pertenece a un cliente con datos diferentes. ' +
                    'Revisa los datos antes de registrar el pedido.'
                );
            }

            return existing.id;
        }
    }

    const created = await apiRequest<ApiClient>(
        '/api/v1/clients',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName: values.customerFirstName.trim(),
                lastName: values.customerLastName.trim(),
                phone: values.phone.trim(),
                email: email || null,
            }),
        }
    );

    return created.id;
}

export async function submitOrderForm(
    values: OrderFormValues
): Promise<CreatedOrder> {
    const productId = Number(values.productId);
    const quantity = Number(values.quantity);

    if (
        !Number.isSafeInteger(productId) ||
        productId <= 0 ||
        !Number.isSafeInteger(quantity) ||
        quantity <= 0
    ) {
        throw new Error(
            'Selecciona un producto y una cantidad válidos.'
        );
    }

    const localDeliveryDate = new Date(
        `${values.deliveryDate}T${values.deliveryTime}:00`
    );

    if (Number.isNaN(localDeliveryDate.getTime())) {
        throw new Error(
            'Selecciona una fecha y una hora de entrega válidas.'
        );
    }

    const clientId = await findOrCreateClient(values);

    return apiRequest<CreatedOrder>(
        '/api/v1/orders',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                clientId,
                deliveryDate: localDeliveryDate.toISOString().replace(/\.\d{3}Z$/, 'Z'),
                deliveryMethod: values.deliveryMode,

                deliveryAddress:
                    values.deliveryMode === 'delivery'
                        ? values.deliveryAddress.trim()
                        : null,

                notes: values.notes.trim() || null,

                details: [
                    {
                        productId,
                        quantity,
                        flavor: values.flavor,
                        filling: values.filling || null,
                        size: values.size,
                        decoration: values.decoration.trim(),

                        personalizedMessage:
                            values.personalizedMessage.trim() || null,

                        notes: values.notes.trim() || null,
                    },
                ],
            }),
        }
    );
}