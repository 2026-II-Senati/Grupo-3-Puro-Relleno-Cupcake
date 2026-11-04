import express, { type Express } from "express";

import healthRouter from "./routes/health.routes";

import clientsRouter from "./routes/clients.routes";

import productsRouter from "./routes/products.routes";

import ordersRouter from "./routes/orders.routes";

import paymentsRouter from "./routes/payments.routes";

const app: Express = express();

app.use(express.json());

app.use("/api/health", healthRouter);

app.use("/api/v1/clients", clientsRouter);

app.use("/api/v1/products", productsRouter);

app.use("/api/v1/orders", ordersRouter);

app.use("/api/v1/orders", paymentsRouter);

export default app;