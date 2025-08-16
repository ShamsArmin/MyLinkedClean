import React, { InputHTMLAttributes, useState } from 'react';

interface AnimatedInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  animation?: 'borderPulse' | 'none';
  helperText?: string;
}

export const AnimatedInput: React.FC<AnimatedInputProps> = ({
  label,
  error,
  animation = 'borderPulse',
  helperText,
  className = '',
  id,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
  
  // Base styles
  const baseStyles = "w-full px-3 py-2 border rounded-md focus:outline-none transition-all duration-200";
  
  // Animation styles
  const animationStyles = {
    borderPulse: "input-animated",
    none: ""
  };
  
  // State-based styles
  const stateStyles = error
    ? "border-red-300 text-red-900 focus:border-red-500 bg-red-50 input-error"
    : isFocused
      ? "border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      : "border-gray-300 focus:border-blue-500";
  
  // Combine all styles
  const inputClasses = `
    ${baseStyles}
    ${stateStyles}
    ${animationStyles[animation]}
    ${className}
  `;
  
  return (
    <div className="mb-4 relative">
      <label 
        htmlFor={inputId} 
        className={`block text-sm font-medium mb-1 transition-all duration-200 ${
          error ? 'text-red-600' : 'text-gray-700'
        }`}
      >
        {label}
      </label>
      
      <input
        id={inputId}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={inputClasses}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...props}
      />
      
      {error && (
        <p 
          id={`${inputId}-error`} 
          className="mt-1 text-sm text-red-600 shake-animation"
        >
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p 
          id={`${inputId}-helper`} 
          className="mt-1 text-sm text-gray-500"
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

export default AnimatedInput;