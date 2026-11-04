import request from "supertest";

import {
    describe,
    expect,
    it,
} from "vitest";

import app from "../src/app";

describe("API REST - Puro Relleno Cupcake", () => {

    describe("Salud del servidor", () => {

        it("GET /api/health devuelve 200", async () => {
            const response = await request(app)
                .get("/api/health");

            expect(response.status).toBe(200);

            expect(response.body.status).toBe("ok");
        });

    });

    describe("Manejo de errores", () => {

        it("devuelve 404 cuando la ruta no existe", async () => {
            const response = await request(app)
                .get("/api/ruta-inexistente");

            expect(response.status).toBe(404);

            expect(response.body.message).toBe(
                "La ruta solicitada no existe."
            );
        });

        it("rechaza un JSON mal formado", async () => {
            const response = await request(app)
                .post("/api/v1/auth/login")
                .set("Content-Type", "application/json")
                .send("{");

            expect(response.status).toBe(400);
        });

        it("rechaza un arreglo JSON como cuerpo", async () => {
            const response = await request(app)
                .post("/api/v1/auth/login")
                .send([]);

            expect(response.status).toBe(400);
        });

    });

    describe("Autenticación", () => {

        it("rechaza un login sin credenciales", async () => {
            const response = await request(app)
                .post("/api/v1/auth/login")
                .send({});

            expect(response.status).toBe(400);
        });

        it("rechaza consultar la sesión sin token", async () => {
            const response = await request(app)
                .get("/api/v1/auth/me");

            expect(response.status).toBe(401);
        });

    });

    describe("Protección de clientes", () => {

        it("rechaza consultar clientes sin JWT", async () => {
            const response = await request(app)
                .get("/api/v1/clients");

            expect(response.status).toBe(401);
        });

    });

    describe("Protección de productos", () => {

        it("rechaza registrar productos sin JWT", async () => {
            const response = await request(app)
                .post("/api/v1/products")
                .send({});

            expect(response.status).toBe(401);
        });

    });

    describe("Protección de pedidos", () => {

        it("rechaza consultar pedidos sin JWT", async () => {
            const response = await request(app)
                .get("/api/v1/orders");

            expect(response.status).toBe(401);
        });

        it("rechaza registrar pedidos sin JWT", async () => {
            const response = await request(app)
                .post("/api/v1/orders")
                .send({});

            expect(response.status).toBe(401);
        });

    });

    describe("Protección de pagos", () => {

        it("rechaza consultar pagos sin JWT", async () => {
            const response = await request(app)
                .get("/api/v1/orders/1/payments");

            expect(response.status).toBe(401);
        });

        it("rechaza registrar pagos sin JWT", async () => {
            const response = await request(app)
                .post("/api/v1/orders/1/payments")
                .send({
                    amount: 10,
                    method: "cash",
                });

            expect(response.status).toBe(401);
        });

    });

});