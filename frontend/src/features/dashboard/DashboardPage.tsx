import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import Alert from '../../components/Alert/Alert';
import Badge from '../../components/Badge/Badge';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import Input from '../../components/Input/Input';

import StatCard from './components/StatCard';

import type {
    DashboardLoadStatus,
    DashboardPermissions,
    DashboardRole,
    DashboardViewer,
    StatCardTone,
} from './types/Dashboard';

import { dashboardRoleLabels } from './types/Dashboard';

import type {
    OrderRecord,
    OrderStatus,
} from '../orders/management/types/OrderRecord';

import type {
    PaymentOrder,
} from '../payments/types/Payment';

import {
    calculatePaymentTotals,
    formatSoles,
} from '../payments/types/Payment';

import './DashboardPage.css';

interface DashboardPageProps {
    orders: OrderRecord[];
    paymentOrders: PaymentOrder[];
    viewer: DashboardViewer;
    status?: DashboardLoadStatus;
}

interface DashboardStat {
    key: string;
    label: string;
    value: number;
    description: string;
    icon: string;
    tone: StatCardTone;
}

interface DashboardQuickLink {
    to: string;
    label: string;
    description: string;
    permission: keyof DashboardPermissions;
}

const orderStatusLabels: Record<OrderStatus, string> = {
    pending: 'Pendiente',
    in_production: 'En producción',
    ready: 'Listo',
    delivered: 'Entregado',
};

const orderStatusVariants: Record<
    OrderStatus,
    'warning' | 'info' | 'success'
> = {
    pending: 'warning',
    in_production: 'info',
    ready: 'success',
    delivered: 'success',
};

const productionPriority: Record<OrderStatus, number> = {
    in_production: 0,
    ready: 1,
    pending: 2,
    delivered: 3,
};

const quickLinks: DashboardQuickLink[] = [
    {
        to: '/pedidos',
        label: 'Gestionar pedidos',
        description: 'Consultar pedidos y su estado.',
        permission: 'viewOrders',
    },
    {
        to: '/pedidos/nuevo',
        label: 'Registrar pedido',
        description: 'Preparar un nuevo pedido personalizado.',
        permission: 'createOrders',
    },
    {
        to: '/catalogo',
        label: 'Consultar catálogo',
        description: 'Revisar los productos disponibles.',
        permission: 'viewCatalog',
    },
    {
        to: '/agenda',
        label: 'Ver agenda',
        description: 'Consultar entregas y recogidas.',
        permission: 'viewAgenda',
    },
    {
        to: '/pagos',
        label: 'Control de pagos',
        description: 'Consultar importes y movimientos.',
        permission: 'viewPayments',
    },
];

const roleDescriptions: Record<DashboardRole, string> = {
    admin:
        'Vista general de las operaciones y los indicadores económicos.',
    customer_service:
        'Consulta de pedidos, entregas y atención al cliente.',
    production:
        'Seguimiento de pedidos pendientes y trabajos en producción.',
};

function getLocalToday(): string {
    const date = new Date();

    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
    ].join('-');
}

function formatDate(value: string): string {
    if (!value) {
        return 'Sin fecha';
    }

    return new Date(`${value}T12:00:00`).toLocaleDateString(
        'es-PE',
        {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }
    );
}

