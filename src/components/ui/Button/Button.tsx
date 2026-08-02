import React from 'react';
import './Button.scss';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = 'secondary', className = '', ...props }: ButtonProps) {
  const classes = ['ui-button', variant === 'primary' ? 'primary-btn' : variant === 'danger' ? 'remove-btn' : 'secondary-btn', className]
    .filter(Boolean)
    .join(' ');

  return <button className={classes} {...props} />;
}
