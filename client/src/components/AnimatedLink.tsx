import React, { AnchorHTMLAttributes } from 'react';

interface AnimatedLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'default' | 'button' | 'underline' | 'subtle';
  animation?: 'wiggle' | 'pulse' | 'pop' | 'none';
  size?: 'sm' | 'md' | 'lg';
  isExternal?: boolean;
}

export const AnimatedLink: React.FC<AnimatedLinkProps> = ({
  children,
  variant = 'default',
  animation = 'wiggle',
  size = 'md',
  isExternal = false,
  className = '',
  ...props
}) => {
  // Base styles
  const baseStyles = "inline-flex items-center transition-all duration-200";
  
  // Size styles
  const sizeStyles = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };
  
  // Variant styles
  const variantStyles = {
    default: "text-blue-600 hover:text-blue-800",
    button: "bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md",
    underline: "text-blue-600 hover:text-blue-800 border-b-2 border-blue-200 hover:border-blue-600",
    subtle: "text-gray-600 hover:text-blue-600"
  };
  
  // Animation styles
  const animationStyles = {
    wiggle: "wiggle-on-hover",
    pulse: "pulse-on-hover",
    pop: "pop-on-hover",
    none: ""
  };
  
  // External link props
  const externalProps = isExternal
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
  
  // Combine all styles
  const linkClasses = `
    ${baseStyles}
    ${sizeStyles[size]}
    ${variantStyles[variant]}
    ${animationStyles[animation]}
    ${className}
  `;
  
  // External link icon
  const externalLinkIcon = isExternal && (
    <svg 
      className="ml-1 w-4 h-4" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth="2" 
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
      />
    </svg>
  );
  
  return (
    <a 
      className={linkClasses} 
      {...externalProps}
      {...props}
    >
      {children}
      {externalLinkIcon}
    </a>
  );
};

export default AnimatedLink;