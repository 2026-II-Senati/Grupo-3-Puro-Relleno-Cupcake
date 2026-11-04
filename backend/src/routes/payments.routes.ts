import { Router } from "express";

import {
    listPayments,
    createPayment,
} from "../controllers/payments.controller";

import {
    requireAuth,
} from "../middleware/auth.middleware";

import {
    requirePermission,
} from "../middleware/authorization.middleware";

const router = Router();

router.use(requireAuth);

router.get(
    "/:orderId/payments",
    requirePermission("payments:read"),
    listPayments
);

router.post(
    "/:orderId/payments",
    requirePermission("payments:write"),
    createPayment
);

export default router;