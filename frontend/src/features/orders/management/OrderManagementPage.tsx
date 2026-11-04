import { useMemo, useState } from 'react';

import { Link } from 'react-router-dom';

import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';
import Select from '../../../components/Select/Select';
import Card from '../../../components/Card/Card';
import Badge from '../../../components/Badge/Badge';
import Alert from '../../../components/Alert/Alert';

import type {
    OrderRecord,
    OrderStatus,
} from './types/OrderRecord';

import './OrderManagementPage.css';

type ManagementStatus = 'ready' | 'loading' | 'error';
type DateSort = 'newest' | 'oldest';

interface OrderManagementPageProps {
    initialOrders: OrderRecord[];

    status?: ManagementStatus;

    onStatusChange: (
        orderId: string,
        newStatus: OrderStatus
    ) => Promise<void>;
}

const statusLabels: Record<OrderStatus, string> = {
    pending: 'Pendiente',
    in_production: 'En producción',
    ready: 'Listo',
    delivered: 'Entregado',
};

const statusVariants: Record<
    OrderStatus,
    'warning' | 'info' | 'success'
> = {
    pending: 'warning',
    in_production: 'info',
    ready: 'success',
    delivered: 'success',
};

const availableStatuses: OrderStatus[] = [
    'pending',
    'in_production',
    'ready',
    'delivered',
];

