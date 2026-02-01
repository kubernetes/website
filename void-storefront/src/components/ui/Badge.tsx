import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'popular' | 'value' | 'starter';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className,
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center font-medium rounded-full';

  const variants = {
    default: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    popular: 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-glow-sm',
    value: 'bg-gradient-to-r from-green-600 to-emerald-500 text-white',
    starter: 'bg-void-surface-light text-gray-300 border border-void-border',
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}

export default Badge;
