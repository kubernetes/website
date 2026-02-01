'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/types';
import { BuyButton } from '@/components/products';
import { useToast } from '@/components/ui';

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const searchParams = useSearchParams();
  const { addToast } = useToast();

  // Check for checkout success
  useEffect(() => {
    const checkoutStatus = searchParams.get('checkout');
    if (checkoutStatus === 'success') {
      addToast({
        type: 'success',
        title: 'Thank you for your purchase!',
        message: 'Check your email for delivery details.',
        duration: 10000,
      });

      // Clean URL
      const url = new URL(window.location.href);
      url.searchParams.delete('checkout');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams, addToast]);

  return (
    <div className="space-y-4">
      <BuyButton
        product={product}
        variant="primary"
        size="lg"
        className="w-full md:w-auto md:min-w-[200px]"
      />

      {!product.inStock && (
        <p className="text-red-400 text-sm">
          This product is currently out of stock. Please check back later.
        </p>
      )}
    </div>
  );
}

export default ProductDetails;
