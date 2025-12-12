import { forwardRef } from 'react';
import './Input.css';

const TextArea = forwardRef(({
  label,
  error,
  helperText,
  required = false,
  fullWidth = true,
  rows = 4,
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
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={`textarea ${error ? 'input-error' : ''}`}
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

TextArea.displayName = 'TextArea';

export default TextArea;
