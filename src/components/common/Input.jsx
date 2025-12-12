import { forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(({
  label,
  type = 'text',
  error,
  helperText,
  required = false,
  fullWidth = true,
  className = '',
  ...props
}, ref) => {
  const inputId = props.id || props.name;

  return (
    <div className={`input-wrapper ${fullWidth ? 'full-width' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        className={`input ${error ? 'input-error' : ''}`}
        {...props}
      />
      {(error || helperText) && (
        <span className={`input-helper ${error ? 'input-helper-error' : ''}`}>
          {error || helperText}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
