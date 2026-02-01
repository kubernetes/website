'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { Card, CardContent, Badge, Button } from '@/components/ui';
import { BuyButton } from './BuyButton';
import { ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export function ProductCard({ product, featured = false }: ProductCardProps) {
  const badgeVariant =
    product.badge === 'Popular'
      ? 'popular'
      : product.badge === 'Best Value'
      ? 'value'
      : 'starter';

  const isPopular = product.badge === 'Popular';

  return (
    <Card
      hover
      glow={isPopular}
      className={cn(
        'relative flex flex-col h-full',
        isPopular && 'border-purple-500/50',
        featured && 'md:scale-105 z-10'
      )}
    >
      {/* Popular tag */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <Badge variant="popular">Most Popular</Badge>
        </div>
      )}

      <CardContent className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="mb-4">
          <Badge variant={badgeVariant} size="sm" className="mb-3">
            {product.badge}
          </Badge>
          <h3 className="text-xl font-bold text-white mb-1">{product.name}</h3>
          <p className="text-gray-400 text-sm">{product.descriptionShort}</p>
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">
              {product.priceLabel}
            </span>
            <span className="text-gray-500 text-sm">
              / {product.durationMonths} {product.durationMonths === 1 ? 'month' : 'months'}
            </span>
          </div>
          {product.durationMonths > 1 && (
            <p className="text-purple-400 text-xs mt-1">
              ${(product.priceValue / product.durationMonths).toFixed(2)}/month
            </p>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-2 mb-8 flex-grow">
          {product.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
              <Check className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* Stock Status */}
        {!product.inStock && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30">
            <p className="text-red-400 text-sm text-center">
              Currently out of stock
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3 mt-auto">
          <BuyButton
            product={product}
            variant={isPopular ? 'primary' : 'secondary'}
            className="w-full"
          />
          <Link href={`/products/${product.slug}`} className="block">
            <Button
              variant="ghost"
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProductCard;
