import React from 'react';

interface InputProps {
  label?: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  multiline = false,
  rows = 3,
  min,
  max,
  step,
  className = '',
  error,
}) => {
  const baseClasses = `
    w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
    transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
    hover:border-cyan-500/50
  `;

  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : '';

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      {multiline ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          className={`${baseClasses} ${errorClasses} ${className} resize-none`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className={`${baseClasses} ${errorClasses} ${className}`}
        />
      )}
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
};

export default Input;