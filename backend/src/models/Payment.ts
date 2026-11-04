import {
    DataTypes,
    Model,
    Optional,
} from "sequelize";

import { sequelize } from "../config/database";

export type PaymentMethod =
    | "cash"
    | "bank_transfer"
    | "yape"
    | "plin";

export interface PaymentAttributes {
    id: number;
    orderId: number;
    amount: string;
    method: PaymentMethod;
    reference: string | null;
    paymentDate: string;
    createdAt: Date;
    updatedAt: Date;
}

export type PaymentCreationAttributes = Optional<
    PaymentAttributes,
    "id" | "reference" | "createdAt" | "updatedAt"
>;

export class Payment
    extends Model<
        PaymentAttributes,
        PaymentCreationAttributes
    >
    implements PaymentAttributes
{
    declare id: number;
    declare orderId: number;
    declare amount: string;
    declare method: PaymentMethod;
    declare reference: string | null;
    declare paymentDate: string;
    declare createdAt: Date;
    declare updatedAt: Date;
}

Payment.init(
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

        amount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            validate: {
                min: 0.01,
            },
        },

        method: {
            type: DataTypes.ENUM(
                "cash",
                "bank_transfer",
                "yape",
                "plin"
            ),
            allowNull: false,
        },

        reference: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: null,
        },

        paymentDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
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
        tableName: "payments",
        timestamps: true,
        underscored: true,
        indexes: [
            {
                fields: ["order_id"],
            },
            {
                fields: ["payment_date"],
            },
        ],
    }
);