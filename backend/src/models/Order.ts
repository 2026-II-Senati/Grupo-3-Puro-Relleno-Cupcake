import {
    DataTypes,
    Model,
    Optional,
} from "sequelize";

import { sequelize } from "../config/database";

export type OrderStatus =
    | "pending"
    | "in_production"
    | "ready"
    | "delivered";

export type DeliveryMethod =
    | "pickup"
    | "delivery";

export interface OrderAttributes {
    id: number;

    clientId: number;

    status: OrderStatus;

    deliveryDate: Date;

    deliveryMethod: DeliveryMethod;

    deliveryAddress: string | null;

    notes: string | null;

    totalAmount: string;

    createdAt: Date;

    updatedAt: Date;
}

export type OrderCreationAttributes = Optional<
    OrderAttributes,
    | "id"
    | "status"
    | "deliveryMethod"
    | "deliveryAddress"
    | "notes"
    | "totalAmount"
    | "createdAt"
    | "updatedAt"
>;

export class Order
    extends Model<
        OrderAttributes,
        OrderCreationAttributes
    >
    implements OrderAttributes
{
    declare id: number;

    declare clientId: number;

    declare status: OrderStatus;

    declare deliveryDate: Date;

    declare deliveryMethod: DeliveryMethod;

    declare deliveryAddress: string | null;

    declare notes: string | null;

    declare totalAmount: string;

    declare createdAt: Date;

    declare updatedAt: Date;
}

Order.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        clientId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        status: {
            type: DataTypes.ENUM(
                "pending",
                "in_production",
                "ready",
                "delivered"
            ),
            allowNull: false,
            defaultValue: "pending",
        },

        deliveryDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        deliveryMethod: {
            type: DataTypes.ENUM(
                "pickup",
                "delivery"
            ),
            allowNull: false,
            defaultValue: "pickup",
        },

        deliveryAddress: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
        },

        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
        },

        totalAmount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            defaultValue: "0.00",
            validate: {
                min: 0,
            },
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

        tableName: "orders",

        timestamps: true,

        underscored: true,

        indexes: [
            {
                fields: ["client_id"],
            },
            {
                fields: ["status"],
            },
            {
                fields: ["delivery_date"],
            },
        ],
    }
);