import React from 'react';

import { LinkButton } from '../../components/ui';

export default function NotFound() {
  return (
    <section className="page-state">
      <h1>Страница не найдена</h1>
      <p>Запрашиваемая страница отсутствует.</p>
      <LinkButton variant="primary" to="/">
        На главную
      </LinkButton>
    </section>
  );
}
