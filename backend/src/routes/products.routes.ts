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

import {
    getProductImage,
    parseProductImage,
    uploadProductImage,
} from "../controllers/productImages.controller";

const router = Router();

router.get(
    "/:id/image",
    getProductImage
);

router.post(
    "/:id/image",
    requireAuth,
    requirePermission("products:write"),
    parseProductImage,
    uploadProductImage
);

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