import { Router } from "express";

import {
    listProducts,
    getProductById,
    createProduct,
    updateProduct,
} from "../controllers/products.controller";

import {
    requireAuth,
} from "../middleware/auth.middleware";

import {
    requirePermission,
} from "../middleware/authorization.middleware";

const router = Router();

// Consultas públicas del catálogo.

router.get("/", listProducts);

router.get("/:id", getProductById);

// Solo el administrador puede modificar productos.

router.post(
    "/",
    requireAuth,
    requirePermission("products:write"),
    createProduct
);

router.patch(
    "/:id",
    requireAuth,
    requirePermission("products:write"),
    updateProduct
);

export default router;