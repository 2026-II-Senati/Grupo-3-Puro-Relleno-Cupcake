import type { RequestHandler } from "express";

import { sequelize } from "../config/database";
import { Order } from "../models/Order";
import {
    Payment,
    type PaymentMethod,
} from "../models/Payment";

const paymentMethods: PaymentMethod[] = [
    "cash",
    "bank_transfer",
    "yape",
    "plin",
];

class PaymentHttpError extends Error {
    constructor(
        public readonly statusCode: number,
        message: string
    ) {
        super(message);
        this.name = "PaymentHttpError";
    }
}

function parseOrderId(value: unknown): number | null {
    if (
        typeof value !== "string" ||
        !/^[1-9]\d*$/.test(value)
    ) {
        return null;
    }

    const id = Number(value);

    return Number.isSafeInteger(id) ? id : null;
}

function moneyToCents(
    value: string | number
): number {
    const text = String(value);

    if (!/^\d+(\.\d{1,2})?$/.test(text)) {
        throw new Error("Importe monetario inválido.");
    }

    const [whole, fraction = ""] = text.split(".");

    const cents =
        Number(whole) * 100 +
        Number(fraction.padEnd(2, "0"));

    if (!Number.isSafeInteger(cents)) {
        throw new Error("El importe supera el límite permitido.");
    }

    return cents;
}

function centsToMoney(cents: number): string {
    return (cents / 100).toFixed(2);
}

function todayInPeru(): string {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Lima",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date());

    const get = (type: string): string =>
        parts.find((part) => part.type === type)?.value ?? "";

    return `${get("year")}-${get("month")}-${get("day")}`;
}

function isValidDate(value: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    const date = new Date(`${value}T00:00:00.000Z`);

    return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value
    );
}

interface PaymentInput {
    amountCents: number;
    method: PaymentMethod;
    reference: string | null;
    paymentDate: string;
}

function validatePaymentInput(
    body: unknown
): PaymentInput {
    if (
        body === null ||
        typeof body !== "object" ||
        Array.isArray(body)
    ) {
        throw new PaymentHttpError(
            400,
            "El cuerpo debe ser un objeto JSON."
        );
    }

    const input = body as Record<string, unknown>;

    if (
        typeof input.amount !== "number" ||
        !Number.isFinite(input.amount)
    ) {
        throw new PaymentHttpError(
            400,
            "El importe debe ser un número válido."
        );
    }

    let amountCents: number;

    try {
        amountCents = moneyToCents(input.amount);
    } catch {
        throw new PaymentHttpError(
            400,
            "El importe debe tener como máximo dos decimales."
        );
    }

    if (
        amountCents <= 0 ||
        amountCents > 999999999999
    ) {
        throw new PaymentHttpError(
            400,
            "El importe del pago está fuera del rango permitido."
        );
    }

    if (
        typeof input.method !== "string" ||
        !paymentMethods.includes(
            input.method as PaymentMethod
        )
    ) {
        throw new PaymentHttpError(
            400,
            "El método de pago no es válido."
        );
    }

    let reference: string | null = null;

    if (
        input.reference !== undefined &&
        input.reference !== null &&
        input.reference !== ""
    ) {
        if (
            typeof input.reference !== "string" ||
            input.reference.trim().length > 100
        ) {
            throw new PaymentHttpError(
                400,
                "La referencia debe ser un texto de máximo 100 caracteres."
            );
        }

        reference = input.reference.trim() || null;
    }

    const today = todayInPeru();

    const paymentDate =
        input.paymentDate === undefined
            ? today
            : input.paymentDate;

    if (
        typeof paymentDate !== "string" ||
        !isValidDate(paymentDate)
    ) {
        throw new PaymentHttpError(
            400,
            "La fecha del pago debe tener el formato AAAA-MM-DD."
        );
    }

    if (paymentDate > today) {
        throw new PaymentHttpError(
            400,
            "La fecha del pago no puede ser futura."
        );
    }

    return {
        amountCents,
        method: input.method as PaymentMethod,
        reference,
        paymentDate,
    };
}

function paymentResponse(payment: Payment) {
    return {
        id: payment.id,
        orderId: payment.orderId,
        amount: Number(payment.amount),
        method: payment.method,
        reference: payment.reference,
        paymentDate: payment.paymentDate,
        createdAt: payment.createdAt,
    };
}

function handlePaymentError(
    error: unknown,
    res: Parameters<RequestHandler>[1],
    next: (error: unknown) => void
): void {
    if (error instanceof PaymentHttpError) {
        res.status(error.statusCode).json({
            message: error.message,
        });
        return;
    }

    next(error);
}

export const listPayments: RequestHandler = async (
    req,
    res,
    next
) => {
    const orderId = parseOrderId(req.params.orderId);

    if (orderId === null) {
        res.status(400).json({
            message: "El identificador del pedido es inválido.",
        });
        return;
    }

    try {
        const order = await Order.findByPk(orderId);

        if (!order) {
            res.status(404).json({
                message: "Pedido no encontrado.",
            });
            return;
        }

        const payments = await Payment.findAll({
            where: {
                orderId,
            },
            order: [
                ["paymentDate", "DESC"],
                ["id", "DESC"],
            ],
        });

        res.status(200).json(
            payments.map(paymentResponse)
        );

    } catch (error) {
        next(error);
    }
};

export const createPayment: RequestHandler = async (
    req,
    res,
    next
) => {
    const orderId = parseOrderId(req.params.orderId);

    if (orderId === null) {
        res.status(400).json({
            message: "El identificador del pedido es inválido.",
        });
        return;
    }

    let input: PaymentInput;

    try {
        input = validatePaymentInput(req.body);
    } catch (error) {
        handlePaymentError(error, res, next);
        return;
    }

    try {
        const paymentId = await sequelize.transaction(
            async (transaction) => {
                const order = await Order.findByPk(
                    orderId,
                    {
                        transaction,
                        lock: transaction.LOCK.UPDATE,
                    }
                );

                if (!order) {
                    throw new PaymentHttpError(
                        404,
                        "Pedido no encontrado."
                    );
                }

                const totalCents = moneyToCents(
                    order.totalAmount
                );

                const previousPayments =
                    await Payment.findAll({
                        where: {
                            orderId,
                        },
                        transaction,
                    });

                const paidCents =
                    previousPayments.reduce(
                        (sum, payment) =>
                            sum + moneyToCents(payment.amount),
                        0
                    );

                if (!Number.isSafeInteger(paidCents)) {
                    throw new PaymentHttpError(
                        400,
                        "El total de pagos supera el límite permitido."
                    );
                }

                const balanceCents =
                    totalCents - paidCents;

                if (balanceCents <= 0) {
                    throw new PaymentHttpError(
                        400,
                        "Este pedido ya está pagado."
                    );
                }

                if (input.amountCents > balanceCents) {
                    throw new PaymentHttpError(
                        400,
                        `El pago supera el saldo pendiente de S/ ${centsToMoney(balanceCents)}.`
                    );
                }

                const payment = await Payment.create(
                    {
                        orderId,
                        amount: centsToMoney(
                            input.amountCents
                        ),
                        method: input.method,
                        reference: input.reference,
                        paymentDate: input.paymentDate,
                    },
                    {
                        transaction,
                    }
                );

                return payment.id;
            }
        );

        const payment = await Payment.findByPk(
            paymentId
        );

        if (!payment) {
            throw new Error(
                "No se pudo recuperar el pago registrado."
            );
        }

        res.status(201).json(
            paymentResponse(payment)
        );

    } catch (error) {
        handlePaymentError(error, res, next);
    }
};