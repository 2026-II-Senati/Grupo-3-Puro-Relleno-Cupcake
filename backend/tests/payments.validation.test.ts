import express from "express";
import request from "supertest";

import {
    describe,
    expect,
    it,
} from "vitest";

import {
    createPayment,
} from "../src/controllers/payments.controller";

import {
    errorHandler,
} from "../src/middleware/error.middleware";

/*
 * Creamos una aplicación Express aislada
 * para probar las validaciones del controlador.
 *
 * Todos los casos envían datos inválidos,
 * por lo que deben rechazarse antes de
 * ejecutar operaciones en PostgreSQL.
 */

function createTestApp() {
    const app = express();

    app.use(express.json());

    app.post(
        "/orders/:orderId/payments",
        createPayment
    );

    app.use(errorHandler);

    return app;
}

describe("Validaciones de pagos", () => {

    const app = createTestApp();

    const validPayment = {
        amount: 20,
        method: "cash",
    };

    it("rechaza un identificador de pedido inválido", async () => {
        const response = await request(app)
            .post("/orders/abc/payments")
            .send(validPayment);

        expect(response.status).toBe(400);
    });

    it("rechaza un cuerpo JSON que sea un arreglo", async () => {
        const response = await request(app)
            .post("/orders/1/payments")
            .send([]);

        expect(response.status).toBe(400);
    });

    it("rechaza un pago sin importe", async () => {
        const response = await request(app)
            .post("/orders/1/payments")
            .send({
                method: "cash",
            });

        expect(response.status).toBe(400);
    });

    it("rechaza un importe igual a cero", async () => {
        const response = await request(app)
            .post("/orders/1/payments")
            .send({
                ...validPayment,
                amount: 0,
            });

        expect(response.status).toBe(400);
    });

    it("rechaza un importe negativo", async () => {
        const response = await request(app)
            .post("/orders/1/payments")
            .send({
                ...validPayment,
                amount: -50,
            });

        expect(response.status).toBe(400);
    });

    it("rechaza importes con más de dos decimales", async () => {
        const response = await request(app)
            .post("/orders/1/payments")
            .send({
                ...validPayment,
                amount: 10.123,
            });

        expect(response.status).toBe(400);
    });

    it("rechaza un método de pago desconocido", async () => {
        const response = await request(app)
            .post("/orders/1/payments")
            .send({
                amount: 20,
                method: "tarjeta_inexistente",
            });

        expect(response.status).toBe(400);
    });

    it("rechaza una fecha con formato incorrecto", async () => {
        const response = await request(app)
            .post("/orders/1/payments")
            .send({
                ...validPayment,
                paymentDate: "fecha-invalida",
            });

        expect(response.status).toBe(400);
    });

    it("rechaza una fecha futura", async () => {
        const response = await request(app)
            .post("/orders/1/payments")
            .send({
                ...validPayment,
                paymentDate: "2100-01-01",
            });

        expect(response.status).toBe(400);
    });

    it("rechaza una referencia demasiado larga", async () => {
        const response = await request(app)
            .post("/orders/1/payments")
            .send({
                ...validPayment,
                reference: "A".repeat(101),
            });

        expect(response.status).toBe(400);
    });

});