import { useState } from 'react';
import type { FormEvent } from 'react';

import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import Card from '../../components/Card/Card';
import Alert from '../../components/Alert/Alert';

import { sampleProducts } from '../catalog/data/products';

import {
    initialOrderFormValues,
} from './types/OrderForm';

import type {
    DeliveryMode,
    OrderFormErrors,
    OrderFormValues,
} from './types/OrderForm';

import { validateOrderForm } from './utils/validateOrderForm';

import './CreateOrderPage.css';

const currencyFormatter = new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
});

function CreateOrderPage() {
    const [values, setValues] = useState<OrderFormValues>({
        ...initialOrderFormValues,
    });

    const [errors, setErrors] = useState<OrderFormErrors>({});
    const [formStatus, setFormStatus] = useState<
        'idle' | 'invalid' | 'preview'
    >('idle');

    const availableProducts = sampleProducts.filter(
        (product) => product.available
    );

    const selectedProduct = availableProducts.find(
        (product) => product.id === values.productId
    );

    const quantity = Number(values.quantity);

    const validQuantity =
        Number.isSafeInteger(quantity) && quantity > 0;

    const estimatedBasePrice =
        selectedProduct && validQuantity
            ? selectedProduct.basePrice * quantity
            : null;

    function updateField<K extends keyof OrderFormValues>(
        field: K,
        value: OrderFormValues[K]
    ) {
        setValues((previous) => ({
            ...previous,
            [field]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [field]: undefined,
        }));

        setFormStatus('idle');
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const validationErrors = validateOrderForm(values);

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            setFormStatus('invalid');
            return;
        }

        setFormStatus('preview');
    }

    function handleReset() {
        setValues({ ...initialOrderFormValues });
        setErrors({});
        setFormStatus('idle');
    }

    return (
        <main className="prc-order-page">
            <div className="prc-order-container">
                <header className="prc-order-header">
          <span className="prc-order-label">
            Puro Relleno Cupcake
          </span>

                    <h1>Registrar pedido personalizado</h1>

                    <p>
                        Completa los datos del cliente, selecciona
                        el producto y especifica los detalles del pedido.
                    </p>
                </header>

                <Alert variant="info" title="Formulario en desarrollo">
                    Esta pantalla permite preparar y revisar un pedido.
                    Los datos todavía no se guardan en el servidor.
                </Alert>

                <div className="prc-order-layout">
                    <form
                        className="prc-order-form"
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        <Card
                            heading="Datos del cliente"
                            description="Información de contacto del cliente."
                        >
                            <div className="prc-order-grid">
                                <Input
                                    label="Nombres"
                                    placeholder="Nombres del cliente"
                                    value={values.customerFirstName}
                                    error={errors.customerFirstName}
                                    required
                                    onChange={(event) =>
                                        updateField(
                                            'customerFirstName',
                                            event.target.value
                                        )
                                    }
                                />

                                <Input
                                    label="Apellidos"
                                    placeholder="Apellidos del cliente"
                                    value={values.customerLastName}
                                    error={errors.customerLastName}
                                    required
                                    onChange={(event) =>
                                        updateField(
                                            'customerLastName',
                                            event.target.value
                                        )
                                    }
                                />

                                <Input
                                    label="Teléfono"
                                    type="tel"
                                    placeholder="Número de contacto"
                                    value={values.phone}
                                    error={errors.phone}
                                    required
                                    onChange={(event) =>
                                        updateField('phone', event.target.value)
                                    }
                                />

                                <Input
                                    label="Correo electrónico (opcional)"
                                    type="email"
                                    placeholder="correo@ejemplo.com"
                                    value={values.email}
                                    error={errors.email}
                                    onChange={(event) =>
                                        updateField('email', event.target.value)
                                    }
                                />
                            </div>
                        </Card>

                        <Card
                            heading="Producto y cantidad"
                            description="Selecciona el producto que desea solicitar el cliente."
                        >
                            <div className="prc-order-grid">
                                <Select
                                    label="Producto"
                                    value={values.productId}
                                    error={errors.productId}
                                    required
                                    onChange={(event) =>
                                        updateField(
                                            'productId',
                                            event.target.value
                                        )
                                    }
                                >
                                    <option value="">
                                        Selecciona un producto
                                    </option>

                                    {availableProducts.map((product) => (
                                        <option
                                            key={product.id}
                                            value={product.id}
                                        >
                                            {product.name}
                                        </option>
                                    ))}
                                </Select>

                                <Input
                                    label="Cantidad"
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={values.quantity}
                                    error={errors.quantity}
                                    required
                                    onChange={(event) =>
                                        updateField(
                                            'quantity',
                                            event.target.value
                                        )
                                    }
                                />
                            </div>
                        </Card>

                        <Card
                            heading="Personalización"
                            description="Indica las preferencias para preparar el pedido."
                        >
                            <div className="prc-order-grid">
                                <Select
                                    label="Sabor"
                                    value={values.flavor}
                                    error={errors.flavor}
                                    required
                                    onChange={(event) =>
                                        updateField(
                                            'flavor',
                                            event.target.value
                                        )
                                    }
                                >
                                    <option value="">
                                        Selecciona un sabor
                                    </option>
                                    <option value="Vainilla">Vainilla</option>
                                    <option value="Chocolate">Chocolate</option>
                                    <option value="Fresa">Fresa</option>
                                    <option value="Red Velvet">Red Velvet</option>
                                </Select>

                                <Select
                                    label="Relleno (opcional)"
                                    value={values.filling}
                                    onChange={(event) =>
                                        updateField(
                                            'filling',
                                            event.target.value
                                        )
                                    }
                                >
                                    <option value="">
                                        Sin especificar
                                    </option>
                                    <option value="Manjar blanco">
                                        Manjar blanco
                                    </option>
                                    <option value="Chocolate">
                                        Chocolate
                                    </option>
                                    <option value="Fresa">
                                        Fresa
                                    </option>
                                </Select>

                                <Select
                                    label="Tamaño"
                                    value={values.size}
                                    error={errors.size}
                                    required
                                    onChange={(event) =>
                                        updateField(
                                            'size',
                                            event.target.value
                                        )
                                    }
                                >
                                    <option value="">
                                        Selecciona un tamaño
                                    </option>
                                    <option value="Individual">
                                        Individual
                                    </option>
                                    <option value="Mediano">
                                        Mediano
                                    </option>
                                    <option value="Grande">
                                        Grande
                                    </option>
                                </Select>

                                <Input
                                    label="Mensaje personalizado (opcional)"
                                    placeholder="Ej.: Feliz cumpleaños"
                                    maxLength={120}
                                    value={values.personalizedMessage}
                                    onChange={(event) =>
                                        updateField(
                                            'personalizedMessage',
                                            event.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="prc-order-textarea-field">
                                <label htmlFor="order-decoration">
                                    Decoración solicitada
                                </label>

                                <textarea
                                    id="order-decoration"
                                    className={
                                        errors.decoration
                                            ? 'prc-order-textarea prc-order-textarea--error'
                                            : 'prc-order-textarea'
                                    }
                                    placeholder="Describe colores, temática y decoración..."
                                    rows={3}
                                    value={values.decoration}
                                    aria-invalid={
                                        errors.decoration ? true : undefined
                                    }
                                    aria-describedby={
                                        errors.decoration
                                            ? 'order-decoration-error'
                                            : undefined
                                    }
                                    required
                                    onChange={(event) =>
                                        updateField(
                                            'decoration',
                                            event.target.value
                                        )
                                    }
                                />

                                {errors.decoration && (
                                    <p
                                        id="order-decoration-error"
                                        className="prc-order-error"
                                        role="alert"
                                    >
                                        {errors.decoration}
                                    </p>
                                )}
                            </div>

                            <div className="prc-order-textarea-field">
                                <label htmlFor="order-notes">
                                    Observaciones adicionales (opcional)
                                </label>

                                <textarea
                                    id="order-notes"
                                    className="prc-order-textarea"
                                    placeholder="Otras indicaciones para el pedido..."
                                    rows={3}
                                    value={values.notes}
                                    onChange={(event) =>
                                        updateField(
                                            'notes',
                                            event.target.value
                                        )
                                    }
                                />
                            </div>
                        </Card>

                        <Card
                            heading="Entrega del pedido"
                            description="Indica cómo y cuándo se entregará el pedido."
                        >
                            <div className="prc-order-grid">
                                <Select
                                    label="Modalidad de entrega"
                                    value={values.deliveryMode}
                                    onChange={(event) =>
                                        updateField(
                                            'deliveryMode',
                                            event.target.value as DeliveryMode
                                        )
                                    }
                                >
                                    <option value="pickup">
                                        Recogida en el establecimiento
                                    </option>

                                    <option value="delivery">
                                        Entrega a domicilio
                                    </option>
                                </Select>

                                <Input
                                    label="Fecha de entrega"
                                    type="date"
                                    value={values.deliveryDate}
                                    error={errors.deliveryDate}
                                    required
                                    onChange={(event) =>
                                        updateField(
                                            'deliveryDate',
                                            event.target.value
                                        )
                                    }
                                />

                                <Input
                                    label="Hora de entrega"
                                    type="time"
                                    value={values.deliveryTime}
                                    error={errors.deliveryTime}
                                    required
                                    onChange={(event) =>
                                        updateField(
                                            'deliveryTime',
                                            event.target.value
                                        )
                                    }
                                />

                                {values.deliveryMode === 'delivery' && (
                                    <Input
                                        label="Dirección de entrega"
                                        placeholder="Dirección del cliente"
                                        value={values.deliveryAddress}
                                        error={errors.deliveryAddress}
                                        required
                                        onChange={(event) =>
                                            updateField(
                                                'deliveryAddress',
                                                event.target.value
                                            )
                                        }
                                    />
                                )}
                            </div>
                        </Card>

                        {formStatus === 'invalid' && (
                            <Alert
                                variant="error"
                                title="Revisa los datos"
                            >
                                Algunos campos están incompletos o contienen
                                información inválida.
                            </Alert>
                        )}

                        {formStatus === 'preview' && (
                            <Alert
                                variant="info"
                                title="Formulario validado"
                            >
                                Los datos son válidos para esta demostración.
                                El pedido todavía no se ha registrado.
                            </Alert>
                        )}

                        <div className="prc-order-actions">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleReset}
                            >
                                Limpiar formulario
                            </Button>

                            <Button type="submit">
                                Revisar datos del pedido
                            </Button>
                        </div>
                    </form>

                    <aside
                        className="prc-order-summary"
                        aria-label="Resumen preliminar del pedido"
                    >
                        <Card
                            heading="Resumen del pedido"
                            description="Los datos se actualizan mientras completas el formulario."
                        >
                            <div className="prc-order-summary-content">
                                <div>
                                    <span>Producto</span>
                                    <strong>
                                        {selectedProduct?.name ?? 'Sin seleccionar'}
                                    </strong>
                                </div>

                                <div>
                                    <span>Cantidad</span>
                                    <strong>
                                        {validQuantity ? quantity : 'Sin definir'}
                                    </strong>
                                </div>

                                <div>
                                    <span>Sabor</span>
                                    <strong>{values.flavor || 'Sin seleccionar'}</strong>
                                </div>

                                <div>
                                    <span>Entrega</span>
                                    <strong>
                                        {values.deliveryMode === 'pickup'
                                            ? 'Recogida'
                                            : 'A domicilio'}
                                    </strong>
                                </div>

                                <div>
                                    <span>Fecha</span>
                                    <strong>
                                        {values.deliveryDate || 'Sin definir'}
                                    </strong>
                                </div>

                                <div className="prc-order-summary-total">
                                    <span>Subtotal base referencial</span>

                                    <strong>
                                        {estimatedBasePrice === null
                                            ? 'Por calcular'
                                            : currencyFormatter.format(
                                                estimatedBasePrice
                                            )}
                                    </strong>
                                </div>
                            </div>

                            <p className="prc-order-summary-note">
                                El subtotal es ilustrativo. No incluye
                                personalización, entrega ni otros posibles
                                ajustes de precio.
                            </p>

                            <p className="prc-order-summary-note">
                                Ningún dato se guardará hasta implementar
                                la integración con el backend.
                            </p>
                        </Card>
                    </aside>
                </div>
            </div>
        </main>
    );
}

export default CreateOrderPage;