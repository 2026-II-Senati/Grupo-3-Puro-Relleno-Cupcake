import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import Card from '../../components/Card/Card';
import Badge from '../../components/Badge/Badge';
import Alert from '../../components/Alert/Alert';

import type {
    OrderRecord,
    OrderStatus,
    OrderDeliveryMode,
} from '../orders/management/types/OrderRecord';

import './AgendaPage.css';

type AgendaStatus = 'ready' | 'loading' | 'error';

interface AgendaPageProps {
    orders: OrderRecord[];
    status?: AgendaStatus;
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

function formatDate(date: string): string {
    const parsedDate = new Date(`${date}T12:00:00`);

    return new Intl.DateTimeFormat('es-PE', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(parsedDate);
}

function normalizeText(text: string): string {
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function AgendaPage({
                        orders,
                        status = 'ready',
                    }: AgendaPageProps) {
    const [search, setSearch] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [deliveryFilter, setDeliveryFilter] = useState<
        OrderDeliveryMode | ''
    >('');
    const [statusFilter, setStatusFilter] = useState<
        OrderStatus | ''
    >('');

    const filteredOrders = useMemo(() => {
        const normalizedSearch = normalizeText(search);

        return orders
            .filter((order) => {
                const matchesSearch =
                    normalizeText(order.id).includes(normalizedSearch) ||
                    normalizeText(order.customerName).includes(
                        normalizedSearch
                    );

                const matchesDate =
                    !selectedDate ||
                    order.deliveryDate === selectedDate;

                const matchesDelivery =
                    !deliveryFilter ||
                    order.deliveryMode === deliveryFilter;

                const matchesStatus =
                    !statusFilter ||
                    order.status === statusFilter;

                return (
                    matchesSearch &&
                    matchesDate &&
                    matchesDelivery &&
                    matchesStatus
                );
            })
            .sort((a, b) => {
                const dateComparison =
                    a.deliveryDate.localeCompare(b.deliveryDate);

                if (dateComparison !== 0) {
                    return dateComparison;
                }

                const timeComparison =
                    a.deliveryTime.localeCompare(b.deliveryTime);

                if (timeComparison !== 0) {
                    return timeComparison;
                }

                return a.id.localeCompare(b.id);
            });
    }, [
        orders,
        search,
        selectedDate,
        deliveryFilter,
        statusFilter,
    ]);

    const groupedOrders = useMemo(() => {
        const groups: {
            date: string;
            orders: OrderRecord[];
        }[] = [];

        for (const order of filteredOrders) {
            const lastGroup = groups[groups.length - 1];

            if (
                lastGroup &&
                lastGroup.date === order.deliveryDate
            ) {
                lastGroup.orders.push(order);
            } else {
                groups.push({
                    date: order.deliveryDate,
                    orders: [order],
                });
            }
        }

        return groups;
    }, [filteredOrders]);

    const pickupCount = filteredOrders.filter(
        (order) => order.deliveryMode === 'pickup'
    ).length;

    const deliveryCount = filteredOrders.filter(
        (order) => order.deliveryMode === 'delivery'
    ).length;

    function clearFilters() {
        setSearch('');
        setSelectedDate('');
        setDeliveryFilter('');
        setStatusFilter('');
    }

    return (
        <main className="prc-agenda-page">
            <div className="prc-agenda-container">

                <header className="prc-agenda-header">
                    <div>
            <span className="prc-agenda-label">
              Puro Relleno Cupcake
            </span>

                        <h1>Agenda de entregas y recogidas</h1>

                        <p>
                            Consulta los pedidos programados,
                            sus fechas, horarios y modalidades de entrega.
                        </p>
                    </div>

                    <Link
                        to="/pedidos"
                        className="prc-agenda-link"
                    >
                        Ver gestión de pedidos
                    </Link>
                </header>

                <Alert
                    variant="info"
                    title="Agenda de demostración"
                >
                    Los pedidos mostrados son ficticios.
                    La agenda todavía no está conectada al backend.
                </Alert>

                {status === 'loading' && (
                    <div
                        className="prc-agenda-feedback"
                        role="status"
                    >
                        Cargando agenda...
                    </div>
                )}

                {status === 'error' && (
                    <div className="prc-agenda-feedback">
                        <Alert
                            variant="error"
                            title="No se pudo cargar la agenda"
                        >
                            Ocurrió un problema al obtener
                            las entregas y recogidas.
                        </Alert>
                    </div>
                )}

                {status === 'ready' && (
                    <>
                        <section
                            className="prc-agenda-filters"
                            aria-label="Filtros de la agenda"
                        >
                            <Input
                                label="Buscar pedido o cliente"
                                type="search"
                                placeholder="Código o nombre..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                            />

                            <Input
                                label="Fecha"
                                type="date"
                                value={selectedDate}
                                onChange={(event) =>
                                    setSelectedDate(event.target.value)
                                }
                            />

                            <Select
                                label="Modalidad"
                                value={deliveryFilter}
                                onChange={(event) =>
                                    setDeliveryFilter(
                                        event.target.value as
                                            OrderDeliveryMode | ''
                                    )
                                }
                            >
                                <option value="">
                                    Todas
                                </option>

                                <option value="pickup">
                                    Recogida
                                </option>

                                <option value="delivery">
                                    Entrega a domicilio
                                </option>
                            </Select>

                            <Select
                                label="Estado"
                                value={statusFilter}
                                onChange={(event) =>
                                    setStatusFilter(
                                        event.target.value as OrderStatus | ''
                                    )
                                }
                            >
                                <option value="">
                                    Todos los estados
                                </option>

                                {Object.entries(orderStatusLabels).map(
                                    ([value, label]) => (
                                        <option
                                            key={value}
                                            value={value}
                                        >
                                            {label}
                                        </option>
                                    )
                                )}
                            </Select>

                            <Button
                                type="button"
                                variant="secondary"
                                onClick={clearFilters}
                            >
                                Limpiar filtros
                            </Button>
                        </section>

                        <section
                            className="prc-agenda-summary"
                            aria-label="Resumen de la agenda"
                        >
                            <div className="prc-agenda-summary-card">
                                <span>Pedidos encontrados</span>
                                <strong>{filteredOrders.length}</strong>
                            </div>

                            <div className="prc-agenda-summary-card">
                                <span>Recogidas</span>
                                <strong>{pickupCount}</strong>
                            </div>

                            <div className="prc-agenda-summary-card">
                                <span>Entregas a domicilio</span>
                                <strong>{deliveryCount}</strong>
                            </div>
                        </section>

                        {filteredOrders.length === 0 ? (
                            <div className="prc-agenda-empty">
                                <h2>No hay pedidos programados</h2>

                                <p>
                                    No encontramos entregas o recogidas
                                    que coincidan con los filtros.
                                </p>

                                <Button
                                    variant="secondary"
                                    onClick={clearFilters}
                                >
                                    Mostrar toda la agenda
                                </Button>
                            </div>
                        ) : (
                            <div className="prc-agenda-days">
                                {groupedOrders.map((group) => (
                                    <section
                                        key={group.date}
                                        className="prc-agenda-day"
                                        aria-labelledby={
                                            `prc-agenda-date-${group.date}`
                                        }
                                    >
                                        <div className="prc-agenda-day-header">
                                            <h2
                                                id={`prc-agenda-date-${group.date}`}
                                            >
                                                {formatDate(group.date)}
                                            </h2>

                                            <span>
                        {group.orders.length}
                                                {group.orders.length === 1
                                                    ? ' pedido'
                                                    : ' pedidos'}
                      </span>
                                        </div>

                                        <div className="prc-agenda-grid">
                                            {group.orders.map((order) => (
                                                <Card
                                                    key={order.id}
                                                    heading={`Pedido ${order.id}`}
                                                    description={order.customerName}
                                                >
                                                    <div className="prc-agenda-badges">
                                                        <Badge
                                                            variant={
                                                                orderStatusVariants[
                                                                    order.status
                                                                    ]
                                                            }
                                                        >
                                                            {
                                                                orderStatusLabels[
                                                                    order.status
                                                                    ]
                                                            }
                                                        </Badge>

                                                        <Badge
                                                            variant={
                                                                order.deliveryMode ===
                                                                'delivery'
                                                                    ? 'info'
                                                                    : 'default'
                                                            }
                                                        >
                                                            {order.deliveryMode === 'delivery'
                                                                ? 'Entrega a domicilio'
                                                                : 'Recogida'}
                                                        </Badge>
                                                    </div>

                                                    <dl className="prc-agenda-details">
                                                        <div>
                                                            <dt>Hora</dt>
                                                            <dd>{order.deliveryTime}</dd>
                                                        </div>

                                                        <div>
                                                            <dt>Producto</dt>
                                                            <dd>{order.productName}</dd>
                                                        </div>

                                                        <div>
                                                            <dt>Cantidad</dt>
                                                            <dd>{order.quantity}</dd>
                                                        </div>

                                                        <div>
                                                            <dt>Teléfono</dt>
                                                            <dd>{order.customerPhone}</dd>
                                                        </div>

                                                        {order.deliveryMode ===
                                                            'delivery' && (
                                                                <div className="prc-agenda-address">
                                                                    <dt>Dirección</dt>
                                                                    <dd>
                                                                        {order.deliveryAddress ||
                                                                            'No especificada'}
                                                                    </dd>
                                                                </div>
                                                            )}
                                                    </dl>
                                                </Card>
                                            ))}
                                        </div>
                                    </section>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}

export default AgendaPage;