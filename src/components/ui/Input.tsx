import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className,
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 11)}`;

  return (
    <div className={cn('w-full space-y-1.5', className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-[11px] font-black text-gray-400 uppercase tracking-widest pl-1"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full px-4 py-3 bg-white border border-gray-200 rounded-xl transition-all duration-200',
          'placeholder:text-gray-400 text-[15px]',
          'focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 focus:bg-white',
          error ? 'border-red-500 focus:ring-red-500/5 focus:border-red-500' : '',
          'disabled:bg-gray-50 disabled:cursor-not-allowed'
        )}
        {...props}
      />
      {error && (
        <p className="text-[11px] font-bold text-red-500 pl-1 uppercase tracking-tight">
          {error}
        </p>
      )}
    </div>
  );
};
