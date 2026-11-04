import { useState } from 'react';

import Input from '../../components/Input/Input';
import Card from '../../components/Card/Card';
import Badge from '../../components/Badge/Badge';
import Alert from '../../components/Alert/Alert';

import PaymentSummary from './components/PaymentSummary';
import PaymentForm from './components/PaymentForm';

import {
    calculatePaymentTotals,
    formatSoles,
    paymentMethodLabels,
    paymentStatusLabels,
} from './types/Payment';

import type {
    PaymentDraft,
    PaymentOrder,
    PaymentStatus,
} from './types/Payment';

import './PaymentManagementPage.css';

type PageStatus = 'ready' | 'loading' | 'error';

interface PaymentManagementPageProps {
    orders: PaymentOrder[];
    status: PageStatus;

    onRegisterPayment: (
        orderId: string,
        payment: PaymentDraft
    ) => Promise<void>;
}

type Notice = {
    variant: 'success' | 'error';
    message: string;
};

const badgeVariants: Record<
    PaymentStatus,
    'warning' | 'info' | 'success'
> = {
    pending: 'warning',
    partial: 'info',
    paid: 'success',
};

function normalizeText(value: string): string {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function formatDate(value: string): string {
    return new Date(
        `${value}T12:00:00`
    ).toLocaleDateString('es-PE');
}

export default function PaymentManagementPage({
                                                  orders,
                                                  status,
                                                  onRegisterPayment,
                                              }: PaymentManagementPageProps) {
    const [search, setSearch] = useState('');

    const [selectedOrderId, setSelectedOrderId] =
        useState<string | null>(null);

    const [notice, setNotice] =
        useState<Notice | null>(null);

    const filteredOrders = orders.filter((order) => {
        const query = normalizeText(search);

        return (
            normalizeText(order.id).includes(query) ||
            normalizeText(order.customerName).includes(query)
        );
    });

    const selectedOrder =
        filteredOrders.find(
            (order) => order.id === selectedOrderId
        ) ?? filteredOrders[0];

    async function handlePayment(
        orderId: string,
        payment: PaymentDraft
    ): Promise<void> {
        setNotice(null);

        try {
            await onRegisterPayment(
                orderId,
                payment
            );

            setNotice({
                variant: 'success',
                message:
                    `Se registró un pago de ` +
                    `${formatSoles(payment.amountCents)} ` +
                    `para el pedido ${orderId}. ` +
                    `El movimiento fue guardado en PostgreSQL.`,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'No se pudo registrar el pago.';

            setNotice({
                variant: 'error',
                message:
                    `${message} ` +
                    'Antes de reintentar, comprueba el historial ' +
                    'para evitar registrar dos veces el mismo pago.',
            });

            throw error;
        }
    }

    return (
        <main className="prc-payments-page">
            <div className="prc-payments-container">

                <header className="prc-payments-header">
                    <span className="prc-payments-label">
                        Puro Relleno Cupcake
                    </span>

                    <h1>Control de pagos</h1>

                    <p>
                        Consulta importes, adelantos,
                        saldos pendientes e historial
                        de pagos por pedido.
                    </p>
                </header>

                {status === 'ready' && (
                    <Alert
                        variant="info"
                        title="Pagos conectados a PostgreSQL"
                    >
                        Los pedidos y movimientos mostrados
                        provienen de nuestra base de datos.
                        El registro de un pago actualiza
                        el historial y el saldo pendiente.
                    </Alert>
                )}

                {notice && (
                    <div className="prc-payments-notice">
                        <Alert
                            variant={notice.variant}
                            title={
                                notice.variant === 'success'
                                    ? 'Pago registrado'
                                    : 'Error al registrar el pago'
                            }
                        >
                            {notice.message}
                        </Alert>
                    </div>
                )}

                {status === 'loading' && (
                    <div
                        className="prc-payments-feedback"
                        role="status"
                    >
                        Cargando pedidos y pagos
                        desde PostgreSQL...
                    </div>
                )}

                {status === 'error' && (
                    <div className="prc-payments-feedback">
                        <Alert
                            variant="error"
                            title="Error al cargar los pagos"
                        >
                            No fue posible obtener la
                            información desde el servidor.
                            Comprueba que el backend esté
                            funcionando y que tu sesión
                            siga siendo válida.
                        </Alert>
                    </div>
                )}

                {status === 'ready' && (
                    <>
                        <section
                            className="prc-payments-search"
                            aria-label="Búsqueda de pedidos"
                        >
                            <Input
                                label="Buscar pedido"
                                type="search"
                                placeholder="Código o nombre del cliente"
                                value={search}
                                onChange={(event) => {
                                    setSearch(event.target.value);
                                    setNotice(null);
                                }}
                            />
                        </section>

                        {filteredOrders.length === 0 ? (
                            <div className="prc-payments-empty">
                                <h2>
                                    {orders.length === 0
                                        ? 'Todavía no hay pedidos'
                                        : 'No encontramos pedidos'}
                                </h2>

                                <p>
                                    {orders.length === 0
                                        ? 'Registra un pedido para comenzar a gestionar sus pagos.'
                                        : 'Prueba con otro identificador o nombre de cliente.'}
                                </p>
                            </div>
                        ) : (
                            <div className="prc-payments-layout">

                                <section
                                    className="prc-payments-list"
                                    aria-label="Pedidos disponibles"
                                >
                                    <h2>
                                        Pedidos (
                                        {filteredOrders.length}
                                        )
                                    </h2>

                                    <div className="prc-payments-order-list">
                                        {filteredOrders.map((order) => {
                                            const totals =
                                                calculatePaymentTotals(
                                                    order
                                                );

                                            const isSelected =
                                                selectedOrder?.id === order.id;

                                            return (
                                                <button
                                                    key={order.id}
                                                    type="button"
                                                    className={
                                                        isSelected
                                                            ? 'prc-payment-order prc-payment-order--selected'
                                                            : 'prc-payment-order'
                                                    }
                                                    aria-pressed={isSelected}
                                                    onClick={() => {
                                                        setSelectedOrderId(
                                                            order.id
                                                        );
                                                        setNotice(null);
                                                    }}
                                                >
                                                    <span className="prc-payment-order-top">
                                                        <strong>
                                                            Pedido {order.id}
                                                        </strong>

                                                        <Badge
                                                            variant={
                                                                badgeVariants[
                                                                    totals.status
                                                                    ]
                                                            }
                                                        >
                                                            {
                                                                paymentStatusLabels[
                                                                    totals.status
                                                                    ]
                                                            }
                                                        </Badge>
                                                    </span>

                                                    <span className="prc-payment-customer">
                                                        {order.customerName}
                                                    </span>

                                                    <span className="prc-payment-order-amounts">
                                                        <span>
                                                            Total:{' '}
                                                            <strong>
                                                                {formatSoles(
                                                                    totals.totalCents
                                                                )}
                                                            </strong>
                                                        </span>

                                                        <span>
                                                            Pendiente:{' '}
                                                            <strong>
                                                                {formatSoles(
                                                                    totals.balanceCents
                                                                )}
                                                            </strong>
                                                        </span>
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </section>

                                {selectedOrder && (
                                    <section
                                        className="prc-payments-detail"
                                        aria-label="Detalle económico del pedido"
                                    >
                                        <PaymentSummary
                                            order={selectedOrder}
                                        />

                                        <Card
                                            heading="Historial de pagos"
                                            description="Movimientos registrados en PostgreSQL."
                                        >
                                            {selectedOrder.payments.length === 0 ? (
                                                <p className="prc-payment-no-history">
                                                    Este pedido todavía
                                                    no tiene pagos registrados.
                                                </p>
                                            ) : (
                                                <div className="prc-payment-table-scroll">
                                                    <table className="prc-payment-table">
                                                        <thead>
                                                        <tr>
                                                            <th scope="col">
                                                                Fecha
                                                            </th>
                                                            <th scope="col">
                                                                Importe
                                                            </th>
                                                            <th scope="col">
                                                                Medio
                                                            </th>
                                                            <th scope="col">
                                                                Referencia
                                                            </th>
                                                        </tr>
                                                        </thead>

                                                        <tbody>
                                                        {[
                                                            ...selectedOrder.payments,
                                                        ]
                                                            .sort((a, b) =>
                                                                b.paymentDate.localeCompare(
                                                                    a.paymentDate
                                                                )
                                                            )
                                                            .map((payment) => (
                                                                <tr
                                                                    key={payment.id}
                                                                >
                                                                    <td>
                                                                        {formatDate(
                                                                            payment.paymentDate
                                                                        )}
                                                                    </td>

                                                                    <td>
                                                                        {formatSoles(
                                                                            payment.amountCents
                                                                        )}
                                                                    </td>

                                                                    <td>
                                                                        {
                                                                            paymentMethodLabels[
                                                                                payment.method
                                                                                ]
                                                                        }
                                                                    </td>

                                                                    <td>
                                                                        {payment.reference ||
                                                                            'Sin referencia'}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </Card>

                                        {calculatePaymentTotals(
                                            selectedOrder
                                        ).balanceCents === 0 ? (
                                            <Alert
                                                variant="success"
                                                title="Pedido completamente pagado"
                                            >
                                                Este pedido no tiene
                                                saldo pendiente.
                                                Los movimientos están
                                                registrados en PostgreSQL.
                                            </Alert>
                                        ) : (
                                            <PaymentForm
                                                key={selectedOrder.id}
                                                balanceCents={
                                                    calculatePaymentTotals(
                                                        selectedOrder
                                                    ).balanceCents
                                                }
                                                onRegisterPayment={(payment) =>
                                                    handlePayment(
                                                        selectedOrder.id,
                                                        payment
                                                    )
                                                }
                                            />
                                        )}
                                    </section>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}