import { Router } from "express";

import { rateLimit } from "express-rate-limit";

import { login } from "../controllers/auth.controller";

import {
    requireAuth,
    type AuthenticatedUser,
} from "../middleware/auth.middleware";

const router = Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 8,
    standardHeaders: "draft-7",
    legacyHeaders: false,

    message: {
        message:
            "Demasiados intentos de inicio de sesión. Inténtalo más tarde.",
    },
});

// Endpoint público para iniciar sesión.
router.post(
    "/login",
    loginLimiter,
    login
);

// Endpoint protegido para comprobar la sesión.
router.get(
    "/me",
    requireAuth,
    (_req, res) => {
        const user =
            res.locals.authUser as AuthenticatedUser;

        res.status(200).json({
            user,
        });
    }
);

export default router;