import type { RequestHandler } from "express";

import {
    UniqueConstraintError,
    ValidationError,
} from "sequelize";

import { Client } from "../models/Client";

interface ClientInput {
    firstName: string;
    lastName: string;
    phone: string;
    email: string | null;
}

interface ValidationResult {
    data: ClientInput | null;
    errors: string[];
}

function validateClientInput(body: unknown): ValidationResult {
    const errors: string[] = [];

    if (
        body === null ||
        typeof body !== "object" ||
        Array.isArray(body)
    ) {
        return {
            data: null,
            errors: ["El cuerpo debe contener un objeto JSON."],
        };
    }

    const input = body as Record<string, unknown>;

    const firstName =
        typeof input.firstName === "string"
            ? input.firstName.trim()
            : "";

    const lastName =
        typeof input.lastName === "string"
            ? input.lastName.trim()
            : "";

    const phone =
        typeof input.phone === "string"
            ? input.phone.trim()
            : "";

    let email: string | null = null;

    if (firstName.length < 2 || firstName.length > 100) {
        errors.push(
            "Los nombres deben contener entre 2 y 100 caracteres."
        );
    }

    if (lastName.length < 2 || lastName.length > 100) {
        errors.push(
            "Los apellidos deben contener entre 2 y 100 caracteres."
        );
    }

    if (phone.length < 9 || phone.length > 20) {
        errors.push(
            "El teléfono debe contener entre 9 y 20 caracteres."
        );
    } else if (!/^\+?[\d\s()-]+$/.test(phone)) {
        errors.push(
            "El teléfono contiene caracteres no permitidos."
        );
    }

    if (
        input.email !== undefined &&
        input.email !== null &&
        input.email !== ""
    ) {
        if (typeof input.email !== "string") {
            errors.push("El correo electrónico debe ser un texto.");
        } else {
            const normalizedEmail = input.email.trim();

            if (normalizedEmail.length > 255) {
                errors.push(
                    "El correo electrónico es demasiado largo."
                );
            } else if (
                normalizedEmail &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                    normalizedEmail
                )
            ) {
                errors.push(
                    "El correo electrónico no tiene un formato válido."
                );
            } else {
                email = normalizedEmail || null;
            }
        }
    }

    if (errors.length > 0) {
        return {
            data: null,
            errors,
        };
    }

    return {
        data: {
            firstName,
            lastName,
            phone,
            email,
        },
        errors: [],
    };
}

function parseClientId(value: unknown): number | null {
    if (
        typeof value !== "string" ||
        !/^[1-9]\d*$/.test(value)
    ) {
        return null;
    }

    const id = Number(value);

    return Number.isSafeInteger(id) ? id : null;
}

function clientResponse(client: Client) {
    return {
        id: client.id,
        firstName: client.firstName,
        lastName: client.lastName,
        phone: client.phone,
        email: client.email,
    };
}

function respondWithDatabaseError(
    error: unknown,
    next: (error: unknown) => void,
    res: Parameters<RequestHandler>[1]
): void {
    if (error instanceof UniqueConstraintError) {
        res.status(400).json({
            message: "Ya existe un cliente con ese correo electrónico.",
        });
        return;
    }

    if (error instanceof ValidationError) {
        res.status(400).json({
            message: "Los datos del cliente no son válidos.",
            errors: error.errors.map((item) => item.message),
        });
        return;
    }

    // G3PRC-16 implementará el manejo centralizado
    // de los errores inesperados.
    next(error);
}

export const listClients: RequestHandler = async (
    _req,
    res,
    next
) => {
    try {
        const clients = await Client.findAll({
            order: [["id", "ASC"]],
        });

        res.status(200).json(
            clients.map(clientResponse)
        );
    } catch (error) {
        next(error);
    }
};

export const getClientById: RequestHandler = async (
    req,
    res,
    next
) => {
    const id = parseClientId(req.params.id);

    if (id === null) {
        res.status(400).json({
            message: "El identificador del cliente no es válido.",
        });
        return;
    }

    try {
        const client = await Client.findByPk(id);

        if (!client) {
            res.status(404).json({
                message: "Cliente no encontrado.",
            });
            return;
        }

        res.status(200).json(clientResponse(client));
    } catch (error) {
        next(error);
    }
};

export const createClient: RequestHandler = async (
    req,
    res,
    next
) => {
    const validation = validateClientInput(req.body);

    if (!validation.data) {
        res.status(400).json({
            message: "Los datos del cliente son inválidos.",
            errors: validation.errors,
        });
        return;
    }

    try {
        const client = await Client.create(validation.data);

        res.status(201).json(clientResponse(client));
    } catch (error) {
        respondWithDatabaseError(error, next, res);
    }
};

export const updateClient: RequestHandler = async (
    req,
    res,
    next
) => {
    const id = parseClientId(req.params.id);

    if (id === null) {
        res.status(400).json({
            message: "El identificador del cliente no es válido.",
        });
        return;
    }

    // El contrato actual utiliza ClientInput tanto
    // para POST como para PATCH.
    // Por eso solicitamos los campos obligatorios completos.

    const validation = validateClientInput(req.body);

    if (!validation.data) {
        res.status(400).json({
            message: "Los datos del cliente son inválidos.",
            errors: validation.errors,
        });
        return;
    }

    try {
        const client = await Client.findByPk(id);

        if (!client) {
            res.status(404).json({
                message: "Cliente no encontrado.",
            });
            return;
        }

        await client.update(validation.data);

        res.status(200).json(clientResponse(client));
    } catch (error) {
        respondWithDatabaseError(error, next, res);
    }
};