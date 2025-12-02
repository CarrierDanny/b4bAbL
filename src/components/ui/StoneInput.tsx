import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';

interface StoneInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

interface StoneTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const StoneInput = forwardRef<HTMLInputElement, StoneInputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block font-cinzel text-stone-700 text-sm mb-2 etched-text-light"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`stone-input w-full ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600 font-crimson">{error}</p>
        )}
      </div>
    );
  }
);

StoneInput.displayName = 'StoneInput';

export const StoneTextarea = forwardRef<HTMLTextAreaElement, StoneTextareaProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block font-cinzel text-stone-700 text-sm mb-2 etched-text-light"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`stone-input w-full resize-none ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600 font-crimson">{error}</p>
        )}
      </div>
    );
  }
);

StoneTextarea.displayName = 'StoneTextarea';

export default StoneInput;
