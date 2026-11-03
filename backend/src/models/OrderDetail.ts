import {
    DataTypes,
    Model,
    Optional,
} from "sequelize";

import { sequelize } from "../config/database";

export interface OrderDetailAttributes {
    id: number;

    orderId: number;

    productId: number;

    quantity: number;

    unitPrice: string;

    subtotal: string;

    flavor: string | null;

    filling: string | null;

    size: string | null;

    decoration: string | null;

    personalizedMessage: string | null;

    notes: string | null;

    createdAt: Date;

    updatedAt: Date;
}

export type OrderDetailCreationAttributes = Optional<
    OrderDetailAttributes,
    | "id"
    | "flavor"
    | "filling"
    | "size"
    | "decoration"
    | "personalizedMessage"
    | "notes"
    | "createdAt"
    | "updatedAt"
>;

export class OrderDetail
    extends Model<
        OrderDetailAttributes,
        OrderDetailCreationAttributes
    >
    implements OrderDetailAttributes
{
    declare id: number;

    declare orderId: number;

    declare productId: number;

    declare quantity: number;

    declare unitPrice: string;

    declare subtotal: string;

    declare flavor: string | null;

    declare filling: string | null;

    declare size: string | null;

    declare decoration: string | null;

    declare personalizedMessage: string | null;

    declare notes: string | null;

    declare createdAt: Date;

    declare updatedAt: Date;
}

OrderDetail.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                isInt: true,
            },
        },

        unitPrice: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            validate: {
                min: 0,
            },
        },

        subtotal: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            validate: {
                min: 0,
            },
        },

        flavor: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: null,
        },

        filling: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: null,
        },

        size: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: null,
        },

        decoration: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
        },

        personalizedMessage: {
            type: DataTypes.STRING(200),
            allowNull: true,
            defaultValue: null,
        },

        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
        },

        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },

        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,

        tableName: "order_details",

        timestamps: true,

        underscored: true,

        indexes: [
            {
                fields: ["order_id"],
            },
            {
                fields: ["product_id"],
            },
        ],
    }
);