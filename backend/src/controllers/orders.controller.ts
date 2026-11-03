import type { RequestHandler } from "express";

import { sequelize } from "../config/database";
import { Client } from "../models/Client";
import { Product } from "../models/Product";
import { Order } from "../models/Order";
import { OrderDetail } from "../models/OrderDetail";

import type {
    DeliveryMethod,
    OrderStatus,
} from "../models/Order";

type JsonObject = Record<string, unknown>;

interface OrderItemInput {
    productId: number;
    quantity: number;
    flavor: string | null;
    filling: string | null;
    size: string | null;
    decoration: string | null;
    personalizedMessage: string | null;
    notes: string | null;
}

interface CreateOrderInput {
    clientId: number;
    deliveryDate: Date;
    deliveryMethod: DeliveryMethod;
    deliveryAddress: string | null;
    notes: string | null;
    details: OrderItemInput[];
}

class OrderHttpError extends Error {
    constructor(
        public readonly statusCode: number,
        message: string
    ) {
        super(message);
        this.name = "OrderHttpError";
    }
}

const validStatuses: OrderStatus[] = [
    "pending",
    "in_production",
    "ready",
    "delivered",
];

const orderIncludes = [
    {
        model: Client,
        as: "client",
        attributes: [
            "id",
            "firstName",
            "lastName",
            "phone",
            "email",
        ],
    },
    {
        model: OrderDetail,
        as: "details",
        include: [
            {
                model: Product,
                as: "product",
                attributes: [
                    "id",
                    "name",
                    "category",
                    "basePrice",
                ],
            },
        ],
    },
];

function isObject(value: unknown): value is JsonObject {
    return (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
    );
}

function positiveInteger(value: unknown): number | null {
    if (
        typeof value !== "number" ||
        !Number.isSafeInteger(value) ||
        value <= 0
    ) {
        return null;
    }

    return value;
}

function routeId(value: unknown): number | null {
    if (
        typeof value !== "string" ||
        !/^[1-9]\d*$/.test(value)
    ) {
        return null;
    }

    return positiveInteger(Number(value));
}

function optionalText(
    input: JsonObject,
    field: string,
    maxLength: number,
    errors: string[]
): string | null {
    const value = input[field];

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return null;
    }

    if (typeof value !== "string") {
        errors.push(`${field} debe ser un texto.`);
        return null;
    }

    const text = value.trim();

    if (text.length > maxLength) {
        errors.push(
            `${field} supera el máximo de ${maxLength} caracteres.`
        );
        return null;
    }

    return text || null;
}

function parseOrderInput(value: unknown): {
    data: CreateOrderInput | null;
    errors: string[];
} {
    const errors: string[] = [];

    if (!isObject(value)) {
        return {
            data: null,
            errors: ["El cuerpo debe ser un objeto JSON."],
        };
    }

    const clientId = positiveInteger(value.clientId);

    if (clientId === null) {
        errors.push("Selecciona un cliente válido.");
    }

    let deliveryDate: Date | null = null;

    if (
        typeof value.deliveryDate === "string" &&
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(Z|[+-]\d{2}:\d{2})$/.test(
            value.deliveryDate
        )
    ) {
        const parsed = new Date(value.deliveryDate);

        if (!Number.isNaN(parsed.getTime())) {
            deliveryDate = parsed;
        }
    }

    if (!deliveryDate) {
        errors.push(
            "deliveryDate debe ser una fecha y hora ISO 8601 con zona horaria."
        );
    }

    const deliveryMethod: DeliveryMethod =
        value.deliveryMethod === undefined
            ? "pickup"
            : value.deliveryMethod === "pickup" ||
            value.deliveryMethod === "delivery"
                ? value.deliveryMethod
                : "pickup";

    if (
        value.deliveryMethod !== undefined &&
        value.deliveryMethod !== "pickup" &&
        value.deliveryMethod !== "delivery"
    ) {
        errors.push("La modalidad de entrega no es válida.");
    }

    const deliveryAddress = optionalText(
        value,
        "deliveryAddress",
        500,
        errors
    );

    const notes = optionalText(
        value,
        "notes",
        2000,
        errors
    );

    if (
        deliveryMethod === "delivery" &&
        !deliveryAddress
    ) {
        errors.push(
            "La dirección es obligatoria para entrega a domicilio."
        );
    }

    const details: OrderItemInput[] = [];

    if (
        !Array.isArray(value.details) ||
        value.details.length === 0 ||
        value.details.length > 100
    ) {
        errors.push(
            "El pedido debe contener entre 1 y 100 detalles."
        );
    } else {
        value.details.forEach((item: unknown, index: number) => {
            if (!isObject(item)) {
                errors.push(
                    `El detalle ${index + 1} debe ser un objeto.`
                );
                return;
            }

            const productId = positiveInteger(item.productId);
            const quantity = positiveInteger(item.quantity);

            if (productId === null) {
                errors.push(
                    `Producto inválido en el detalle ${index + 1}.`
                );
            }

            if (quantity === null || quantity > 10000) {
                errors.push(
                    `Cantidad inválida en el detalle ${index + 1}.`
                );
            }

            const flavor = optionalText(
                item,
                "flavor",
                100,
                errors
            );

            const filling = optionalText(
                item,
                "filling",
                100,
                errors
            );

            const size = optionalText(
                item,
                "size",
                100,
                errors
            );

            const decoration = optionalText(
                item,
                "decoration",
                4000,
                errors
            );

            const personalizedMessage = optionalText(
                item,
                "personalizedMessage",
                200,
                errors
            );

            const itemNotes = optionalText(
                item,
                "notes",
                2000,
                errors
            );

            if (productId !== null && quantity !== null) {
                details.push({
                    productId,
                    quantity,
                    flavor,
                    filling,
                    size,
                    decoration,
                    personalizedMessage,
                    notes: itemNotes,
                });
            }
        });
    }

    if (errors.length > 0 || clientId === null || !deliveryDate) {
        return { data: null, errors };
    }

    return {
        data: {
            clientId,
            deliveryDate,
            deliveryMethod,
            deliveryAddress,
            notes,
            details,
        },
        errors: [],
    };
}

