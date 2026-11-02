import type {
    OrderFormErrors,
    OrderFormValues,
} from '../types/OrderForm';

export function validateOrderForm(
    values: OrderFormValues
): OrderFormErrors {
    const errors: OrderFormErrors = {};

    // Datos del cliente

    if (!values.customerFirstName.trim()) {
        errors.customerFirstName =
            'Ingresa los nombres del cliente.';
    }

    if (!values.customerLastName.trim()) {
        errors.customerLastName =
            'Ingresa los apellidos del cliente.';
    }

    const phoneDigits = values.phone.replace(/\D/g, '');

    if (!values.phone.trim()) {
        errors.phone = 'Ingresa un número de teléfono.';
    } else if (
        phoneDigits.length < 7 ||
        phoneDigits.length > 15
    ) {
        errors.phone =
            'Ingresa un número de teléfono válido.';
    }

    // Correo electrónico opcional

    if (
        values.email.trim() &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())
    ) {
        errors.email =
            'Ingresa un correo electrónico válido.';
    }

    // Producto y cantidad

    if (!values.productId) {
        errors.productId = 'Selecciona un producto.';
    }

    const quantity = Number(values.quantity);

    if (
        !/^\d+$/.test(values.quantity) ||
        !Number.isSafeInteger(quantity) ||
        quantity <= 0
    ) {
        errors.quantity =
            'La cantidad debe ser un número entero mayor que cero.';
    }

    // Personalización

    if (!values.flavor) {
        errors.flavor = 'Selecciona un sabor.';
    }

    if (!values.size) {
        errors.size = 'Selecciona un tamaño.';
    }

    if (!values.decoration.trim()) {
        errors.decoration =
            'Describe la decoración solicitada.';
    }

    // Modalidad de entrega

    if (
        values.deliveryMode === 'delivery' &&
        !values.deliveryAddress.trim()
    ) {
        errors.deliveryAddress =
            'Ingresa la dirección de entrega.';
    }

    // Fecha de entrega

    const now = new Date();

    const today = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, '0'),
        String(now.getDate()).padStart(2, '0'),
    ].join('-');

    if (!values.deliveryDate) {
        errors.deliveryDate =
            'Selecciona una fecha de entrega.';
    } else if (values.deliveryDate < today) {
        errors.deliveryDate =
            'La fecha de entrega no puede ser anterior a hoy.';
    }

    // Hora de entrega

    if (!values.deliveryTime) {
        errors.deliveryTime =
            'Selecciona un horario de entrega.';
    }

    return errors;
}