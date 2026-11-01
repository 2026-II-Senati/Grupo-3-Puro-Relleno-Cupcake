import { useMemo, useState } from 'react';

import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import Alert from '../../components/Alert/Alert';

import ProductCard from './components/ProductCard';

import type { Product } from './types/Product';

import './ProductCatalogPage.css';

type CatalogStatus = 'ready' | 'loading' | 'error';

interface ProductCatalogPageProps {
    products: Product[];
    status?: CatalogStatus;
}

function normalizeText(text: string): string {
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('es-PE')
        .trim();
}

function ProductCatalogPage({
                                products,
                                status = 'ready',
                            }: ProductCatalogPageProps) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const categories = useMemo(() => {
        return [...new Set(products.map((product) => product.category))]
            .sort((a, b) => a.localeCompare(b, 'es'));
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch = normalizeText(product.name).includes(
                normalizeText(search)
            );

            const matchesCategory =
                selectedCategory === '' ||
                product.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [products, search, selectedCategory]);

    return (
        <main className="prc-catalog-page">
            <div className="prc-catalog-container">

                <header className="prc-catalog-header">
          <span className="prc-catalog-label">
            Puro Relleno Cupcake
          </span>

                    <h1>Catálogo de productos</h1>

                    <p>
                        Descubre nuestros productos y explora las
                        diferentes opciones disponibles.
                    </p>
                </header>

                {status === 'loading' && (
                    <div className="prc-catalog-status" role="status">
                        <p>Cargando productos...</p>
                    </div>
                )}

                {status === 'error' && (
                    <Alert
                        variant="error"
                        title="No se pudo cargar el catálogo"
                    >
                        Ocurrió un problema al obtener los productos.
                        Inténtalo nuevamente más tarde.
                    </Alert>
                )}

                {status === 'ready' && (
                    <>
                        <section
                            className="prc-catalog-filters"
                            aria-label="Filtros del catálogo"
                        >
                            <Input
                                label="Buscar producto"
                                type="search"
                                placeholder="Buscar por nombre..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                            />

                            <Select
                                label="Categoría"
                                value={selectedCategory}
                                onChange={(event) =>
                                    setSelectedCategory(event.target.value)
                                }
                            >
                                <option value="">
                                    Todas las categorías
                                </option>

                                {categories.map((category) => (
                                    <option
                                        key={category}
                                        value={category}
                                    >
                                        {category}
                                    </option>
                                ))}
                            </Select>
                        </section>

                        <div
                            className="prc-catalog-results"
                            role="status"
                        >
                            {filteredProducts.length === 1
                                ? '1 producto encontrado'
                                : `${filteredProducts.length} productos encontrados`}
                        </div>

                        {filteredProducts.length > 0 ? (
                            <section
                                className="prc-catalog-grid"
                                aria-label="Productos del catálogo"
                            >
                                {filteredProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                    />
                                ))}
                            </section>
                        ) : (
                            <div className="prc-catalog-empty">
                                <h2>No encontramos productos</h2>

                                <p>
                                    Prueba con otro nombre o selecciona
                                    una categoría diferente.
                                </p>
                            </div>
                        )}
                    </>
                )}

            </div>
        </main>
    );
}

export default ProductCatalogPage;