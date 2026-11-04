import bcrypt from "bcryptjs";

import {
    sequelize,
    connectDatabase,
} from "../config/database";

import { Role } from "../models/Role";
import { User } from "../models/User";

async function main(): Promise<void> {
    if (process.env.NODE_ENV !== "development") {
        throw new Error(
            "Este script solamente puede ejecutarse en desarrollo."
        );
    }

    const fullName =
        process.env.BOOTSTRAP_ADMIN_NAME?.trim() ?? "";

    const email =
        process.env.BOOTSTRAP_ADMIN_EMAIL
            ?.trim()
            .toLowerCase() ?? "";

    const password =
        process.env.BOOTSTRAP_ADMIN_PASSWORD ?? "";

    if (fullName.length < 2 || fullName.length > 150) {
        throw new Error(
            "El nombre del administrador no es válido."
        );
    }

    if (
        email.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
        throw new Error(
            "El correo del administrador no es válido."
        );
    }

    if (
        password.length < 12 ||
        Buffer.byteLength(password, "utf8") > 72
    ) {
        throw new Error(
            "Utiliza una contraseña de al menos 12 caracteres y máximo 72 bytes."
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

    const [role] = await Role.findOrCreate({
        where: {
            name: "admin",
        },
        defaults: {
            name: "admin",
            description: "Administrador del sistema",
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
    });

    console.log(
        "Usuario administrador de prueba creado correctamente."
    );
}

main()
    .catch((error: unknown) => {
        console.error(
            error instanceof Error
                ? error.message
                : "Error al crear el usuario."
        );

        process.exitCode = 1;
    })
    .finally(async () => {
        await sequelize.close();
    });