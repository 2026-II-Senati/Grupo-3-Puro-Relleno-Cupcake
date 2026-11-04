import type {
    ErrorRequestHandler,
    RequestHandler,
} from "express";

import {
    ForeignKeyConstraintError,
    UniqueConstraintError,
    ValidationError,
} from "sequelize";

import { AppError } from "../errors/AppError";

/*
 * Responde cuando no existe una ruta de la API.
 */
export const notFoundHandler: RequestHandler = (
    _req,
    _res,
    next
) => {
    next(
        new AppError(
            404,
            "La ruta solicitada no existe."
        )
    );
};

/*
 * Manejo centralizado de errores.
 *
 * Debe registrarse después de todas
 * las rutas de Express.
 */
export const errorHandler: ErrorRequestHandler = (
    error: unknown,
    _req,
    res,
    next
) => {
    if (res.headersSent) {
        next(error);
        return;
    }

    // Errores controlados de nuestra aplicación.
    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            message: error.message,
            ...(error.errors
                ? { errors: error.errors }
                : {}),
        });

        return;
    }

    // JSON mal formado.
    if (
        typeof error === "object" &&
        error !== null &&
        "type" in error &&
        error.type === "entity.parse.failed"
    ) {
        res.status(400).json({
            message: "El JSON enviado no es válido.",
        });

        return;
    }

    // Cuerpo demasiado grande.
    if (
        typeof error === "object" &&
        error !== null &&
        "type" in error &&
        error.type === "entity.too.large"
    ) {
        res.status(413).json({
            message:
                "La solicitud supera el tamaño permitido.",
        });

        return;
    }

    // Registro duplicado en PostgreSQL.
    if (error instanceof UniqueConstraintError) {
        res.status(409).json({
            message:
                "Ya existe un registro con esos datos.",
        });

        return;
    }

    // Relación inválida entre tablas.
    if (error instanceof ForeignKeyConstraintError) {
        res.status(409).json({
            message:
                "La operación incumple una relación de la base de datos.",
        });

        return;
    }

    // Validaciones de Sequelize.
    if (error instanceof ValidationError) {
        res.status(400).json({
            message:
                "Los datos enviados no son válidos.",

            errors: error.errors.map(
                (item) => item.message
            ),
        });

        return;
    }

    // Errores inesperados.
    console.error(
        "Error interno del backend:",
        error
    );

    res.status(500).json({
        message:
            "Ocurrió un error interno del servidor.",
    });
};