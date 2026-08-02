import React from 'react';
import './TextField.scss';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

export function TextField({ label, id, className = '', ...props }: TextFieldProps) {
  const inputId = id || props.name;

  return (
      <div className="ui-input-wrap">
        <input className="ui-input" id={inputId as string | undefined} {...props} />
      </div>
  );
}
