import type { Product } from '../features/catalog/types/Product';

interface ApiProduct {
    id: number;
    name: string;
    description: string | null;
    category: string;
    basePrice: number | string;
    imageUrl: string | null;
    isAvailable: boolean;
}

const placeholderImage = '/catalog/cupcake-ilustrativo.svg';

export async function getAvailableProducts(
    signal?: AbortSignal
): Promise<Product[]> {

    const response = await fetch('/api/v1/products', {
        method: 'GET',
        signal,
    });

    if (!response.ok) {
        throw new Error(
            `Error al consultar productos: ${response.status}`
        );
    }

    const data: unknown = await response.json();

    if (!Array.isArray(data)) {
        throw new Error(
            'El servidor devolvió un catálogo inválido.'
        );
    }

    const products = data as ApiProduct[];

    return products.map((product) => ({
        id: String(product.id),

        name: product.name,

        description: product.description ?? '',

        category: product.category,

        basePrice: Number(product.basePrice),

        available: product.isAvailable,

        imageUrl: product.imageUrl || placeholderImage,
    }));
}