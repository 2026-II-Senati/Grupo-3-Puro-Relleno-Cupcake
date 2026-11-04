import { Router } from "express";

import {
    listOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
} from "../controllers/orders.controller";

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
    requirePermission("orders:read"),
    listOrders
);

router.post(
    "/",
    requirePermission("orders:write"),
    createOrder
);

router.get(
    "/:id",
    requirePermission("orders:read"),
    getOrderById
);

router.patch(
    "/:id/status",
    requirePermission("orders:status"),
    updateOrderStatus
);

export default router;