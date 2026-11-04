import type {
    RequestHandler,
} from "express";

import { AppError } from "../errors/AppError";

/*
 * Valida la estructura general de las
 * solicitudes que modifican información.
 *
 * Las validaciones específicas de clientes,
 * productos, pedidos y pagos siguen
 * perteneciendo a sus controladores.
 */

export const requireJsonBody: RequestHandler = (
    req,
    _res,
    next
) => {
    const methodsRequiringBody = [
        "POST",
        "PUT",
        "PATCH",
    ];

    if (
        !methodsRequiringBody.includes(req.method)
    ) {
        next();
        return;
    }

    // Las API actuales utilizan cuerpos JSON.
    if (!req.is("application/json")) {
        next(
            new AppError(
                415,
                "La solicitud debe utilizar Content-Type: application/json."
            )
        );

        return;
    }

    if (
        req.body === null ||
        typeof req.body !== "object" ||
        Array.isArray(req.body)
    ) {
        next(
            new AppError(
                400,
                "El cuerpo debe contener un objeto JSON válido."
            )
        );

        return;
    }

    next();
};