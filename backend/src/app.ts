import express, { type Express } from "express";
import healthRouter from "./routes/health.routes";

const app: Express = express();

app.use(express.json());
app.use("/api/health", healthRouter);

export default app;