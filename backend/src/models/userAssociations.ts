import { Role } from "./Role";
import { User } from "./User";

export function initializeUserAssociations(): void {
    Role.hasMany(User, {
        foreignKey: "roleId",
        as: "users",
        onDelete: "RESTRICT",
    });

    User.belongsTo(Role, {
        foreignKey: "roleId",
        as: "role",
        onDelete: "RESTRICT",
    });
}