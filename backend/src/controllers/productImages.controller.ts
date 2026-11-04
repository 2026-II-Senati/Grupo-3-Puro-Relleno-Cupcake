import type { RequestHandler } from "express";

import multer from "multer";
import sharp from "sharp";

import { sequelize } from "../config/database";

import { AppError } from "../errors/AppError";

import { Product } from "../models/Product";

import { ProductImage } from "../models/ProductImage";

function parseProductId(value: unknown): number {
    if (
        typeof value !== "string" ||
        !/^[1-9]\d*$/.test(value)
    ) {
        throw new AppError(
            400,
            "Identificador de producto inválido."
        );
    }

    const id = Number(value);

    if (!Number.isSafeInteger(id)) {
        throw new AppError(
            400,
            "Identificador de producto inválido."
        );
    }

    return id;
}

const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 3 * 1024 * 1024,
        files: 1,
    },
});

export const parseProductImage: RequestHandler = (
    req,
    res,
    next
) => {
    upload.single("image")(
        req,
        res,
        (error: unknown) => {
            if (error) {
                next(
                    new AppError(
                        400,
                        "No se pudo recibir la imagen. Utiliza un archivo de máximo 3 MB."
                    )
                );

                return;
            }

            next();
        }
    );
};

export const uploadProductImage: RequestHandler =
    async (req, res, next) => {
        try {
            const productId = parseProductId(
                req.params.id
            );

            if (!req.file) {
                throw new AppError(
                    400,
                    "Selecciona una imagen."
                );
            }

            const product = await Product.findByPk(
                productId
            );

            if (!product) {
                throw new AppError(
                    404,
                    "Producto no encontrado."
                );
            }

            const allowedFormats = [
                "jpeg",
                "png",
                "webp",
            ];

            let processedImage: Buffer;

            try {
                const metadata = await sharp(
                    req.file.buffer,
                    {
                        limitInputPixels: 20_000_000,
                    }
                ).metadata();

                if (
                    !metadata.format ||
                    !allowedFormats.includes(
                        metadata.format
                    )
                ) {
                    throw new Error(
                        "Formato no permitido."
                    );
                }

                processedImage = await sharp(
                    req.file.buffer,
                    {
                        limitInputPixels: 20_000_000,
                    }
                )
                    .rotate()
                    .resize(1200, 1200, {
                        fit: "inside",
                        withoutEnlargement: true,
                    })
                    .webp({
                        quality: 80,
                    })
                    .toBuffer();

            } catch {
                throw new AppError(
                    400,
                    "La imagen debe ser JPG, PNG o WebP y estar en buen estado."
                );
            }

            const imageUrl =
                `/api/v1/products/${productId}/image`;

            await sequelize.transaction(
                async (transaction) => {
                    await ProductImage.upsert(
                        {
                            productId,
                            imageData: processedImage,
                        },
                        {
                            transaction,
                        }
                    );

                    await product.update(
                        {
                            imageUrl,
                        },
                        {
                            transaction,
                        }
                    );
                }
            );

            res.status(200).json({
                message:
                    "Imagen guardada correctamente en PostgreSQL.",

                productId,
                imageUrl,
            });

        } catch (error) {
            next(error);
        }
    };

export const getProductImage: RequestHandler =
    async (req, res, next) => {
        try {
            const productId = parseProductId(
                req.params.id
            );

            const image = await ProductImage.findByPk(
                productId
            );

            if (!image) {
                throw new AppError(
                    404,
                    "Este producto no tiene imagen."
                );
            }

            res.setHeader(
                "Content-Type",
                "image/webp"
            );

            res.setHeader(
                "Cache-Control",
                "public, max-age=60"
            );

            res.status(200).send(
                image.imageData
            );

        } catch (error) {
            next(error);
        }
    };