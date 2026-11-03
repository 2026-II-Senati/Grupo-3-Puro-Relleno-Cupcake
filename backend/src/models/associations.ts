import { Client } from "./Client";

import { Product } from "./Product";

import { Order } from "./Order";

import { OrderDetail } from "./OrderDetail";

export function initializeOrderAssociations(): void {

    // Un cliente puede tener varios pedidos.

    Client.hasMany(Order, {
        foreignKey: "clientId",
        as: "orders",
        onDelete: "RESTRICT",
    });

    // Cada pedido pertenece a un cliente.

    Order.belongsTo(Client, {
        foreignKey: "clientId",
        as: "client",
        onDelete: "RESTRICT",
    });

    // Un pedido puede contener varios detalles.

    Order.hasMany(OrderDetail, {
        foreignKey: "orderId",
        as: "details",
        onDelete: "CASCADE",
    });

    // Cada detalle pertenece a un pedido.

    OrderDetail.belongsTo(Order, {
        foreignKey: "orderId",
        as: "order",
        onDelete: "CASCADE",
    });

    // Un producto puede aparecer en varios detalles.

    Product.hasMany(OrderDetail, {
        foreignKey: "productId",
        as: "orderDetails",
        onDelete: "RESTRICT",
    });

    // Cada detalle corresponde a un producto.

    OrderDetail.belongsTo(Product, {
        foreignKey: "productId",
        as: "product",
        onDelete: "RESTRICT",
    });
}