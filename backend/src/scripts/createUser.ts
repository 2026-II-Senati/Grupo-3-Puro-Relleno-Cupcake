import bcrypt from "bcryptjs";

import {
    sequelize,
    connectDatabase,
} from "../config/database";

import { Role } from "../models/Role";
import { User } from "../models/User";

const allowedRoles = [
    "customer_service",
    "production",
] as const;

type AllowedRole =
    (typeof allowedRoles)[number];

async function main(): Promise<void> {
    if (process.env.NODE_ENV !== "development") {
        throw new Error(
            "Este script solo puede ejecutarse en desarrollo."
        );
    }

    const fullName =
        process.env.BOOTSTRAP_USER_NAME?.trim() ?? "";

    const email =
        process.env.BOOTSTRAP_USER_EMAIL
            ?.trim()
            .toLowerCase() ?? "";

    const password =
        process.env.BOOTSTRAP_USER_PASSWORD ?? "";

    const roleName =
        process.env.BOOTSTRAP_USER_ROLE ?? "";

    if (
        fullName.length < 2 ||
        fullName.length > 150
    ) {
        throw new Error(
            "El nombre debe tener entre 2 y 150 caracteres."
        );
    }

    if (
        email.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
        throw new Error(
            "El correo electrónico no es válido."
        );
    }

    if (
        password.length < 12 ||
        Buffer.byteLength(password, "utf8") > 72
    ) {
        throw new Error(
            "La contraseña debe tener al menos 12 caracteres y máximo 72 bytes."
        );
    }

    if (
        !allowedRoles.includes(
            roleName as AllowedRole
        )
    ) {
        throw new Error(
            "El rol debe ser customer_service o production."
        );
    }

    await connectDatabase();

    const existingUser = await User.findOne({
        where: { email },
    });

    if (existingUser) {
        throw new Error(
            "Ya existe un usuario con ese correo."
        );
    }

    const roleDescriptions: Record<
        AllowedRole,
        string
    > = {
        customer_service:
            "Atención al cliente",

        production:
            "Personal de producción",
    };

    const selectedRole =
        roleName as AllowedRole;

    const [role] = await Role.findOrCreate({
        where: {
            name: selectedRole,
        },

        defaults: {
            name: selectedRole,
            description:
                roleDescriptions[selectedRole],
        },
    });

    const passwordHash = await bcrypt.hash(
        password,
        12
    );

    await User.create({
        fullName,
        email,
        passwordHash,
        roleId: role.id,
        isActive: true,
    });

    console.log(
        `Usuario creado correctamente con el rol ${selectedRole}.`
    );
}

main()
    .catch((error: unknown) => {
        console.error(
            error instanceof Error
                ? error.message
                : "No se pudo crear el usuario."
        );

        process.exitCode = 1;
    })
    .finally(async () => {
        await sequelize.close();
    });