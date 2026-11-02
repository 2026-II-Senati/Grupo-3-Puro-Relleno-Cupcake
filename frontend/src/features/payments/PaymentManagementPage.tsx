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
    initialOrders: PaymentOrder[];
    status?: PageStatus;
}

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
    return new Date(`${value}T12:00:00`).toLocaleDateString(
        'es-PE'
    );
}

export default function PaymentManagementPage({
                                                  initialOrders,
                                                  status = 'ready',
                                              }: PaymentManagementPageProps) {
    // Estado local exclusivo de la demostración.
    // La futura integración deberá obtener y actualizar
    // esta información mediante la API REST.

    const [orders, setOrders] = useState<PaymentOrder[]>(
        () =>
            initialOrders.map((order) => ({
                ...order,
                payments: [...order.payments],
            }))
    );

    const [search, setSearch] = useState('');

    const [selectedOrderId, setSelectedOrderId] = useState<
        string | null
    >(initialOrders[0]?.id ?? null);

    const [demoMessage, setDemoMessage] = useState<
        string | null
    >(null);

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

    function simulatePayment(
        orderId: string,
        payment: PaymentDraft
    ) {
        const currentOrder = orders.find(
            (order) => order.id === orderId
        );

        if (!currentOrder) {
            return;
        }

        const totals = calculatePaymentTotals(currentOrder);

        if (
            payment.amountCents <= 0 ||
            payment.amountCents > totals.balanceCents
        ) {
            return;
        }

        const demoMovement = {
            ...payment,
            id: `DEMO-${orderId}-${Date.now()}`,
        };

        setOrders((previous) =>
            previous.map((order) =>
                order.id === orderId
                    ? {
                        ...order,
                        payments: [
                            ...order.payments,
                            demoMovement,
                        ],
                    }
                    : order
            )
        );

        setDemoMessage(
            `Se añadió un movimiento de prueba de ${formatSoles(
                payment.amountCents
            )} al pedido ${orderId}. No se registró ningún pago real.`
        );
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
                        Consulta importes, adelantos, saldos
                        pendientes e historial de pagos por pedido.
                    </p>
                </header>

                <Alert
                    variant="info"
                    title="Módulo de demostración"
                >
                    Todos los importes y movimientos mostrados
                    son ficticios. Esta pantalla no está conectada
                    a PostgreSQL ni procesa pagos reales.
                </Alert>

                {demoMessage && (
                    <div className="prc-payments-notice">
                        <Alert
                            variant="warning"
                            title="Movimiento simulado"
                        >
                            {demoMessage} Los cambios desaparecerán
                            cuando recargues la página.
                        </Alert>
                    </div>
                )}

                {status === 'loading' && (
                    <div
                        className="prc-payments-feedback"
                        role="status"
                    >
                        Cargando información de pagos...
                    </div>
                )}

                {status === 'error' && (
                    <div className="prc-payments-feedback">
                        <Alert
                            variant="error"
                            title="Error al cargar los pagos"
                        >
                            No fue posible obtener la información
                            de los pedidos.
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
                                    setDemoMessage(null);
                                }}
                            />
                        </section>

                        {filteredOrders.length === 0 ? (
                            <div className="prc-payments-empty">
                                <h2>No encontramos pedidos</h2>

                                <p>
                                    Prueba con otro identificador
                                    o nombre de cliente.
                                </p>
                            </div>
                        ) : (
                            <div className="prc-payments-layout">
                                <section
                                    className="prc-payments-list"
                                    aria-label="Pedidos disponibles"
                                >
                                    <h2>
                                        Pedidos ({filteredOrders.length})
                                    </h2>

                                    <div className="prc-payments-order-list">
                                        {filteredOrders.map((order) => {
                                            const totals =
                                                calculatePaymentTotals(order);

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
                                                        setSelectedOrderId(order.id);
                                                        setDemoMessage(null);
                                                    }}
                                                >
                          <span className="prc-payment-order-top">
                            <strong>{order.id}</strong>

                            <Badge
                                variant={
                                    badgeVariants[totals.status]
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
                                        <PaymentSummary order={selectedOrder} />

                                        <Card
                                            heading="Historial de pagos"
                                            description="Movimientos ficticios del pedido seleccionado."
                                        >
                                            {selectedOrder.payments.length === 0 ? (
                                                <p className="prc-payment-no-history">
                                                    Este pedido todavía no tiene
                                                    movimientos de pago de prueba.
                                                </p>
                                            ) : (
                                                <div className="prc-payment-table-scroll">
                                                    <table className="prc-payment-table">
                                                        <thead>
                                                        <tr>
                                                            <th scope="col">Fecha</th>
                                                            <th scope="col">Importe</th>
                                                            <th scope="col">Medio</th>
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
                                                                <tr key={payment.id}>
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
                                                Según los datos ficticios,
                                                este pedido no tiene saldo pendiente.
                                                No se pueden preparar pagos
                                                adicionales.
                                            </Alert>
                                        ) : (
                                            <PaymentForm
                                                key={selectedOrder.id}
                                                balanceCents={
                                                    calculatePaymentTotals(
                                                        selectedOrder
                                                    ).balanceCents
                                                }
                                                onSimulatePayment={(payment) =>
                                                    simulatePayment(
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