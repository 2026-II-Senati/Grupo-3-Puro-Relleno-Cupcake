import express, { type Express } from "express";

import healthRouter from "./routes/health.routes";

import clientsRouter from "./routes/clients.routes";

const app: Express = express();

app.use(express.json());

app.use("/api/health", healthRouter);

app.use("/api/v1/clients", clientsRouter);

export default app;