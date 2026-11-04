import express, { type Express } from "express";

import healthRouter from "./routes/health.routes";

import clientsRouter from "./routes/clients.routes";

import productsRouter from "./routes/products.routes";

import ordersRouter from "./routes/orders.routes";

import {
    requireJsonBody,
} from "./middleware/requestValidation.middleware";

import {
    errorHandler,
    notFoundHandler,
} from "./middleware/error.middleware";

const app: Express = express();

app.use(express.json({
    limit: "100kb",
}));

app.use("/api/v1", requireJsonBody);

app.use("/api/health", healthRouter);

app.use("/api/v1/clients", clientsRouter);

app.use("/api/v1/products", productsRouter);

app.use("/api/v1/orders", ordersRouter);

// Manejar rutas inexistentes de la API.
app.use("/api", notFoundHandler);

// Manejo centralizado de errores.
// Debe ser el último middleware.
app.use(errorHandler);

export default app;