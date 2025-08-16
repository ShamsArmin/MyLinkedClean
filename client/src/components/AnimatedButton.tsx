import React, { ButtonHTMLAttributes } from 'react';

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  animation?: 'pulse' | 'wiggle' | 'pop' | 'none';
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  animation = 'pulse',
  className = '',
  ...props
}) => {
  // Base styles
  const baseStyles = "font-medium rounded-md transition-all";
  
  // Size styles
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };
  
  // Variant styles
  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
  };
  
  // Animation styles
  const animationStyles = {
    pulse: "pulse-animation",
    wiggle: "wiggle-animation",
    pop: "pop-animation",
    none: ""
  };
  
  // Loading indicator
  const renderLoadingIndicator = () => (
    <svg 
      className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
  
  // Combine all styles
  const buttonClasses = `
    ${baseStyles}
    ${sizeStyles[size]}
    ${variantStyles[variant]}
    ${animationStyles[animation]}
    ${className}
    ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}
    button-primary
  `;
  
  return (
    <button 
      className={buttonClasses} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && renderLoadingIndicator()}
      {children}
    </button>
  );
};

export default AnimatedButton;