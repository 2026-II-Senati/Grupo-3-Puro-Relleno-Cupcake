import {
    useEffect,
    useState,
} from 'react';

import type {
    CSSProperties,
    FormEvent,
} from 'react';

import { useAuth } from '../features/auth/AuthProvider';

import { authorizedFetch } from '../services/authorizedFetch';

interface ProductRecord {
    id: number;
    name: string;
    description: string | null;
    category: string;
    basePrice: number | string;
    imageUrl: string | null;
    isAvailable: boolean;
}

interface ProductForm {
    name: string;
    description: string;
    category: string;
    basePrice: string;
    isAvailable: boolean;
}

const emptyForm: ProductForm = {
    name: '',
    description: '',
    category: '',
    basePrice: '',
    isAvailable: true,
};

const panelStyle: CSSProperties = {
    background: '#ffffff',
    border: '1px solid #f0d6e1',
    borderRadius: 14,
    padding: 24,
    boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
};

const fieldStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginBottom: 16,
    fontWeight: 600,
};

const inputStyle: CSSProperties = {
    width: '100%',
    padding: '11px 12px',
    border: '1px solid #d1d5db',
    borderRadius: 8,
    font: 'inherit',
    boxSizing: 'border-box',
};

const buttonStyle: CSSProperties = {
    padding: '11px 18px',
    background: '#db2777',
    border: 'none',
    borderRadius: 8,
    color: 'white',
    fontWeight: 700,
    cursor: 'pointer',
};

async function readResponse<T>(
    response: Response
): Promise<T> {
    const data: unknown = await response.json().catch(
        () => null
    );

    if (!response.ok) {
        let message = `Error HTTP ${response.status}`;

        if (
            data !== null &&
            typeof data === 'object' &&
            'message' in data &&
            typeof data.message === 'string'
        ) {
            message = data.message;
        }

        throw new Error(message);
    }

    return data as T;
}

