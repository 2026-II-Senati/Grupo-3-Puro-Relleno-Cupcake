import DashboardPage from '../features/dashboard/DashboardPage';

import {
    demoDashboardOrders,
    demoDashboardPayments,
    demoDashboardViewers,
} from '../features/dashboard/data/sampleDashboard';

export function Dashboard() {
    return (
        <DashboardPage
            orders={demoDashboardOrders}
            paymentOrders={demoDashboardPayments}
            viewer={demoDashboardViewers[0]}
            demoViewers={demoDashboardViewers}
        />
    );
}