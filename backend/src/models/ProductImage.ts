import {
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";

import { sequelize } from "../config/database";
import { Product } from "./Product";

export class ProductImage extends Model<
    InferAttributes<ProductImage>,
    InferCreationAttributes<ProductImage>
> {
    declare productId: number;
    declare imageData: Buffer;
}

ProductImage.init(
    {
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: Product,
                key: "id",
            },
            onDelete: "CASCADE",
        },

        imageData: {
            type: DataTypes.BLOB,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "product_images",
        timestamps: false,
        underscored: true,
    }
);