export type DashboardRole =
    | 'admin'
    | 'customer_service'
    | 'production';

export type DashboardLoadStatus =
    | 'ready'
    | 'loading'
    | 'error';

export interface DashboardPermissions {
    viewOrders: boolean;
    createOrders: boolean;
    viewCatalog: boolean;
    viewAgenda: boolean;
    viewPayments: boolean;
    viewFinancialSummary: boolean;
}

export interface DashboardViewer {
    name: string;
    role: DashboardRole;
    permissions: DashboardPermissions;
}

export interface DashboardMetrics {
    pendingOrders: number;
    productionOrders: number;
    readyOrders: number;
    scheduledDeliveries: number;
}

export type StatCardTone =
    | 'pending'
    | 'production'
    | 'ready'
    | 'scheduled';

export const dashboardRoleLabels: Record<
    DashboardRole,
    string
> = {
    admin: 'Administrador',
    customer_service: 'Atención al Cliente',
    production: 'Producción',
};