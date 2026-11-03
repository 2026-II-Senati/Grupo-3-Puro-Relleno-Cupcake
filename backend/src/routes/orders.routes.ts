import {
    Router,
    type RequestHandler,
} from "express";

import {
    listOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
} from "../controllers/orders.controller";

const router = Router();

/*
 * Habilitación temporal para pruebas locales.
 *
 * G3PRC-14 establece autenticación JWT.
 * Cuando G3PRC-18 esté implementada, esta
 * protección provisional deberá sustituirse
 * por el middleware real de autenticación.
 */

const allowLocalOrderTesting: RequestHandler = (
    req,
    res,
    next
) => {
    const address = req.socket.remoteAddress ?? "";

    const isLocal =
        address === "127.0.0.1" ||
        address === "::1" ||
        address === "::ffff:127.0.0.1";

    const isDevelopment =
        process.env.NODE_ENV === "development";

    const isEnabled =
        process.env.ORDERS_LOCAL_TEST_MODE === "true";

    if (!isLocal || !isDevelopment || !isEnabled) {
        res.status(503).json({
            message:
                "La API de pedidos requiere autenticación JWT. Solo están habilitadas las pruebas locales.",
        });
        return;
    }

    next();
};

router.use(allowLocalOrderTesting);

router.get("/", listOrders);

router.post("/", createOrder);

router.get("/:id", getOrderById);

router.patch("/:id/status", updateOrderStatus);

export default router;