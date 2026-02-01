'use client';

import React from 'react';
import { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { cn } from '@/lib/utils';

interface ProductGridProps {
  products: Product[];
  columns?: 1 | 2 | 3;
  className?: string;
}

export function ProductGrid({ products, columns = 3, className }: ProductGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-lg">No products match your filters.</p>
        <p className="text-gray-500 text-sm mt-2">Try adjusting your criteria.</p>
      </div>
    );
  }

  return (
    <div className={cn('grid gap-6 lg:gap-8', gridCols[columns], className)}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          featured={product.badge === 'Popular'}
        />
      ))}
    </div>
  );
}

export default ProductGrid;
