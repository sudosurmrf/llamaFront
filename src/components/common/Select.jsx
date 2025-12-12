import { forwardRef } from 'react';
import './Input.css';

const Select = forwardRef(({
  label,
  options = [],
  error,
  helperText,
  required = false,
  fullWidth = true,
  placeholder = 'Select an option',
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
      <select
        ref={ref}
        id={inputId}
        className={`select ${error ? 'input-error' : ''}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {(error || helperText) && (
        <span className={`input-helper ${error ? 'input-helper-error' : ''}`}>
          {error || helperText}
        </span>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
