import type { RequestHandler } from "express";
import { ValidationError } from "sequelize";

import { Product } from "../models/Product";

interface ProductInput {
    name: string;
    description: string | null;
    category: string;
    basePrice: number;
    imageUrl: string | null;
    isAvailable: boolean;
}

interface ValidationResult {
    data: ProductInput | null;
    errors: string[];
}

function parseProductId(value: unknown): number | null {
    if (
        typeof value !== "string" ||
        !/^[1-9]\d*$/.test(value)
    ) {
        return null;
    }

    const id = Number(value);

    return Number.isSafeInteger(id) ? id : null;
}

function validateProductInput(
    body: unknown,
    current?: Product
): ValidationResult {
    const errors: string[] = [];

    if (
        body === null ||
        typeof body !== "object" ||
        Array.isArray(body)
    ) {
        return {
            data: null,
            errors: ["El cuerpo debe ser un objeto JSON."],
        };
    }

    const input = body as Record<string, unknown>;

    const name =
        typeof input.name === "string"
            ? input.name.trim()
            : "";

    const category =
        typeof input.category === "string"
            ? input.category.trim()
            : "";

    if (name.length < 2 || name.length > 150) {
        errors.push(
            "El nombre debe contener entre 2 y 150 caracteres."
        );
    }

    if (category.length < 2 || category.length > 50) {
        errors.push(
            "La categoría debe contener entre 2 y 50 caracteres."
        );
    }

    let description: string | null =
        current?.description ?? null;

    if ("description" in input) {
        if (
            input.description === null ||
            input.description === ""
        ) {
            description = null;
        } else if (typeof input.description === "string") {
            description = input.description.trim() || null;
        } else {
            errors.push(
                "La descripción debe ser un texto o null."
            );
        }
    }

    let imageUrl: string | null =
        current?.imageUrl ?? null;

    if ("imageUrl" in input) {
        if (
            input.imageUrl === null ||
            input.imageUrl === ""
        ) {
            imageUrl = null;
        } else if (typeof input.imageUrl === "string") {
            const value = input.imageUrl.trim();

            if (value.length > 500) {
                errors.push(
                    "La URL de la imagen no puede superar 500 caracteres."
                );
            } else {
                imageUrl = value || null;
            }
        } else {
            errors.push(
                "La URL de la imagen debe ser un texto o null."
            );
        }
    }

    let basePrice = 0;

    if (
        typeof input.basePrice !== "number" ||
        !Number.isFinite(input.basePrice)
    ) {
        errors.push(
            "El precio base debe ser un número válido."
        );
    } else {
        const price = input.basePrice;

        const rounded =
            Math.round(price * 100) / 100;

        if (price < 0 || price > 99999999.99) {
            errors.push(
                "El precio base está fuera del rango permitido."
            );
        } else if (
            Math.abs(price - rounded) > 0.00000001
        ) {
            errors.push(
                "El precio base admite como máximo dos decimales."
            );
        } else {
            basePrice = rounded;
        }
    }

    let isAvailable =
        current?.isAvailable ?? true;

    if ("isAvailable" in input) {
        if (typeof input.isAvailable !== "boolean") {
            errors.push(
                "La disponibilidad debe ser true o false."
            );
        } else {
            isAvailable = input.isAvailable;
        }
    }

    if (errors.length > 0) {
        return {
            data: null,
            errors,
        };
    }

    return {
        data: {
            name,
            description,
            category,
            basePrice,
            imageUrl,
            isAvailable,
        },
        errors: [],
    };
}

function productResponse(product: Product) {
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.category,

        // PostgreSQL DECIMAL puede llegar como string.
        // El contrato REST utiliza un número JSON.
        basePrice: Number(product.basePrice),

        imageUrl: product.imageUrl,
        isAvailable: product.isAvailable,
    };
}

export const listProducts: RequestHandler = async (
    _req,
    res,
    next
) => {
    try {
        const products = await Product.findAll({
            where: {
                isAvailable: true,
            },
            order: [["id", "ASC"]],
        });

        res.status(200).json(
            products.map(productResponse)
        );
    } catch (error) {
        next(error);
    }
};

export const getProductById: RequestHandler = async (
    req,
    res,
    next
) => {
    const id = parseProductId(req.params.id);

    if (id === null) {
        res.status(400).json({
            message: "El identificador del producto no es válido.",
        });
        return;
    }

    try {
        const product = await Product.findByPk(id);

        if (!product) {
            res.status(404).json({
                message: "Producto no encontrado.",
            });
            return;
        }

        res.status(200).json(productResponse(product));
    } catch (error) {
        next(error);
    }
};

export const createProduct: RequestHandler = async (
    req,
    res,
    next
) => {
    const validation = validateProductInput(req.body);

    if (!validation.data) {
        res.status(400).json({
            message: "Los datos del producto son inválidos.",
            errors: validation.errors,
        });
        return;
    }

    try {
        const product = await Product.create(
            validation.data
        );

        res.status(201).json(productResponse(product));
    } catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).json({
                message: "No se pudo validar el producto.",
                errors: error.errors.map(
                    (item) => item.message
                ),
            });
            return;
        }

        next(error);
    }
};

export const updateProduct: RequestHandler = async (
    req,
    res,
    next
) => {
    const id = parseProductId(req.params.id);

    if (id === null) {
        res.status(400).json({
            message: "El identificador del producto no es válido.",
        });
        return;
    }

    try {
        const product = await Product.findByPk(id);

        if (!product) {
            res.status(404).json({
                message: "Producto no encontrado.",
            });
            return;
        }

        // El contrato ProductInput exige nombre,
        // categoría y precio base también para PATCH.
        const validation = validateProductInput(
            req.body,
            product
        );

        if (!validation.data) {
            res.status(400).json({
                message: "Los datos del producto son inválidos.",
                errors: validation.errors,
            });
            return;
        }

        await product.update(validation.data);

        res.status(200).json(productResponse(product));
    } catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).json({
                message: "No se pudo actualizar el producto.",
                errors: error.errors.map(
                    (item) => item.message
                ),
            });
            return;
        }

        next(error);
    }
};