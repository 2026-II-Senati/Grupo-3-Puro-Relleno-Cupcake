import type { RequestHandler } from "express";

import jwt from "jsonwebtoken";

import { User } from "../models/User";
import { Role } from "../models/Role";

import { AppError } from "../errors/AppError";

import {
    getJwtSecret,
    JWT_ISSUER,
    JWT_AUDIENCE,
} from "../config/jwt.config";

export interface AuthenticatedUser {
    id: number;
    fullName: string;
    email: string;
    roleId: number;
    role: string;
}

export const requireAuth: RequestHandler = async (
    req,
    res,
    next
) => {
    try {
        const authorization =
            req.headers.authorization ?? "";

        const match =
            /^Bearer\s+(\S+)$/i.exec(authorization);

        if (!match) {
            throw new AppError(
                401,
                "Debes iniciar sesión."
            );
        }

        let decoded: jwt.JwtPayload | string;

        try {
            decoded = jwt.verify(
                match[1],
                getJwtSecret(),
                {
                    algorithms: ["HS256"],
                    issuer: JWT_ISSUER,
                    audience: JWT_AUDIENCE,
                }
            );
        } catch {
            throw new AppError(
                401,
                "El token es inválido o ha expirado."
            );
        }

        if (
            typeof decoded === "string" ||
            decoded.tokenType !== "access" ||
            typeof decoded.sub !== "string"
        ) {
            throw new AppError(
                401,
                "El token no es válido."
            );
        }

        const userId = Number(decoded.sub);

        if (
            !Number.isSafeInteger(userId) ||
            userId <= 0
        ) {
            throw new AppError(
                401,
                "El identificador del token es inválido."
            );
        }

        const user = await User.findByPk(userId);

        if (!user || !user.isActive) {
            throw new AppError(
                401,
                "El usuario no existe o está inactivo."
            );
        }

        const role = await Role.findByPk(user.roleId);

        if (!role) {
            throw new AppError(
                403,
                "El usuario no tiene un rol válido."
            );
        }

        const authenticatedUser: AuthenticatedUser = {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            roleId: user.roleId,
            role: role.name,
        };

        res.locals.authUser = authenticatedUser;

        next();

    } catch (error) {
        next(error);
    }
};