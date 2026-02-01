'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button, useToast } from '@/components/ui';
import { Product } from '@/types';
import { ShoppingCart } from 'lucide-react';

interface BuyButtonProps {
  product: Product;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showIcon?: boolean;
}

export function BuyButton({
  product,
  variant = 'primary',
  size = 'md',
  className,
  showIcon = true,
}: BuyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();
  const searchParams = useSearchParams();

  const handleBuy = async () => {
    if (!product.inStock) {
      addToast({
        type: 'error',
        title: 'Out of Stock',
        message: 'This product is currently unavailable.',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Get optional query params
      const coupon = searchParams.get('coupon') || undefined;
      const affiliate = searchParams.get('aff') || undefined;

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: product.slug,
          quantity: 1,
          coupon,
          affiliate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to checkout
      window.location.assign(data.checkoutUrl);
    } catch (error) {
      console.error('Checkout error:', error);
      addToast({
        type: 'error',
        title: 'Checkout Failed',
        message: error instanceof Error ? error.message : 'Please try again.',
      });
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleBuy}
      isLoading={isLoading}
      disabled={!product.inStock}
      leftIcon={showIcon ? <ShoppingCart className="w-4 h-4" /> : undefined}
      className={className}
    >
      {product.inStock ? 'Buy Now' : 'Out of Stock'}
    </Button>
  );
}

export default BuyButton;
