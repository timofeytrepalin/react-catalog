import React from 'react';

import { useCart } from '../../context/CartContext';
import { LinkButton } from '../ui';
import { formatCurrency } from '../../utils/formatters';
import './Layout.scss';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { totalItems, totalAmount } = useCart();

  return (
    <div className="app-shell">
      <header className="topbar">
        <LinkButton variant="brand" to="/">
          Каталог товаров
        </LinkButton>

        <LinkButton variant="cart" to="/cart">
          <span>Корзина</span>
          <strong>
            {totalItems} · {formatCurrency(totalAmount)}
          </strong>
        </LinkButton>
      </header>

      <main className="container">{children}</main>
    </div>
  );
}
