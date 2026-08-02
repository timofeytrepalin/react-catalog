import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { useCart } from '../../context/CartContext';
import { Button, LinkButton } from '../../components/ui';
import { getProduct, getSizes } from '../../services/api';
import { Color, Product, Size } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import './ProductInfo.scss';

export default function ProductInfo() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedColorId, setSelectedColorId] = useState('');
  const [selectedSizeId, setSelectedSizeId] = useState('');
  const [imageIndex, setImageIndex] = useState(0);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let isActive = true;

    Promise.all([getProduct(id || ''), getSizes()])
      .then(([productData, sizeList]) => {
        if (!isActive) {return;}
        setProduct(productData);
        setSizes(sizeList);
        setLoading(false);
      })
      .catch(() => {
        if (!isActive) {return;}
        setError('Товар не найден.');
        setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [id]);

  useEffect(() => {
    if (!product || !sizes.length) {return;}

    const colorParam = searchParams.get('color');
    const matchedColor = product.colors.find((color) => String(color.id) === String(colorParam));
    const nextColorId = matchedColor ? String(matchedColor.id) : String(product.colors[0]?.id || '');

    setSelectedColorId((currentColor) => {
      if (currentColor && product.colors.some((color) => String(color.id) === String(currentColor))) {
        return currentColor;
      }
      return nextColorId;
    });
  }, [product, searchParams, sizes]);

  useEffect(() => {
    if (!product || !sizes.length) {return;}

    const currentColor = product.colors.find((color) => String(color.id) === String(selectedColorId)) || product.colors[0];
    const available = (currentColor?.sizes || [])
      .map((sizeId) => sizes.find((size) => String(size.id) === String(sizeId)))
      .filter((size): size is Size => Boolean(size));

    const sizeParam = searchParams.get('size');
    const nextSizeId = available.some((size) => String(size.id) === String(sizeParam))
      ? String(sizeParam)
      : available[0]
        ? String(available[0].id)
        : '';

    setSelectedSizeId(nextSizeId);
    setImageIndex(0);
  }, [product, searchParams, selectedColorId, sizes]);

  const selectedColor = useMemo<Color | null>(
    () => product?.colors?.find((color) => String(color.id) === String(selectedColorId)) || product?.colors?.[0] || null,
    [product, selectedColorId],
  );

  const availableSizes = useMemo<Size[]>(
    () =>
      (selectedColor?.sizes || [])
        .map((sizeId) => sizes.find((size) => String(size.id) === String(sizeId)))
        .filter((size): size is Size => Boolean(size)),
    [selectedColor, sizes],
  );

  const syncUrl = (colorId: string, sizeId: string) => {
    const params = new URLSearchParams(searchParams);
    if (colorId) {
      params.set('color', String(colorId));
    } else {
      params.delete('color');
    }

    if (sizeId) {
      params.set('size', String(sizeId));
    } else {
      params.delete('size');
    }

    setSearchParams(params, { replace: true });
  };

  const handleColorSelect = (colorId: number) => {
    setSelectedColorId(String(colorId));
    syncUrl(String(colorId), '');
  };

  const handleSizeSelect = (sizeId: number) => {
    setSelectedSizeId(String(sizeId));
    syncUrl(selectedColorId, String(sizeId));
  };

  const handleAddToCart = () => {
    if (!product || !selectedColor || !selectedSizeId) {
      setNotice('Сначала выберите цвет и доступный размер.');
      return;
    }

    const selectedSize = availableSizes.find((size) => String(size.id) === String(selectedSizeId));

    if (!selectedSize) {
      setNotice('Сначала выберите цвет и доступный размер.');
      return;
    }

    addItem(product, selectedColor, selectedSize);
    setNotice(`Добавлено: ${product.name}, ${selectedColor.name}, ${selectedSize.name}`);
  };

  if (loading) {
    return (
      <section className="page-state">
        <h1>Загрузка товара…</h1>
        <p>Пожалуйста, подождите.</p>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="page-state">
        <h1>Товар не найден</h1>
        <p>Вернитесь к каталогу и выберите другой товар.</p>
        <LinkButton variant="primary" to="/">
          Назад в каталог
        </LinkButton>
      </section>
    );
  }

  const images = selectedColor?.images || [];

  return (
    <section className="page">
      <div className="page-head">
        <div>
          <h1>{product.name}</h1>
          <p>{product.brand}</p>
        </div>
        <LinkButton to="/">
          Назад
        </LinkButton>
      </div>

      <div className="product-details">
        <div className="image-block">
          <img className="image-block__image" src={images[imageIndex] || '/images/1/black_front.png'} alt={product.name} />
          {images.length > 1 ? (
            <div className="image-block__actions">
              <Button
                variant="secondary"
                onClick={() => setImageIndex((currentIndex) => (currentIndex === 0 ? images.length - 1 : currentIndex - 1))}
              >
                ←
              </Button>
              <Button
                variant="secondary"
                onClick={() => setImageIndex((currentIndex) => (currentIndex === images.length - 1 ? 0 : currentIndex + 1))}
              >
                →
              </Button>
            </div>
          ) : null}
        </div>

        <div className="detail-content">
          <p className="product-description">{selectedColor?.description}</p>

          <div className="section-block">
            <h2>Цвет</h2>
            <div className="option-list">
              {product.colors.map((color) => (
                <Button
                  key={color.id}
                  className={`option-chip ${String(selectedColorId) === String(color.id) ? 'option-chip--active' : ''}`}
                  onClick={() => handleColorSelect(color.id)}
                >
                  {color.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="section-block">
            <h2>Размер</h2>
            <div className="option-list">
              {sizes.map((size) => {
                const isAvailable = (selectedColor?.sizes || []).includes(size.id);
                return (
                  <Button
                    key={size.id}
                    className={`option-chip ${String(selectedSizeId) === String(size.id) ? 'option-chip--active' : ''}`}
                    disabled={!isAvailable}
                    onClick={() => handleSizeSelect(size.id)}
                  >
                    {size.name}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="detail-footer">
            <div>
              <div className="price">{formatCurrency(Number(selectedColor?.price || 0))}</div>
              <p className="secondary-text">Цена за одну единицу</p>
            </div>
            <Button variant="primary" onClick={handleAddToCart}>
              Добавить в корзину
            </Button>
          </div>

          {notice ? <div className="notice">{notice}</div> : null}
        </div>
      </div>
    </section>
  );
}
