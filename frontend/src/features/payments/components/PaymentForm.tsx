import { useState } from 'react';
import type { FormEvent } from 'react';

import Card from '../../../components/Card/Card';
import Input from '../../../components/Input/Input';
import Select from '../../../components/Select/Select';
import Button from '../../../components/Button/Button';

import {
    formatSoles,
    getLocalToday,
    paymentMethodLabels,
} from '../types/Payment';

import type {
    PaymentDraft,
    PaymentMethod,
} from '../types/Payment';

interface PaymentFormProps {
    balanceCents: number;
    onSimulatePayment: (payment: PaymentDraft) => void;
}

interface FormValues {
    amount: string;
    method: PaymentMethod | '';
    paymentDate: string;
    reference: string;
}

interface FormErrors {
    amount?: string;
    method?: string;
    paymentDate?: string;
}

function parseAmountToCents(value: string): number | null {
    const trimmed = value.trim();

    if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) {
        return null;
    }

    const [integerPart, decimalPart = ''] = trimmed.split('.');

    const cents =
        Number(integerPart) * 100 +
        Number(decimalPart.padEnd(2, '0'));

    return Number.isSafeInteger(cents) ? cents : null;
}

export default function PaymentForm({
                                        balanceCents,
                                        onSimulatePayment,
                                    }: PaymentFormProps) {
    const [values, setValues] = useState<FormValues>({
        amount: '',
        method: '',
        paymentDate: getLocalToday(),
        reference: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const today = getLocalToday();

    function updateField<K extends keyof FormValues>(
        field: K,
        value: FormValues[K]
    ) {
        setValues((previous) => ({
            ...previous,
            [field]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [field]: undefined,
        }));
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const nextErrors: FormErrors = {};
        const amountCents = parseAmountToCents(values.amount);

        if (!values.amount.trim()) {
            nextErrors.amount = 'Ingresa el importe del pago.';
        } else if (amountCents === null || amountCents <= 0) {
            nextErrors.amount =
                'Ingresa un importe válido mayor que cero, con máximo dos decimales.';
        } else if (amountCents > balanceCents) {
            nextErrors.amount =
                `El importe no puede superar el saldo de ${formatSoles(balanceCents)}.`;
        }

        if (!values.method) {
            nextErrors.method = 'Selecciona un medio de pago.';
        }

        if (!values.paymentDate) {
            nextErrors.paymentDate = 'Selecciona la fecha del pago.';
        } else if (values.paymentDate > today) {
            nextErrors.paymentDate =
                'La fecha del pago no puede ser futura.';
        }

        setErrors(nextErrors);

        if (
            Object.keys(nextErrors).length > 0 ||
            amountCents === null ||
            amountCents <= 0 ||
            amountCents > balanceCents ||
            !values.method
        ) {
            return;
        }

        onSimulatePayment({
            amountCents,
            method: values.method,
            paymentDate: values.paymentDate,
            reference: values.reference.trim() || undefined,
        });

        setValues({
            amount: '',
            method: '',
            paymentDate: getLocalToday(),
            reference: '',
        });

        setErrors({});
    }

    return (
        <Card
            heading="Preparar un nuevo pago"
            description="Formulario de demostración, sin registro real."
        >
            <form
                className="prc-payment-form"
                onSubmit={handleSubmit}
                noValidate
            >
                <Input
                    label="Importe del pago (S/)"
                    type="number"
                    min="0.01"
                    step="0.01"
                    max={(balanceCents / 100).toFixed(2)}
                    placeholder="Ejemplo: 60.00"
                    value={values.amount}
                    error={errors.amount}
                    required
                    onChange={(event) =>
                        updateField('amount', event.target.value)
                    }
                />

                <Select
                    label="Medio de pago"
                    value={values.method}
                    error={errors.method}
                    required
                    onChange={(event) =>
                        updateField(
                            'method',
                            event.target.value as PaymentMethod | ''
                        )
                    }
                >
                    <option value="">Selecciona un medio</option>

                    {(
                        Object.entries(paymentMethodLabels) as [
                            PaymentMethod,
                            string,
                        ][]
                    ).map(([value, label]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </Select>

                <Input
                    label="Número de operación o referencia (opcional)"
                    type="text"
                    placeholder="Ejemplo: YP-001234"
                    maxLength={100}
                    value={values.reference}
                    onChange={(event) =>
                        updateField('reference', event.target.value)
                    }
                />

                <Input
                    label="Fecha del pago"
                    type="date"
                    max={today}
                    value={values.paymentDate}
                    error={errors.paymentDate}
                    required
                    onChange={(event) =>
                        updateField('paymentDate', event.target.value)
                    }
                />

                <p className="prc-payment-form-note">
                    Saldo disponible para esta demostración:{' '}
                    <strong>{formatSoles(balanceCents)}</strong>.
                </p>

                <p className="prc-payment-form-note">
                    Al pulsar el botón se agregará un movimiento
                    ficticio a la pantalla. No se enviará dinero,
                    no se llamará a una API y no se guardará
                    ninguna transacción real.
                </p>

                <Button type="submit">
                    Registrar pago
                </Button>
            </form>
        </Card>
    );
}