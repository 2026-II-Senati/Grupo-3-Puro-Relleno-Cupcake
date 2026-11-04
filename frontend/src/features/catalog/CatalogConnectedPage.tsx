import { useEffect, useState } from 'react';

import ProductCatalogPage from './ProductCatalogPage';

import type { Product } from './types/Product';

import {
    getAvailableProducts,
} from '../../services/productsApi';

type CatalogStatus = 'loading' | 'ready' | 'error';

export default function CatalogConnectedPage() {

    const [products, setProducts] = useState<Product[]>([]);

    const [status, setStatus] =
        useState<CatalogStatus>('loading');

    useEffect(() => {

        const controller = new AbortController();

        getAvailableProducts(controller.signal)
            .then((data) => {

                if (controller.signal.aborted) {
                    return;
                }

                setProducts(data);
                setStatus('ready');

            })
            .catch((error: unknown) => {

                if (controller.signal.aborted) {
                    return;
                }

                console.error(
                    'Error al cargar el catálogo:',
                    error
                );

                setStatus('error');
            });

        return () => {
            controller.abort();
        };

    }, []);

    return (
        <ProductCatalogPage
            products={products}
            status={status}
        />
    );
}