'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200',
      'rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-void-bg',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none'
    );

    const variants = {
      primary: cn(
        'bg-gradient-to-r from-purple-600 to-purple-500 text-white',
        'hover:from-purple-500 hover:to-purple-400 hover:shadow-glow',
        'active:from-purple-700 active:to-purple-600'
      ),
      secondary: cn(
        'bg-void-surface border border-void-border text-gray-100',
        'hover:border-purple-500/50 hover:bg-void-surface-light hover:text-white',
        'active:bg-void-bg'
      ),
      ghost: cn(
        'bg-transparent border border-purple-500/30 text-purple-400',
        'hover:bg-purple-500/10 hover:border-purple-500/50 hover:text-purple-300',
        'active:bg-purple-500/20'
      ),
      danger: cn(
        'bg-red-600 text-white',
        'hover:bg-red-500 hover:shadow-lg',
        'active:bg-red-700'
      ),
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-7 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
