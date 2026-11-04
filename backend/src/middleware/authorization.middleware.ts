import type { RequestHandler } from "express";

import { AppError } from "../errors/AppError";

import type {
    AuthenticatedUser,
} from "./auth.middleware";

export type Permission =
    | "clients:read"
    | "clients:write"
    | "products:write"
    | "orders:read"
    | "orders:write"
    | "orders:status"
    | "payments:read"
    | "payments:write";

const permissionsByRole: Record<
    string,
    readonly Permission[]
> = {
    admin: [
        "clients:read",
        "clients:write",
        "products:write",
        "orders:read",
        "orders:write",
        "orders:status",
        "payments:read",
        "payments:write",
    ],

    customer_service: [
        "clients:read",
        "clients:write",
        "orders:read",
        "orders:write",
        "payments:read",
        "payments:write",
    ],

    production: [
        "orders:read",
        "orders:status",
    ],
};

export function requirePermission(
    permission: Permission
): RequestHandler {
    return (_req, res, next) => {
        const user = res.locals.authUser as
            AuthenticatedUser | undefined;

        if (!user) {
            next(
                new AppError(
                    401,
                    "Debes iniciar sesión."
                )
            );
            return;
        }

        const roleName =
            user.role.trim().toLowerCase();

        const permissions =
            permissionsByRole[roleName] ?? [];

        if (!permissions.includes(permission)) {
            next(
                new AppError(
                    403,
                    "No tienes permisos para realizar esta operación."
                )
            );
            return;
        }

        next();
    };
}