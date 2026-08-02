import React from 'react';
import './SelectField.scss';

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: React.ReactNode;
}

export function SelectField({ label, id, className = '', ...props }: SelectFieldProps) {
  const selectId = id || props.name;

  return (
    <label className={['field', 'ui-field', className].filter(Boolean).join(' ')} htmlFor={selectId as string | undefined}>
      {label ? <span>{label}</span> : null}
      <div className="ui-select">
        <select id={selectId as string | undefined} {...props} />
      </div>
    </label>
  );
}
