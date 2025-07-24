import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  children,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 focus:ring-cyan-500 shadow-lg hover:shadow-cyan-500/25',
    secondary: 'bg-gray-800 text-cyan-400 border border-cyan-400/30 hover:bg-cyan-400/10 hover:border-cyan-400 focus:ring-cyan-500',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-400 hover:to-pink-400 focus:ring-red-500 shadow-lg hover:shadow-red-500/25',
    ghost: 'text-gray-400 hover:text-cyan-400 hover:bg-gray-800 focus:ring-gray-500',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm space-x-1',
    md: 'px-4 py-2 text-sm space-x-2',
    lg: 'px-6 py-3 text-base space-x-2',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {Icon && <Icon className={size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} />}
      <span>{children}</span>
    </button>
  );
};

export default Button;