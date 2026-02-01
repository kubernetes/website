'use client';

import React from 'react';
import Link from 'next/link';
import { storeConfig } from '@/config/store';
import { Card, CardContent, Badge, Button } from '@/components/ui';
import { ArrowRight } from 'lucide-react';
import { BuyButton } from '@/components/products/BuyButton';

export function ProductPreview() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Choose Your Plan
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Select the subscription that fits your needs. All plans include full access to features.
          </p>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {storeConfig.products.map((product, index) => {
            const isPopular = product.badge === 'Popular';

            return (
              <Card
                key={product.id}
                hover
                glow={isPopular}
                className={`relative ${isPopular ? 'border-purple-500/50 md:-translate-y-4' : ''}`}
              >
                {/* Popular indicator */}
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="popular">Most Popular</Badge>
                  </div>
                )}

                <CardContent className="p-6 lg:p-8">
                  {/* Badge */}
                  <div className="mb-4">
                    <Badge
                      variant={
                        product.badge === 'Popular'
                          ? 'popular'
                          : product.badge === 'Best Value'
                          ? 'value'
                          : 'starter'
                      }
                    >
                      {product.badge}
                    </Badge>
                  </div>

                  {/* Name & Duration */}
                  <h3 className="text-xl font-bold text-white mb-2">
                    {product.durationMonths} Month{product.durationMonths > 1 ? 's' : ''}
                  </h3>
                  <p className="text-gray-400 text-sm mb-6">
                    {product.descriptionShort}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">
                      {product.priceLabel}
                    </span>
                    <span className="text-gray-500 ml-2">
                      / {product.durationMonths} mo
                    </span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-8">
                    {product.features.slice(0, 3).map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                        <svg
                          className="w-4 h-4 text-purple-400 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Buttons */}
                  <div className="space-y-3">
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
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link href="/products">
            <Button variant="ghost" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ProductPreview;