function normalizeText(value: string): string {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function formatDate(value: string): string {
    if (!value) return 'Sin fecha';

    return new Date(`${value}T12:00:00`).toLocaleDateString(
        'es-PE'
    );
}

function OrderManagementPage({
                                 initialOrders,
                                 status = 'ready',
                                 onStatusChange,
                             }: OrderManagementPageProps) {
    const [orders, setOrders] = useState<OrderRecord[]>(
        initialOrders
    );

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<
        OrderStatus | ''
    >('');

    const [dateSort, setDateSort] = useState<DateSort>('newest');

    const [selectedOrderId, setSelectedOrderId] = useState<
        string | null
    >(null);

    const [hasSavedChanges, setHasSavedChanges] =
        useState(false);

    const [savingStatus, setSavingStatus] =
        useState(false);

    const [saveError, setSaveError] =
        useState('');

    const filteredOrders = useMemo(() => {
        const normalizedSearch = normalizeText(search);

        return orders
            .filter((order) => {
                const matchesSearch =
                    normalizeText(order.id).includes(normalizedSearch) ||
                    normalizeText(order.customerName).includes(
                        normalizedSearch
                    );

                const matchesStatus =
                    statusFilter === '' ||
                    order.status === statusFilter;

                return matchesSearch && matchesStatus;
            })
            .sort((first, second) => {
                const comparison = first.deliveryDate.localeCompare(
                    second.deliveryDate
                );

                return dateSort === 'newest'
                    ? -comparison
                    : comparison;
            });
    }, [orders, search, statusFilter, dateSort]);

    const selectedOrder = filteredOrders.find(
        (order) => order.id === selectedOrderId
    );

    async function changeOrderStatus(
        orderId: string,
        newStatus: OrderStatus
    ): Promise<void> {
        if (savingStatus) {
            return;
        }

        setSavingStatus(true);
        setSaveError('');
        setHasSavedChanges(false);

        try {
            // Guardar el cambio en PostgreSQL mediante la API.
            await onStatusChange(orderId, newStatus);

            // Actualizar la pantalla solamente si se guardó.
            setOrders((previous) =>
                previous.map((order) =>
                    order.id === orderId
                        ? {
                            ...order,
                            status: newStatus,
                        }
                        : order
                )
            );

            setHasSavedChanges(true);

        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'No se pudo actualizar el pedido.';

            setSaveError(message);

        } finally {
            setSavingStatus(false);
        }
    }

    function clearFilters() {
        setSearch('');
        setStatusFilter('');
        setDateSort('newest');
    }

    return (
        <main className="prc-orders-page">
            <div className="prc-orders-container">

                <header className="prc-orders-header">
                    <div>
            <span className="prc-orders-label">
              Puro Relleno Cupcake
            </span>

                        <h1>Gestión y seguimiento de pedidos</h1>

                        <p>
                            Consulta los pedidos, revisa sus detalles
                            y visualiza su estado de preparación.
                        </p>
                    </div>

                    <Link
                        to="/pedidos/nuevo"
                        className="prc-orders-new-link"
                    >
                        + Registrar nuevo pedido
                    </Link>
                </header>

                <Alert
                    variant="info"
                    title="Pedidos registrados en PostgreSQL"
                >
                    Esta pantalla consulta los pedidos mediante nuestra
                    API REST. Los cambios de estado se guardan en
                    la base de datos.
                </Alert>

                {hasSavedChanges && (
                    <div className="prc-orders-message">
                        <Alert
                            variant="success"
                            title="Estado actualizado correctamente"
                        >
                            El nuevo estado del pedido se guardó
                            en PostgreSQL.
                        </Alert>
                    </div>
                )}

                {saveError && (
                    <div className="prc-orders-message">
                        <Alert
                            variant="error"
                            title="Error al actualizar el pedido"
                        >
                            {saveError}
                        </Alert>
                    </div>
                )}

                {status === 'loading' && (
                    <div
                        className="prc-orders-feedback"
                        role="status"
                    >
                        Cargando pedidos...
                    </div>
                )}

                {status === 'error' && (
                    <div className="prc-orders-feedback">
                        <Alert
                            variant="error"
                            title="No se pudieron cargar los pedidos"
                        >
                            Ocurrió un problema al obtener la información.
                        </Alert>
                    </div>
                )}

                {status === 'ready' && (
                    <>
                        <section
                            className="prc-orders-filters"
                            aria-label="Filtros de pedidos"
                        >
                            <Input
                                label="Buscar pedido"
                                type="search"
                                placeholder="Código o nombre del cliente"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                            />

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

                                {availableStatuses.map((orderStatus) => (
                                    <option
                                        key={orderStatus}
                                        value={orderStatus}
                                    >
                                        {statusLabels[orderStatus]}
                                    </option>
                                ))}
                            </Select>

                            <Select
                                label="Ordenar por fecha de entrega"
                                value={dateSort}
                                onChange={(event) =>
                                    setDateSort(event.target.value as DateSort)
                                }
                            >
                                <option value="newest">
                                    Más recientes primero
                                </option>

                                <option value="oldest">
                                    Más próximas primero
                                </option>
                            </Select>

                            <Button
                                type="button"
                                variant="secondary"
                                onClick={clearFilters}
                            >
                                Limpiar filtros
                            </Button>
                        </section>

                        <div
                            className="prc-orders-results"
                            role="status"
                        >
                            {filteredOrders.length} de {orders.length}{' '}
                            pedidos encontrados
                        </div>

                        {filteredOrders.length === 0 ? (
                            <div className="prc-orders-empty">
                                <h2>No encontramos pedidos</h2>

                                <p>
                                    Prueba con otro código, nombre de cliente
                                    o estado.
                                </p>

                                <Button
                                    variant="secondary"
                                    onClick={clearFilters}
                                >
                                    Mostrar todos
                                </Button>
                            </div>
                        ) : (
                            <div className="prc-orders-layout">

                                <section
                                    aria-label="Listado de pedidos"
                                    className="prc-orders-list"
                                >
                                    {filteredOrders.map((order) => (
                                        <article
                                            key={order.id}
                                            className="prc-orders-item"
                                        >
                                            <div className="prc-orders-item-header">
                                                <strong>{order.id}</strong>

                                                <Badge
                                                    variant={
                                                        statusVariants[order.status]
                                                    }
                                                >
                                                    {statusLabels[order.status]}
                                                </Badge>
                                            </div>

                                            <div className="prc-orders-item-data">
                                                <div>
                                                    <span>Cliente</span>
                                                    <strong>
                                                        {order.customerName}
                                                    </strong>
                                                </div>

                                                <div>
                                                    <span>Producto</span>
                                                    <strong>
                                                        {order.productName}
                                                    </strong>
                                                </div>

                                                <div>
                                                    <span>Cantidad</span>
                                                    <strong>
                                                        {order.quantity}
                                                    </strong>
                                                </div>

                                                <div>
                                                    <span>Entrega</span>
                                                    <strong>
                                                        {formatDate(order.deliveryDate)}
                                                    </strong>
                                                </div>
                                            </div>

                                            <Button
                                                type="button"
                                                variant="secondary"
                                                onClick={() =>
                                                    setSelectedOrderId(
                                                        selectedOrderId === order.id
                                                            ? null
                                                            : order.id
                                                    )
                                                }
                                            >
                                                {selectedOrderId === order.id
                                                    ? 'Ocultar detalles'
                                                    : 'Ver detalles'}
                                            </Button>
                                        </article>
                                    ))}
                                </section>

                                {selectedOrder && (
                                    <aside className="prc-orders-details">
                                        <Card
                                            heading={`Pedido ${selectedOrder.id}`}
                                            description="Información detallada del pedido."
                                        >
                                            <div className="prc-orders-details-content">

                                                <h3>Cliente</h3>

                                                <p>
                                                    <strong>Nombre:</strong>{' '}
                                                    {selectedOrder.customerName}
                                                </p>

                                                <p>
                                                    <strong>Teléfono:</strong>{' '}
                                                    {selectedOrder.customerPhone}
                                                </p>

                                                <p>
                                                    <strong>Correo:</strong>{' '}
                                                    {selectedOrder.customerEmail ||
                                                        'No registrado'}
                                                </p>

                                                <h3>Producto</h3>

                                                <p>
                                                    <strong>Producto:</strong>{' '}
                                                    {selectedOrder.productName}
                                                </p>

                                                <p>
                                                    <strong>Cantidad:</strong>{' '}
                                                    {selectedOrder.quantity}
                                                </p>

                                                <h3>Personalización</h3>

                                                <p>
                                                    <strong>Sabor:</strong>{' '}
                                                    {selectedOrder.flavor}
                                                </p>

                                                <p>
                                                    <strong>Relleno:</strong>{' '}
                                                    {selectedOrder.filling ||
                                                        'No especificado'}
                                                </p>

                                                <p>
                                                    <strong>Tamaño:</strong>{' '}
                                                    {selectedOrder.size}
                                                </p>

                                                <p>
                                                    <strong>Decoración:</strong>{' '}
                                                    {selectedOrder.decoration}
                                                </p>

                                                <p>
                                                    <strong>Mensaje:</strong>{' '}
                                                    {selectedOrder.personalizedMessage ||
                                                        'Sin mensaje'}
                                                </p>

                                                <p>
                                                    <strong>Observaciones:</strong>{' '}
                                                    {selectedOrder.notes ||
                                                        'Sin observaciones'}
                                                </p>

                                                <h3>Entrega</h3>

                                                <p>
                                                    <strong>Modalidad:</strong>{' '}
                                                    {selectedOrder.deliveryMode === 'pickup'
                                                        ? 'Recogida en establecimiento'
                                                        : 'Entrega a domicilio'}
                                                </p>

                                                {selectedOrder.deliveryMode ===
                                                    'delivery' && (
                                                        <p>
                                                            <strong>Dirección:</strong>{' '}
                                                            {selectedOrder.deliveryAddress ||
                                                                'No especificada'}
                                                        </p>
                                                    )}

                                                <p>
                                                    <strong>Fecha:</strong>{' '}
                                                    {formatDate(
                                                        selectedOrder.deliveryDate
                                                    )}
                                                </p>

                                                <p>
                                                    <strong>Hora:</strong>{' '}
                                                    {selectedOrder.deliveryTime}
                                                </p>

                                                <p>
                                                    <strong>Pedido creado:</strong>{' '}
                                                    {formatDate(selectedOrder.createdAt)}
                                                </p>

                                                <h3>Seguimiento</h3>

                                                <Select
                                                    label="Estado del pedido"
                                                    value={selectedOrder.status}
                                                    disabled={savingStatus}
                                                    onChange={(event) => {
                                                        void changeOrderStatus(
                                                            selectedOrder.id,
                                                            event.target.value as OrderStatus
                                                        );
                                                    }}
                                                    helperText={
                                                        savingStatus
                                                            ? 'Guardando cambios...'
                                                            : 'El cambio se guardará en PostgreSQL.'
                                                    }
                                                >
                                                    {availableStatuses.map(
                                                        (orderStatus) => (
                                                            <option
                                                                key={orderStatus}
                                                                value={orderStatus}
                                                            >
                                                                {statusLabels[orderStatus]}
                                                            </option>
                                                        )
                                                    )}
                                                </Select>

                                            </div>
                                        </Card>
                                    </aside>
                                )}

                            </div>
                        )}
                    </>
                )}

            </div>
        </main>
    );
}

export default OrderManagementPage;