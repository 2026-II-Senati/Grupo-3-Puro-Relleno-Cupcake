import OrderManagementPage from '../features/orders/management/OrderManagementPage';

import { sampleOrders } from '../features/orders/management/data/sampleOrders';

export function Pedidos() {
    return (
        <OrderManagementPage
            initialOrders={sampleOrders}
        />
    );
}