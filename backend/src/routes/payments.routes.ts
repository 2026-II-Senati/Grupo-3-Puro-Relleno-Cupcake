import {
    Router,
    type RequestHandler,
} from "express";

import {
    listPayments,
    createPayment,
} from "../controllers/payments.controller";

const router = Router();

/*
 * Protección provisional para pruebas locales.
 *
 * La autenticación definitiva dependerá
 * de G3PRC-18 y G3PRC-26.
 */

const allowLocalPaymentsTesting: RequestHandler = (
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
        process.env.PAYMENTS_LOCAL_TEST_MODE === "true";

    if (!isLocal || !isDevelopment || !isEnabled) {
        res.status(503).json({
            message:
                "La API de pagos requiere autenticación. Solo están habilitadas las pruebas locales.",
        });
        return;
    }

    next();
};

router.use(allowLocalPaymentsTesting);

router.get(
    "/:orderId/payments",
    listPayments
);

router.post(
    "/:orderId/payments",
    createPayment
);

export default router;