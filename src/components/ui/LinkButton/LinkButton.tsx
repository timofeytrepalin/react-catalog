import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import './LinkButton.scss';

export type LinkButtonVariant = 'primary' | 'secondary' | 'brand' | 'cart';

interface LinkButtonProps extends LinkProps {
  variant?: LinkButtonVariant;
}

export function LinkButton({ variant = 'secondary', className = '', ...props }: LinkButtonProps) {
  const classes = [
    'ui-link',
    variant === 'primary' ? 'primary-btn' : variant === 'brand' ? 'brand' : variant === 'cart' ? 'cart-pill' : 'secondary-btn',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <Link className={classes} {...props} />;
}
