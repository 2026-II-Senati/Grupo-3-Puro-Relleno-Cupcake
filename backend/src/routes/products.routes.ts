import {
    Router,
    type RequestHandler,
} from "express";

import {
    listProducts,
    getProductById,
    createProduct,
    updateProduct,
} from "../controllers/products.controller";

const router = Router();

const allowLocalDemoWrites: RequestHandler = (
    req,
    res,
    next
) => {
    const address =
        req.socket.remoteAddress ?? "";

    const isLoopback =
        address === "127.0.0.1" ||
        address === "::1" ||
        address === "::ffff:127.0.0.1";

    const isDevelopment =
        process.env.NODE_ENV === "development";

    const isEnabled =
        process.env.PRODUCTS_LOCAL_TEST_MODE === "true";

    if (
        !isLoopback ||
        !isDevelopment ||
        !isEnabled
    ) {
        res.status(503).json({
            message:
                "Registro y actualización de productos pendientes de autenticación JWT.",
        });
        return;
    }

    next();
};

router.get("/", listProducts);

router.get("/:id", getProductById);

router.post("/", allowLocalDemoWrites, createProduct);

router.patch(
    "/:id",
    allowLocalDemoWrites,
    updateProduct
);

export default router;