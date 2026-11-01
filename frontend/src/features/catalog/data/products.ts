import type { Product } from '../types/Product';

const placeholderImage = '/catalog/cupcake-ilustrativo.svg';

export const sampleProducts: Product[] = [
    {
        id: 'PROD-001',
        name: 'Cupcake de vainilla',
        description:
            'Cupcake de vainilla con cobertura cremosa y decoración especial.',
        category: 'Cupcakes',
        basePrice: 6.50,
        available: true,
        imageUrl: placeholderImage,
    },
    {
        id: 'PROD-002',
        name: 'Cupcake de chocolate',
        description:
            'Cupcake de chocolate con relleno y cobertura de cacao.',
        category: 'Cupcakes',
        basePrice: 7.00,
        available: true,
        imageUrl: placeholderImage,
    },
    {
        id: 'PROD-003',
        name: 'Cupcake Red Velvet',
        description:
            'Cupcake Red Velvet con cobertura suave de queso crema.',
        category: 'Cupcakes',
        basePrice: 8.00,
        available: true,
        imageUrl: placeholderImage,
    },
    {
        id: 'PROD-004',
        name: 'Cupcake de manjar',
        description:
            'Cupcake relleno de manjar con decoración artesanal.',
        category: 'Cupcakes',
        basePrice: 7.50,
        available: false,
        imageUrl: placeholderImage,
    },
    {
        id: 'PROD-005',
        name: 'Mini torta de chocolate',
        description:
            'Torta pequeña de chocolate con cobertura cremosa.',
        category: 'Tortas',
        basePrice: 35.00,
        available: true,
        imageUrl: placeholderImage,
    },
    {
        id: 'PROD-006',
        name: 'Box de cupcakes surtidos',
        description:
            'Caja de seis cupcakes con diferentes sabores y decoraciones.',
        category: 'Boxes',
        basePrice: 39.00,
        available: true,
        imageUrl: placeholderImage,
    },
];