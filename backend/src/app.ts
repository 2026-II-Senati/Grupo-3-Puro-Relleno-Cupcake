import express, { type Express } from "express";

import healthRouter from "./routes/health.routes";

import clientsRouter from "./routes/clients.routes";

import productsRouter from "./routes/products.routes";

const app: Express = express();

app.use(express.json());

app.use("/api/health", healthRouter);

app.use("/api/v1/clients", clientsRouter);

app.use("/api/v1/products", productsRouter);

export default app;