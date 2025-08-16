import React, { SVGProps } from 'react';

interface AnimatedIconProps {
  icon: React.FC<SVGProps<SVGSVGElement>>;
  animation?: 'spin' | 'pulse' | 'wiggle' | 'pop' | 'none';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
  onClick?: () => void;
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  icon: Icon,
  animation = 'pop',
  size = 'md',
  color = 'currentColor',
  className = '',
  onClick,
}) => {
  // Animation styles
  const animationStyles = {
    spin: "animate-spin",
    pulse: "pulse-on-hover",
    wiggle: "wiggle-on-hover",
    pop: "pop-on-hover",
    none: ""
  };
  
  // Size styles
  const sizeStyles = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  };
  
  // Combine all styles
  const iconClasses = `
    ${animationStyles[animation]}
    ${sizeStyles[size]}
    ${className}
    ${onClick ? 'cursor-pointer' : ''}
    transition-all duration-200
  `;
  
  return (
    <Icon 
      className={iconClasses} 
      color={color}
      onClick={onClick}
      style={{ 
        cursor: onClick ? 'pointer' : 'default',
        fill: color === 'currentColor' ? undefined : color
      }}
    />
  );
};

export default AnimatedIcon;