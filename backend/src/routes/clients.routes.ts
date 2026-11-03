import {
    Router,
    type RequestHandler,
} from "express";

import {
    listClients,
    getClientById,
    createClient,
    updateClient,
} from "../controllers/clients.controller";

const router = Router();

/*
 * Protección temporal para pruebas locales.
 *
 * G3PRC-14 exige autenticación JWT.
 *
 * Mientras G3PRC-18 no esté implementada,
 * no expondremos datos de clientes libremente.
 *
 * Las pruebas locales requieren habilitación
 * expresa mediante CLIENTS_LOCAL_TEST_MODE=true.
 *
 * Este middleware debe reemplazarse por la
 * autenticación JWT antes de utilizar la API
 * fuera del entorno local de desarrollo.
 */

const localDevelopmentOnly: RequestHandler = (
    req,
    res,
    next
) => {
    const remoteAddress = req.socket.remoteAddress ?? "";

    const isLocal =
        remoteAddress === "127.0.0.1" ||
        remoteAddress === "::1" ||
        remoteAddress === "::ffff:127.0.0.1";

    const isDevelopment =
        process.env.NODE_ENV !== "production";

    const isExplicitlyEnabled =
        process.env.CLIENTS_LOCAL_TEST_MODE === "true";

    if (
        !isLocal ||
        !isDevelopment ||
        !isExplicitlyEnabled
    ) {
        res.status(503).json({
            message:
                "API protegida: autenticación JWT pendiente de integración.",
        });
        return;
    }

    next();
};

router.use(localDevelopmentOnly);

router.get("/", listClients);

router.post("/", createClient);

router.get("/:id", getClientById);

router.patch("/:id", updateClient);

export default router;