export default function ProductAdminPage() {
    const { session } = useAuth();

    const [products, setProducts] =
        useState<ProductRecord[]>([]);

    const [selectedId, setSelectedId] =
        useState<number | null>(null);

    const [form, setForm] =
        useState<ProductForm>({ ...emptyForm });

    const [imageFile, setImageFile] =
        useState<File | null>(null);

    const [fichaTexto, setFichaTexto] = useState('');

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState('');

    const [message, setMessage] = useState('');

    const [imageVersion, setImageVersion] =
        useState(0);

    const isAdmin =
        session?.user.role.trim().toLowerCase() ===
        'admin';

    useEffect(() => {
        if (!isAdmin) {
            return;
        }

        let active = true;

        authorizedFetch('/api/v1/products')
            .then((response) =>
                readResponse<ProductRecord[]>(response)
            )
            .then((data) => {
                if (active) {
                    setProducts(data);
                }
            })
            .catch((err: unknown) => {
                if (active) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : 'No se pudieron cargar los productos.'
                    );
                }
            })
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [isAdmin]);

    if (!isAdmin) {
        return (
            <main style={{ padding: 32 }}>
                <h1>Acceso restringido</h1>

                <p>
                    Solo el administrador puede
                    gestionar los productos.
                </p>
            </main>
        );
    }

    function setField<K extends keyof ProductForm>(
        field: K,
        value: ProductForm[K]
    ) {
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));
    }

    function rellenarDesdeFicha() {
        setError('');
        setMessage('');

        try {
            const textoLimpio = fichaTexto
                .trim()
                .replace(/^```(?:json)?\s*/i, '')
                .replace(/\s*```$/, '');

            if (!textoLimpio) {
                throw new Error(
                    'Primero pega la ficha del producto.'
                );
            }

            const parsed: unknown = JSON.parse(textoLimpio);

            if (
                !parsed ||
                typeof parsed !== 'object' ||
                Array.isArray(parsed)
            ) {
                throw new Error(
                    'La ficha debe contener un producto válido.'
                );
            }

            const data = parsed as Record<string, unknown>;

            if (
                typeof data.name !== 'string' ||
                data.name.trim().length < 2
            ) {
                throw new Error(
                    'La ficha no contiene un nombre válido.'
                );
            }

            if (
                typeof data.category !== 'string' ||
                !data.category.trim()
            ) {
                throw new Error(
                    'La ficha no contiene una categoría.'
                );
            }

            const price = Number(data.basePrice);

            if (
                data.basePrice === undefined ||
                data.basePrice === null ||
                data.basePrice === '' ||
                !Number.isFinite(price) ||
                price < 0
            ) {
                throw new Error(
                    'La ficha no contiene un precio válido.'
                );
            }

            setForm({
                name: data.name.trim(),

                description:
                    typeof data.description === 'string'
                        ? data.description.trim()
                        : '',

                category: data.category.trim(),

                basePrice: String(price),

                isAvailable:
                    typeof data.isAvailable === 'boolean'
                        ? data.isAvailable
                        : true,
            });

            // Preparamos el formulario para un producto nuevo.
            setSelectedId(null);
            setImageFile(null);

            setMessage(
                '¡Formulario completado! Ahora selecciona la fotografía y registra el producto.'
            );

        } catch (err) {
            setError(
                err instanceof SyntaxError
                    ? 'La ficha no tiene un formato JSON válido.'
                    : err instanceof Error
                        ? err.message
                        : 'No se pudo interpretar la ficha.'
            );
        }
    }

    function resetForm() {
        setSelectedId(null);

        setForm({ ...emptyForm });

        setImageFile(null);

        setError('');

        setMessage('');
    }

    function editProduct(product: ProductRecord) {
        setSelectedId(product.id);

        setForm({
            name: product.name,
            description: product.description ?? '',
            category: product.category,
            basePrice: String(product.basePrice),
            isAvailable: product.isAvailable,
        });

        setImageFile(null);

        setError('');

        setMessage('');

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }

    async function reloadProducts(): Promise<void> {
        const response = await authorizedFetch(
            '/api/v1/products'
        );

        const data = await readResponse<
            ProductRecord[]
        >(response);

        setProducts(data);

        setImageVersion(Date.now());
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (saving) {
            return;
        }

        setError('');
        setMessage('');

        const name = form.name.trim();
        const category = form.category.trim();
        const description = form.description.trim();
        const priceText = form.basePrice.trim();

        if (name.length < 2 || name.length > 150) {
            setError(
                'El nombre debe tener entre 2 y 150 caracteres.'
            );
            return;
        }

        if (
            category.length < 2 ||
            category.length > 50
        ) {
            setError(
                'La categoría debe tener entre 2 y 50 caracteres.'
            );
            return;
        }

        if (!/^\d+(\.\d{1,2})?$/.test(priceText)) {
            setError(
                'Ingresa un precio válido con máximo dos decimales.'
            );
            return;
        }

        const price = Number(priceText);

        if (
            !Number.isFinite(price) ||
            price < 0 ||
            price > 99999999.99
        ) {
            setError('El precio está fuera del rango permitido.');
            return;
        }

        if (
            imageFile &&
            imageFile.size > 3 * 1024 * 1024
        ) {
            setError(
                'La imagen no puede superar los 3 MB.'
            );
            return;
        }

        setSaving(true);

        let savedId = selectedId;
        let productSaved = false;

        try {
            const body = {
                name,
                description: description || null,
                category,
                basePrice: price,
                isAvailable: form.isAvailable,
            };

            const endpoint = selectedId === null
                ? '/api/v1/products'
                : `/api/v1/products/${selectedId}`;

            const response = await authorizedFetch(
                endpoint,
                {
                    method:
                        selectedId === null
                            ? 'POST'
                            : 'PATCH',

                    headers: {
                        'Content-Type':
                            'application/json',
                    },

                    body: JSON.stringify(body),
                }
            );

            const result = await readResponse<
                Record<string, unknown>
            >(response);

            if (selectedId === null) {
                const nested =
                    result.product ?? result.data;

                const possibleId =
                    result.id ??
                    (
                        nested !== null &&
                        typeof nested === 'object' &&
                        'id' in nested
                            ? nested.id
                            : undefined
                    );

                const newId = Number(possibleId);

                if (
                    !Number.isSafeInteger(newId) ||
                    newId <= 0
                ) {
                    productSaved = true;

                    throw new Error(
                        'El producto fue registrado, pero la API no devolvió su ID. Revisa la lista antes de intentar registrarlo otra vez.'
                    );
                }

                savedId = newId;
            }

            productSaved = true;

            if (imageFile && savedId !== null) {
                const formData = new FormData();

                formData.append(
                    'image',
                    imageFile
                );

                const imageResponse =
                    await authorizedFetch(
                        `/api/v1/products/${savedId}/image`,
                        {
                            method: 'POST',
                            body: formData,
                        }
                    );

                await readResponse(imageResponse);
            }

            await reloadProducts();

            setMessage(
                selectedId === null
                    ? 'Producto registrado correctamente.'
                    : 'Producto actualizado correctamente.'
            );

            setSelectedId(null);

            setForm({ ...emptyForm });

            setImageFile(null);

        } catch (err) {
            setError(
                (
                    productSaved
                        ? 'Los datos del producto se guardaron, pero no se completó la operación: '
                        : ''
                ) +
                (
                    err instanceof Error
                        ? err.message
                        : 'Error al guardar el producto.'
                )
            );

            try {
                await reloadProducts();
            } catch {
                // Conservamos el error original.
            }

        } finally {
            setSaving(false);
        }
    }

    return (
        <main
            style={{
                maxWidth: 1200,
                margin: '0 auto',
                padding: '32px 20px',
            }}
        >
            <header style={{ marginBottom: 28 }}>
                <span style={{ color: '#db2777' }}>
                    Puro Relleno Cupcake
                </span>

                <h1>Administración de productos</h1>

                <p>
                    Registra productos, establece precios
                    y guarda sus fotografías en PostgreSQL.
                </p>
            </header>

            {error && (
                <p
                    role="alert"
                    style={{
                        padding: 16,
                        background: '#fee2e2',
                        color: '#991b1b',
                        borderRadius: 8,
                    }}
                >
                    {error}
                </p>
            )}

            {message && (
                <p
                    role="status"
                    style={{
                        padding: 16,
                        background: '#dcfce7',
                        color: '#166534',
                        borderRadius: 8,
                    }}
                >
                    {message}
                </p>
            )}

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns:
                        'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: 24,
                    alignItems: 'start',
                }}
            >
                <section style={panelStyle}>
                    <h2>
                        {selectedId === null
                            ? 'Registrar producto'
                            : `Editar producto #${selectedId}`}
                    </h2>

                    <div
                        style={{
                            background: '#fff1f5',
                            border: '2px dashed #ec4899',
                            borderRadius: 12,
                            padding: 18,
                            marginBottom: 24,
                        }}
                    >
                        <h3
                            style={{
                                color: '#be185d',
                                marginTop: 0,
                            }}
                        >
                            ✨ Rellenar automáticamente con IA
                        </h3>

                        <p style={{ fontSize: 14 }}>
                            Copia la ficha de producto que te preparó
                            ChatGPT y pégala aquí para completar todos
                            los campos del formulario.
                        </p>

                        <textarea
                            value={fichaTexto}
                            onChange={(event) => {
                                setFichaTexto(event.target.value);
                            }}
                            placeholder={`{
  "name": "Cupcake de chocolate",
  "description": "Delicioso cupcake...",
  "category": "Cupcakes",
  "basePrice": 8.50,
  "isAvailable": true
}`}
                            style={{
                                width: '100%',
                                minHeight: 170,
                                padding: 12,
                                borderRadius: 8,
                                border: '1px solid #f9a8d4',
                                fontFamily: 'monospace',
                                fontSize: 13,
                                resize: 'vertical',
                                boxSizing: 'border-box',
                            }}
                        />

                        <button
                            type="button"
                            onClick={rellenarDesdeFicha}
                            style={{
                                marginTop: 12,
                                background: '#db2777',
                                color: 'white',
                                border: 'none',
                                borderRadius: 8,
                                padding: '12px 18px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                width: '100%',
                            }}
                        >
                            ✨ Rellenar formulario automáticamente
                        </button>

                        <p
                            style={{
                                fontSize: 12,
                                color: '#6b7280',
                                marginBottom: 0,
                            }}
                        >
                            Después de rellenar, selecciona la imagen
                            y presiona Registrar producto.
                        </p>
                    </div>

                    <form onSubmit={(event) => {
                        void handleSubmit(event);
                    }}>
                        <label style={fieldStyle}>
                            Nombre del producto

                            <input
                                style={inputStyle}
                                required
                                maxLength={150}
                                value={form.name}
                                onChange={(e) =>
                                    setField(
                                        'name',
                                        e.target.value
                                    )
                                }
                                placeholder="Ej.: Cupcake de chocolate"
                            />
                        </label>

                        <label style={fieldStyle}>
                            Descripción

                            <textarea
                                style={{
                                    ...inputStyle,
                                    minHeight: 100,
                                }}
                                value={form.description}
                                onChange={(e) =>
                                    setField(
                                        'description',
                                        e.target.value
                                    )
                                }
                                placeholder="Ingredientes, presentación y características"
                            />
                        </label>

                        <label style={fieldStyle}>
                            Categoría

                            <input
                                style={inputStyle}
                                list="product-categories"
                                required
                                maxLength={50}
                                value={form.category}
                                onChange={(e) =>
                                    setField(
                                        'category',
                                        e.target.value
                                    )
                                }
                                placeholder="Ej.: Cupcakes"
                            />

                            <datalist id="product-categories">
                                <option value="Cupcakes" />
                                <option value="Tortas" />
                                <option value="Postres" />
                                <option value="Box personalizados" />
                            </datalist>
                        </label>

                        <label style={fieldStyle}>
                            Precio base (S/)

                            <input
                                style={inputStyle}
                                type="number"
                                min="0"
                                max="99999999.99"
                                step="0.01"
                                required
                                value={form.basePrice}
                                onChange={(e) =>
                                    setField(
                                        'basePrice',
                                        e.target.value
                                    )
                                }
                                placeholder="Ej.: 8.50"
                            />
                        </label>

                        <label
                            style={{
                                display: 'flex',
                                gap: 10,
                                marginBottom: 20,
                                alignItems: 'center',
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={form.isAvailable}
                                onChange={(e) =>
                                    setField(
                                        'isAvailable',
                                        e.target.checked
                                    )
                                }
                            />

                            Disponible para pedidos
                        </label>

                        <label style={fieldStyle}>
                            Fotografía del producto

                            <input
                                style={inputStyle}
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={(e) => {
                                    setImageFile(
                                        e.target.files?.[0] ??
                                        null
                                    );
                                }}
                            />
                        </label>

                        {imageFile && (
                            <p>
                                Imagen seleccionada:{' '}
                                <strong>
                                    {imageFile.name}
                                </strong>
                            </p>
                        )}

                        <p style={{ fontSize: 13 }}>
                            Formatos permitidos: JPG,
                            PNG y WebP. Máximo 3 MB.
                        </p>

                        <div
                            style={{
                                display: 'flex',
                                gap: 12,
                                flexWrap: 'wrap',
                            }}
                        >
                            <button
                                style={buttonStyle}
                                type="submit"
                                disabled={saving}
                            >
                                {saving
                                    ? 'Guardando...'
                                    : selectedId === null
                                        ? 'Registrar producto'
                                        : 'Guardar cambios'}
                            </button>

                            <button
                                type="button"
                                onClick={resetForm}
                                disabled={saving}
                                style={{
                                    ...buttonStyle,
                                    background: '#6b7280',
                                }}
                            >
                                Nuevo producto
                            </button>
                        </div>
                    </form>
                </section>

                <section style={panelStyle}>
                    <h2>
                        Productos registrados
                        {' '}({products.length})
                    </h2>

                    {loading && (
                        <p>Cargando productos...</p>
                    )}

                    {!loading && products.length === 0 && (
                        <p>
                            Todavía no hay productos registrados.
                        </p>
                    )}

                    <div
                        style={{
                            display: 'grid',
                            gap: 16,
                        }}
                    >
                        {products.map((product) => (
                            <article
                                key={product.id}
                                style={{
                                    display: 'flex',
                                    gap: 14,
                                    padding: 14,
                                    border:
                                        '1px solid #e5e7eb',
                                    borderRadius: 10,
                                }}
                            >
                                {product.imageUrl ? (
                                    <img
                                        src={
                                            `${product.imageUrl}` +
                                            `?v=${imageVersion}`
                                        }
                                        alt={product.name}
                                        style={{
                                            width: 100,
                                            height: 100,
                                            objectFit: 'cover',
                                            borderRadius: 8,
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: 100,
                                            height: 100,
                                            background: '#fce7f3',
                                            borderRadius: 8,
                                            display: 'grid',
                                            placeItems: 'center',
                                            textAlign: 'center',
                                            fontSize: 12,
                                        }}
                                    >
                                        Sin imagen
                                    </div>
                                )}

                                <div style={{ flex: 1 }}>
                                    <strong>
                                        {product.name}
                                    </strong>

                                    <p style={{
                                        margin: '6px 0',
                                    }}>
                                        {product.category}
                                    </p>

                                    <p style={{
                                        margin: '6px 0',
                                    }}>
                                        S/ {Number(
                                        product.basePrice
                                    ).toFixed(2)}
                                    </p>

                                    <p style={{
                                        margin: '6px 0',
                                    }}>
                                        {product.isAvailable
                                            ? 'Disponible'
                                            : 'No disponible'}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            editProduct(product)
                                        }
                                        style={{
                                            ...buttonStyle,
                                            padding: '7px 12px',
                                        }}
                                    >
                                        Editar
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}