export default function DashboardPage({
                                          orders,
                                          paymentOrders,
                                          viewer,
                                          status = 'ready',
                                      }: DashboardPageProps) {
    const [selectedDate, setSelectedDate] = useState(
        getLocalToday
    );

    const today = getLocalToday();

    const activeViewer = viewer;

    const isProduction =
        activeViewer.role === 'production';

    const pendingCount = orders.filter(
        (order) => order.status === 'pending'
    ).length;

    const productionCount = orders.filter(
        (order) => order.status === 'in_production'
    ).length;

    const readyCount = orders.filter(
        (order) => order.status === 'ready'
    ).length;

    // Contamos las entregas programadas que aún
    // no aparecen como entregadas.
    const scheduledCount = orders.filter(
        (order) =>
            order.deliveryDate === selectedDate &&
            order.status !== 'delivered'
    ).length;

    const stats: DashboardStat[] = [
        {
            key: 'pending',
            label: 'Pedidos pendientes',
            value: pendingCount,
            description: 'Pendientes de preparación',
            icon: '📋',
            tone: 'pending',
        },
        {
            key: 'production',
            label: 'En producción',
            value: productionCount,
            description: 'Pedidos en preparación',
            icon: '🧁',
            tone: 'production',
        },
        {
            key: 'ready',
            label: 'Pedidos listos',
            value: readyCount,
            description: 'Pedidos preparados',
            icon: '✅',
            tone: 'ready',
        },
        {
            key: 'scheduled',
            label: 'Entregas y recogidas',
            value: scheduledCount,
            description: `Programadas para el ${formatDate(
                selectedDate
            )}`,
            icon: '📅',
            tone: 'scheduled',
        },
    ];

    // Priorizamos los indicadores según el rol.
    const statOrder: Record<DashboardRole, string[]> = {
        admin: [
            'pending',
            'production',
            'ready',
            'scheduled',
        ],
        customer_service: [
            'scheduled',
            'pending',
            'ready',
            'production',
        ],
        production: [
            'production',
            'pending',
            'ready',
            'scheduled',
        ],
    };

    const orderedStats = statOrder[activeViewer.role]
        .map((key) =>
            stats.find((stat) => stat.key === key)
        )
        .filter(
            (stat): stat is DashboardStat =>
                stat !== undefined
        );

    const recentOrders = useMemo(() => {
        const result = [...orders];

        if (isProduction) {
            return result
                .filter(
                    (order) => order.status !== 'delivered'
                )
                .sort(
                    (first, second) =>
                        productionPriority[first.status] -
                        productionPriority[second.status] ||
                        second.createdAt.localeCompare(
                            first.createdAt
                        )
                )
                .slice(0, 5);
        }

        return result
            .sort(
                (first, second) =>
                    second.createdAt.localeCompare(
                        first.createdAt
                    ) ||
                    second.id.localeCompare(first.id)
            )
            .slice(0, 5);
    }, [orders, isProduction]);

    const upcomingDeliveries = useMemo(
        () =>
            [...orders]
                .filter(
                    (order) =>
                        order.deliveryDate >= today &&
                        order.status !== 'delivered'
                )
                .sort(
                    (first, second) =>
                        first.deliveryDate.localeCompare(
                            second.deliveryDate
                        ) ||
                        first.deliveryTime.localeCompare(
                            second.deliveryTime
                        ) ||
                        first.id.localeCompare(second.id)
                )
                .slice(0, 6),
        [orders, today]
    );

    // La información económica se resume únicamente
    // para la vista que tenga permiso de consultarla.
    const economicSummary = useMemo(() => {
        return paymentOrders.reduce(
            (summary, order) => {
                const totals = calculatePaymentTotals(order);

                return {
                    paidCents:
                        summary.paidCents + totals.paidCents,
                    balanceCents:
                        summary.balanceCents + totals.balanceCents,
                    movementCount:
                        summary.movementCount +
                        order.payments.length,
                };
            },
            {
                paidCents: 0,
                balanceCents: 0,
                movementCount: 0,
            }
        );
    }, [paymentOrders]);

    const visibleQuickLinks = quickLinks.filter(
        (link) =>
            activeViewer.permissions[link.permission]
    );

    const ordersPanel = (
        <section
            className="prc-dashboard-panel"
            aria-label={
                isProduction
                    ? 'Prioridades de producción'
                    : 'Pedidos recientes'
            }
        >
            <Card
                heading={
                    isProduction
                        ? 'Prioridades de producción'
                        : 'Pedidos recientes'
                }
                description={
                    isProduction
                        ? 'Trabajos activos ordenados por prioridad visual.'
                        : 'Últimos pedidos según su fecha de registro.'
                }
            >
                {recentOrders.length === 0 ? (
                    <p className="prc-dashboard-empty">
                        {isProduction
                            ? 'No hay pedidos activos para preparar.'
                            : 'Todavía no hay pedidos registrados.'}
                    </p>
                ) : (
                    <ul className="prc-dashboard-list">
                        {recentOrders.map((order) => (
                            <li
                                key={order.id}
                                className="prc-dashboard-list-item"
                            >
                                <div className="prc-dashboard-list-info">
                                    <strong>{order.id}</strong>

                                    <span>{order.customerName}</span>

                                    <small>
                                        Programado: {formatDate(
                                        order.deliveryDate
                                    )}
                                    </small>
                                </div>

                                <Badge
                                    variant={
                                        orderStatusVariants[order.status]
                                    }
                                >
                                    {orderStatusLabels[order.status]}
                                </Badge>
                            </li>
                        ))}
                    </ul>
                )}

                {activeViewer.permissions.viewOrders && (
                    <Link
                        className="prc-dashboard-section-link"
                        to="/pedidos"
                    >
                        Ver gestión de pedidos
                    </Link>
                )}
            </Card>
        </section>
    );

    const deliveriesPanel = (
        <section
            className="prc-dashboard-panel"
            aria-label="Próximas entregas y recogidas"
        >
            <Card
                heading="Próximas entregas y recogidas"
                description="Pedidos activos organizados por fecha y horario."
            >
                {upcomingDeliveries.length === 0 ? (
                    <p className="prc-dashboard-empty">
                        No hay entregas o recogidas próximas
                        con los datos disponibles.
                    </p>
                ) : (
                    <ul className="prc-dashboard-list">
                        {upcomingDeliveries.map((order) => (
                            <li
                                key={order.id}
                                className="prc-dashboard-list-item"
                            >
                                <div className="prc-dashboard-list-info">
                                    <strong>{order.id}</strong>

                                    <span>{order.customerName}</span>

                                    <small>
                                        {formatDate(order.deliveryDate)}
                                        {' · '}
                                        {order.deliveryTime}
                                    </small>
                                </div>

                                <Badge
                                    variant={
                                        order.deliveryMode === 'delivery'
                                            ? 'info'
                                            : 'default'
                                    }
                                >
                                    {order.deliveryMode === 'delivery'
                                        ? 'A domicilio'
                                        : 'Recogida'}
                                </Badge>
                            </li>
                        ))}
                    </ul>
                )}

                {activeViewer.permissions.viewAgenda && (
                    <Link
                        className="prc-dashboard-section-link"
                        to="/agenda"
                    >
                        Consultar agenda
                    </Link>
                )}
            </Card>
        </section>
    );

    return (
        <main className="prc-dashboard-page">
            <div className="prc-dashboard-container">
                <header className="prc-dashboard-header">
                    <div>
            <span className="prc-dashboard-eyebrow">
              Puro Relleno Cupcake
            </span>

                        <h1>Panel principal</h1>

                        <p>
                            Bienvenido al sistema de gestión
                            de pedidos personalizados.
                        </p>

                        <p className="prc-dashboard-user">
                            <strong>{activeViewer.name}</strong>
                            {' · '}
                            {dashboardRoleLabels[activeViewer.role]}
                        </p>

                        <p className="prc-dashboard-role-description">
                            {roleDescriptions[activeViewer.role]}
                        </p>
                    </div>

                    <span
                        className="prc-dashboard-header-icon"
                        aria-hidden="true"
                    >
            🧁
          </span>
                </header>

                <div className="prc-dashboard-controls">

                    <Input
                        label="Fecha para entregas y recogidas"
                        type="date"
                        value={selectedDate}
                        onChange={(event) =>
                            setSelectedDate(event.target.value)
                        }
                    />

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() =>
                            setSelectedDate(getLocalToday())
                        }
                    >
                        Ver hoy
                    </Button>
                </div>

                {status === 'loading' && (
                    <div
                        className="prc-dashboard-feedback"
                        role="status"
                    >
                        Cargando información del panel...
                    </div>
                )}

                {status === 'error' && (
                    <div className="prc-dashboard-feedback">
                        <Alert
                            variant="error"
                            title="No se pudo cargar el Dashboard"
                        >
                            Ocurrió un problema al obtener
                            los indicadores del sistema.
                        </Alert>
                    </div>
                )}

                {status === 'ready' && (
                    <>
                        <section
                            className="prc-dashboard-stats"
                            aria-label="Indicadores generales"
                        >
                            {orderedStats.map((stat) => (
                                <StatCard
                                    key={stat.key}
                                    label={stat.label}
                                    value={stat.value}
                                    description={stat.description}
                                    icon={stat.icon}
                                    tone={stat.tone}
                                />
                            ))}
                        </section>

                        <div className="prc-dashboard-content">
                            {isProduction ? (
                                <>
                                    {ordersPanel}
                                    {deliveriesPanel}
                                </>
                            ) : (
                                <>
                                    {deliveriesPanel}
                                    {ordersPanel}
                                </>
                            )}
                        </div>

                        <section
                            className="prc-dashboard-shortcuts"
                            aria-label="Accesos rápidos"
                        >
                            <h2>Accesos rápidos</h2>

                            {visibleQuickLinks.length === 0 ? (
                                <p className="prc-dashboard-empty">
                                    No hay accesos disponibles
                                    para esta configuración.
                                </p>
                            ) : (
                                <div className="prc-dashboard-shortcut-grid">
                                    {visibleQuickLinks.map((link) => (
                                        <Link
                                            key={link.to}
                                            to={link.to}
                                            className="prc-dashboard-shortcut"
                                        >
                                            <strong>{link.label}</strong>

                                            <span>{link.description}</span>

                                            <span
                                                className="prc-dashboard-shortcut-arrow"
                                                aria-hidden="true"
                                            >
                        →
                      </span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </section>

                        {activeViewer.permissions
                            .viewFinancialSummary && (
                            <section
                                className="prc-dashboard-finance"
                                aria-label="Indicadores económicos"
                            >
                                <div className="prc-dashboard-section-heading">
                                    <h2>Resumen económico</h2>

                                    <p>
                                        Información de pagos y saldos
                                        según los permisos de la vista.
                                    </p>
                                </div>

                                {paymentOrders.length === 0 ? (
                                    <Card>
                                        <p className="prc-dashboard-empty">
                                            No hay información económica
                                            disponible.
                                        </p>
                                    </Card>
                                ) : (
                                    <div className="prc-dashboard-finance-grid">
                                        <Card>
                      <span className="prc-dashboard-finance-label">
                        Importe pagado
                      </span>

                                            <strong className="prc-dashboard-finance-value">
                                                {formatSoles(
                                                    economicSummary.paidCents
                                                )}
                                            </strong>
                                        </Card>

                                        <Card>
                      <span className="prc-dashboard-finance-label">
                        Saldo pendiente
                      </span>

                                            <strong className="prc-dashboard-finance-value">
                                                {formatSoles(
                                                    economicSummary.balanceCents
                                                )}
                                            </strong>
                                        </Card>

                                        <Card>
                      <span className="prc-dashboard-finance-label">
                        Movimientos de pago
                      </span>

                                            <strong className="prc-dashboard-finance-value">
                                                {economicSummary.movementCount}
                                            </strong>
                                        </Card>
                                    </div>
                                )}
                            </section>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}