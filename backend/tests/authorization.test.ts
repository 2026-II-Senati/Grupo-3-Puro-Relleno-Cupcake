import express from "express";

import request from "supertest";

import {
    describe,
    expect,
    it,
} from "vitest";

import {
    requirePermission,
    type Permission,
} from "../src/middleware/authorization.middleware";

import {
    errorHandler,
} from "../src/middleware/error.middleware";

function createTestApp(
    role: string | null,
    permission: Permission
) {
    const app = express();

    app.get(
        "/protected",
        (_req, res, next) => {

            if (role !== null) {
                res.locals.authUser = {
                    id: 1,
                    fullName: "Usuario de prueba",
                    email: "prueba@ejemplo.test",
                    roleId: 1,
                    role,
                };
            }

            next();
        },
        requirePermission(permission),
        (_req, res) => {
            res.status(200).json({
                message: "Acceso permitido",
            });
        }
    );

    app.use(errorHandler);

    return app;
}

describe("Autorización por roles", () => {

    it("permite al administrador modificar productos", async () => {
        const app = createTestApp(
            "admin",
            "products:write"
        );

        const response = await request(app)
            .get("/protected");

        expect(response.status).toBe(200);
    });

    it("impide al empleado modificar productos", async () => {
        const app = createTestApp(
            "customer_service",
            "products:write"
        );

        const response = await request(app)
            .get("/protected");

        expect(response.status).toBe(403);
    });

    it("permite al empleado consultar pedidos", async () => {
        const app = createTestApp(
            "customer_service",
            "orders:read"
        );

        const response = await request(app)
            .get("/protected");

        expect(response.status).toBe(200);
    });

    it("permite al empleado registrar pagos", async () => {
        const app = createTestApp(
            "customer_service",
            "payments:write"
        );

        const response = await request(app)
            .get("/protected");

        expect(response.status).toBe(200);
    });

    it("rechaza una solicitud sin usuario", async () => {
        const app = createTestApp(
            null,
            "orders:read"
        );

        const response = await request(app)
            .get("/protected");

        expect(response.status).toBe(401);
    });

    it("rechaza un rol desconocido", async () => {
        const app = createTestApp(
            "unknown",
            "orders:read"
        );

        const response = await request(app)
            .get("/protected");

        expect(response.status).toBe(403);
    });

    it("permite a Producción consultar pedidos", async () => {
        const app = createTestApp(
            "production",
            "orders:read"
        );

        const response = await request(app)
            .get("/protected");

        expect(response.status).toBe(200);
    });

    it("permite a Producción actualizar estados", async () => {
        const app = createTestApp(
            "production",
            "orders:status"
        );

        const response = await request(app)
            .get("/protected");

        expect(response.status).toBe(200);
    });

    it("impide a Producción registrar pedidos", async () => {
        const app = createTestApp(
            "production",
            "orders:write"
        );

        const response = await request(app)
            .get("/protected");

        expect(response.status).toBe(403);
    });

    it("impide a Producción registrar pagos", async () => {
        const app = createTestApp(
            "production",
            "payments:write"
        );

        const response = await request(app)
            .get("/protected");

        expect(response.status).toBe(403);
    });

    it("impide a Atención al cliente modificar productos", async () => {
        const app = createTestApp(
            "customer_service",
            "products:write"
        );

        const response = await request(app)
            .get("/protected");

        expect(response.status).toBe(403);
    });

});