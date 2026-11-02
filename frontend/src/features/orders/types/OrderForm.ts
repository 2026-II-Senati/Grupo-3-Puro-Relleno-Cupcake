export type DeliveryMode = 'pickup' | 'delivery';

export interface OrderFormValues {
    customerFirstName: string;
    customerLastName: string;
    phone: string;
    email: string;

    productId: string;
    quantity: string;

    flavor: string;
    filling: string;
    size: string;
    decoration: string;

    personalizedMessage: string;
    notes: string;

    deliveryMode: DeliveryMode;
    deliveryAddress: string;
    deliveryDate: string;
    deliveryTime: string;
}

export type OrderFormErrors = Partial<
    Record<keyof OrderFormValues, string>
>;

export const initialOrderFormValues: OrderFormValues = {
    customerFirstName: '',
    customerLastName: '',
    phone: '',
    email: '',

    productId: '',
    quantity: '1',

    flavor: '',
    filling: '',
    size: '',
    decoration: '',

    personalizedMessage: '',
    notes: '',

    deliveryMode: 'pickup',
    deliveryAddress: '',
    deliveryDate: '',
    deliveryTime: '',
};