import type { RequestHandler } from "express";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../models/User";
import { Role } from "../models/Role";

import { AppError } from "../errors/AppError";

import {
    getJwtSecret,
    JWT_ISSUER,
    JWT_AUDIENCE,
} from "../config/jwt.config";

export const login: RequestHandler = async (
    req,
    res,
    next
) => {
    try {
        const { email, password } = req.body ?? {};

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            email.trim().length === 0 ||
            password.length === 0 ||
            email.length > 254 ||
            password.length > 1024
        ) {
            throw new AppError(
                400,
                "Debes ingresar un correo y una contraseña válidos."
            );
        }

        const normalizedEmail =
            email.trim().toLowerCase();

        // Unscoped permite consultar passwordHash,
        // excluido de las consultas normales.
        const user = await User.unscoped().findOne({
            where: {
                email: normalizedEmail,
            },
        });

        if (!user || !user.isActive) {
            throw new AppError(
                401,
                "Correo o contraseña incorrectos."
            );
        }

        const validPassword = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!validPassword) {
            throw new AppError(
                401,
                "Correo o contraseña incorrectos."
            );
        }

        const role = await Role.findByPk(user.roleId);

        if (!role) {
            throw new AppError(
                403,
                "El usuario no tiene un rol válido."
            );
        }

        const token = jwt.sign(
            {
                tokenType: "access",
            },
            getJwtSecret(),
            {
                algorithm: "HS256",
                subject: String(user.id),
                expiresIn: "2h",
                issuer: JWT_ISSUER,
                audience: JWT_AUDIENCE,
            }
        );

        res.status(200).json({
            token,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                roleId: user.roleId,
                role: role.name,
                isActive: user.isActive,
            },
        });

    } catch (error) {
        next(error);
    }
};