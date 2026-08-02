import { useEffect, useMemo, useState } from 'react';

import ProductCard from '../../components/ProductCard';
import { SelectField, TextField } from '../../components/ui';
import { getProducts } from '../../services/api';
import { Product } from '../../types';
import './ProductList.scss';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortOrder, setSortOrder] = useState('default');

  useEffect(() => {
    let isActive = true;

    getProducts()
      .then((productList) => {
        if (!isActive) {return;}
        setProducts(productList);
        setLoading(false);
      })
      .catch(() => {
        if (!isActive) {return;}
        setError('Не удалось загрузить товары.');
        setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    let result = [...products];

    if (normalizedSearch) {
      result = result.filter((product) => product.name.toLowerCase().includes(normalizedSearch));
    }

    if (onlyAvailable) {
      result = result.filter((product) => product.colors.some((color) => color.sizes.length > 0));
    }

    if (sortOrder === 'asc' || sortOrder === 'desc') {
      result.sort((left, right) => {
        const leftPrice = Math.min(...left.colors.map((color) => Number(color.price)));
        const rightPrice = Math.min(...right.colors.map((color) => Number(color.price)));
        return sortOrder === 'asc' ? leftPrice - rightPrice : rightPrice - leftPrice;
      });
    }

    return result;
  }, [onlyAvailable, products, search, sortOrder]);

  if (loading) {
    return (
      <section className="page-state">
        <h1>Загрузка товаров…</h1>
        <p>Пожалуйста, подождите.</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page-state">
        <h1>Что-то пошло не так</h1>
        <p>{error}</p>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="page-head">
        <div>
          <h1>Каталог товаров</h1>
        </div>
      </div>

      <div className="filters">
        <TextField
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Поиск..."
        />

        <label className="checkbox-row">
          <input type="checkbox" checked={onlyAvailable} onChange={(event) => setOnlyAvailable(event.target.checked)} />
          Только в наличии
        </label>

        <SelectField value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
          <option value="default">По умолчанию</option>
          <option value="asc">Цена ↑</option>
          <option value="desc">Цена ↓</option>
        </SelectField>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <h2>Товаров по вашему запросу нет</h2>
          <p>Попробуйте изменить фильтры или поисковую строку.</p>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