function priceToCents(value: string | number): number {
    const text = String(value);

    if (!/^\d+(\.\d{1,2})?$/.test(text)) {
        throw new Error("Precio de producto inválido en la base de datos.");
    }

    const [integerPart, fraction = ""] = text.split(".");

    const cents =
        Number(integerPart) * 100 +
        Number(fraction.padEnd(2, "0"));

    if (!Number.isSafeInteger(cents)) {
        throw new Error("El precio supera el rango permitido.");
    }

    return cents;
}

function money(cents: number): string {
    return (cents / 100).toFixed(2);
}

async function findOrder(id: number) {
    return Order.findByPk(id, {
        include: orderIncludes,
    });
}

export const listOrders: RequestHandler = async (
    _req,
    res,
    next
) => {
    try {
        const orders = await Order.findAll({
            include: orderIncludes,
            order: [["createdAt", "DESC"], ["id", "DESC"]],
        });

        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};

export const getOrderById: RequestHandler = async (
    req,
    res,
    next
) => {
    const id = routeId(req.params.id);

    if (id === null) {
        res.status(400).json({
            message: "Identificador de pedido inválido.",
        });
        return;
    }

    try {
        const order = await findOrder(id);

        if (!order) {
            res.status(404).json({
                message: "Pedido no encontrado.",
            });
            return;
        }

        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};

export const createOrder: RequestHandler = async (
    req,
    res,
    next
) => {
    const validation = parseOrderInput(req.body);

    if (!validation.data) {
        res.status(400).json({
            message: "Los datos del pedido son inválidos.",
            errors: validation.errors,
        });
        return;
    }

    const input = validation.data;

    try {
        const newOrderId = await sequelize.transaction(
            async (transaction) => {
                const client = await Client.findByPk(input.clientId, {
                    transaction,
                });

                if (!client) {
                    throw new OrderHttpError(
                        404,
                        "El cliente seleccionado no existe."
                    );
                }

                const preparedDetails = [];
                let totalCents = 0;

                for (const item of input.details) {
                    const product = await Product.findByPk(
                        item.productId,
                        { transaction }
                    );

                    if (!product) {
                        throw new OrderHttpError(
                            404,
                            `No existe el producto ${item.productId}.`
                        );
                    }

                    if (!product.isAvailable) {
                        throw new OrderHttpError(
                            400,
                            `El producto ${item.productId} no está disponible.`
                        );
                    }

                    const unitCents = priceToCents(
                        product.basePrice
                    );

                    const subtotalCents =
                        unitCents * item.quantity;

                    if (
                        !Number.isSafeInteger(subtotalCents) ||
                        totalCents + subtotalCents > 999999999999
                    ) {
                        throw new OrderHttpError(
                            400,
                            "El importe del pedido supera el máximo permitido."
                        );
                    }

                    totalCents += subtotalCents;

                    preparedDetails.push({
                        ...item,
                        unitPrice: money(unitCents),
                        subtotal: money(subtotalCents),
                    });
                }

                const order = await Order.create(
                    {
                        clientId: input.clientId,
                        deliveryDate: input.deliveryDate,
                        deliveryMethod: input.deliveryMethod,
                        deliveryAddress: input.deliveryAddress,
                        notes: input.notes,
                        totalAmount: money(totalCents),
                    },
                    { transaction }
                );

                for (const detail of preparedDetails) {
                    await OrderDetail.create(
                        {
                            orderId: order.id,
                            productId: detail.productId,
                            quantity: detail.quantity,
                            unitPrice: detail.unitPrice,
                            subtotal: detail.subtotal,
                            flavor: detail.flavor,
                            filling: detail.filling,
                            size: detail.size,
                            decoration: detail.decoration,
                            personalizedMessage:
                            detail.personalizedMessage,
                            notes: detail.notes,
                        },
                        { transaction }
                    );
                }

                return order.id;
            }
        );

        const createdOrder = await findOrder(newOrderId);

        res.status(201).json(createdOrder);
    } catch (error) {
        if (error instanceof OrderHttpError) {
            res.status(error.statusCode).json({
                message: error.message,
            });
            return;
        }

        next(error);
    }
};

export const updateOrderStatus: RequestHandler = async (
    req,
    res,
    next
) => {
    const id = routeId(req.params.id);

    if (id === null) {
        res.status(400).json({
            message: "Identificador de pedido inválido.",
        });
        return;
    }

    if (
        !isObject(req.body) ||
        typeof req.body.status !== "string" ||
        !validStatuses.includes(
            req.body.status as OrderStatus
        )
    ) {
        res.status(400).json({
            message: "Estado de pedido inválido.",
            allowedStatuses: validStatuses,
        });
        return;
    }

    try {
        const order = await Order.findByPk(id);

        if (!order) {
            res.status(404).json({
                message: "Pedido no encontrado.",
            });
            return;
        }

        await order.update({
            status: req.body.status as OrderStatus,
        });

        const updatedOrder = await findOrder(id);

        res.status(200).json(updatedOrder);
    } catch (error) {
        next(error);
    }
};