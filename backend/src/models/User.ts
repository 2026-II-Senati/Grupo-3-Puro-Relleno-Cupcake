import {
    CreationOptional,
    DataTypes,
    InferAttributes,
    InferCreationAttributes,
    Model,
} from "sequelize";

import { sequelize } from "../config/database";

export class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<User>
> {
    declare id: CreationOptional<number>;
    declare fullName: string;
    declare email: string;
    declare passwordHash: string;
    declare roleId: number;
    declare isActive: CreationOptional<boolean>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        fullName: {
            type: DataTypes.STRING(150),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2, 150],
            },
        },

        email: {
            type: DataTypes.STRING(254),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                notEmpty: true,
            },
            set(value: string) {
                this.setDataValue(
                    "email",
                    value.trim().toLowerCase()
                );
            },
        },

        passwordHash: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },

        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
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
        tableName: "users",
        timestamps: true,
        underscored: true,

        defaultScope: {
            attributes: {
                exclude: ["passwordHash"],
            },
        },

        indexes: [
            {
                fields: ["role_id"],
            },
        ],
    }
);