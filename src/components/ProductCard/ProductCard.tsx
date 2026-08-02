import { Link } from 'react-router-dom';

import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import './ProductCard.scss';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const firstColor = product.colors[0] || { images: [] };
  const minPrice = product.colors.reduce(
    (lowest, color) => Math.min(lowest, Number(color.price)),
    Number.POSITIVE_INFINITY,
  );
  const hasStock = product.colors.some((color) => color.sizes.length > 0);

  return (
    <Link className="product-card" to={`/product/${product.id}`}>
      <img className="product-card__image" src={firstColor.images[0] || '/images/1/black_front.png'} alt={product.name} />

      <div className="product-card__body">
        <div className="product-card__row">
          <h3 className="product-card__title">{product.name}</h3>
          <span className={`tag ${hasStock ? 'tag--success' : 'tag--muted'}`}>
            {hasStock ? 'В наличии' : 'Под заказ'}
          </span>
        </div>

        <p className="product-card__brand">{product.brand}</p>

        <div className="product-card__footer">
          <span>Цвета: {product.colors.length}</span>
          <strong className="product-card__price">{formatCurrency(minPrice)}</strong>
        </div>
      </div>
    </Link>
  );
}