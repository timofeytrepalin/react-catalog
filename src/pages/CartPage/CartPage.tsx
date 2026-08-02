import React, { useMemo, useState } from 'react';

import { useCart } from '../../context/CartContext';
import { Button, LinkButton, TextField } from '../../components/ui';
import { formatCurrency } from '../../utils/formatters';
import './CartPage.scss';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalAmount } = useCart();
  const [promoCode, setPromoCode] = useState('');

  const discount = useMemo(() => {
    const normalized = promoCode.trim().toUpperCase();
    if (normalized === 'SAVE10') {return 0.1;}
    if (normalized === 'SAVE20') {return 0.2;}
    if (normalized === 'SAVE50') {return 0.5;}
    return 0;
  }, [promoCode]);

  const discountAmount = totalAmount * discount;
  const finalAmount = totalAmount - discountAmount;

  if (items.length === 0) {
    return (
      <section className="page-state">
        <h1>Корзина пуста</h1>
        <p>Добавьте хотя бы один товар из каталога.</p>
        <LinkButton variant="primary" to="/">
          В каталог
        </LinkButton>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="page-head">
        <div>
          <h1>Корзина</h1>
          <p>Соберите итоговую сумму и примените промокод.</p>
        </div>
        <Button variant="secondary" onClick={clearCart}>
          Очистить корзину
        </Button>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div className="cart-item" key={item.key}>
              <img className="cart-item__image" src={item.image} alt={item.productName} />

              <div className="cart-item__info">
                <h3>{item.productName}</h3>
                <p>
                  {item.brand} · {item.colorName} · {item.sizeName}
                </p>
                <strong>{formatCurrency(item.price)}</strong>
              </div>

              <div className="quantity-controls">
                <Button onClick={() => updateQuantity(item.key, item.quantity - 1)}>-</Button>
                <span>{item.quantity}</span>
                <Button onClick={() => updateQuantity(item.key, item.quantity + 1)}>+</Button>
              </div>

              <div className="cart-item__price">
                <strong>{formatCurrency(item.price * item.quantity)}</strong>
              </div>

              <Button variant="danger" onClick={() => removeItem(item.key)}>
                Удалить
              </Button>
            </div>
          ))}
        </div>

        <aside className="summary-card">
          <h2>Итог</h2>
          <div className="summary-row">
            <span>Товары</span>
            <strong>{formatCurrency(totalAmount)}</strong>
          </div>

          <TextField label="Промокод" value={promoCode} onChange={(event) => setPromoCode(event.target.value)} placeholder="SAVE10" />

          <div className="summary-row">
            <span>Скидка</span>
            <strong>{discount > 0 ? `-${formatCurrency(discountAmount)}` : '—'}</strong>
          </div>

          <div className="summary-row summary-row--total">
            <span>К оплате</span>
            <strong>{formatCurrency(finalAmount)}</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}
