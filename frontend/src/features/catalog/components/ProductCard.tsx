import Card from '../../../components/Card/Card';
import Badge from '../../../components/Badge/Badge';

import type { Product } from '../types/Product';

import './ProductCard.css';

interface ProductCardProps {
    product: Product;
}

const priceFormatter = new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
});

function ProductCard({ product }: ProductCardProps) {
    return (
        <article className="prc-product-card">
            <Card>
                <div className="prc-product-card__image">
                    <img
                        src={product.imageUrl}
                        alt={`Imagen ilustrativa de ${product.name}`}
                        loading="lazy"
                    />
                </div>

                <div className="prc-product-card__content">
          <span className="prc-product-card__category">
            {product.category}
          </span>

                    <h3 className="prc-product-card__title">
                        {product.name}
                    </h3>

                    <p className="prc-product-card__description">
                        {product.description}
                    </p>

                    <div className="prc-product-card__footer">
                        <div className="prc-product-card__price">
                            <span>Precio base</span>

                            <strong>
                                {priceFormatter.format(product.basePrice)}
                            </strong>
                        </div>

                        <Badge
                            variant={product.available ? 'success' : 'danger'}
                        >
                            {product.available
                                ? 'Disponible'
                                : 'No disponible'}
                        </Badge>
                    </div>
                </div>
            </Card>
        </article>
    );
}

export default ProductCard;