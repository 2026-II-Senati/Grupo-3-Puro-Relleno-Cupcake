import { Router } from "express";

import {
    listClients,
    getClientById,
    createClient,
    updateClient,
} from "../controllers/clients.controller";

import {
    requireAuth,
} from "../middleware/auth.middleware";

import {
    requirePermission,
} from "../middleware/authorization.middleware";

const router = Router();

router.use(requireAuth);

router.get(
    "/",
    requirePermission("clients:read"),
    listClients
);

router.post(
    "/",
    requirePermission("clients:write"),
    createClient
);

router.get(
    "/:id",
    requirePermission("clients:read"),
    getClientById
);

router.patch(
    "/:id",
    requirePermission("clients:write"),
    updateClient
);

export default router;