'use client';

import React, { useState, useMemo } from 'react';
import { storeConfig } from '@/config/store';
import { ProductGrid, Filters } from '@/components/products';
import { SortOption, FilterState, Product } from '@/types';
import { ShieldCheck } from 'lucide-react';

const defaultFilters: FilterState = {
  duration: [],
  inStockOnly: false,
  priceRange: [0, 10],
};

export default function ProductsPage() {
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...storeConfig.products];

    // Apply duration filter
    if (filters.duration.length > 0) {
      result = result.filter(p => filters.duration.includes(p.durationMonths));
    }

    // Apply in-stock filter
    if (filters.inStockOnly) {
      result = result.filter(p => p.inStock);
    }

    // Apply price range filter
    result = result.filter(
      p => p.priceValue >= filters.priceRange[0] && p.priceValue <= filters.priceRange[1]
    );

    // Sort products
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.priceValue - b.priceValue);
        break;
      case 'price-high':
        result.sort((a, b) => b.priceValue - a.priceValue);
        break;
      case 'duration':
        result.sort((a, b) => a.durationMonths - b.durationMonths);
        break;
      case 'featured':
      default:
        // Keep original order (Popular in middle)
        result.sort((a, b) => {
          if (a.badge === 'Popular') return -1;
          if (b.badge === 'Popular') return 1;
          return 0;
        });
        break;
    }

    return result;
  }, [sortBy, filters]);

  const resetFilters = () => {
    setFilters(defaultFilters);
    setSortBy('featured');
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-purple-glow opacity-30" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-purple-glow opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Products
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Choose the subscription plan that works best for you. All plans include full access to all features.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-void-surface rounded-2xl border border-void-border p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Filters</h2>
              <Filters
                sortBy={sortBy}
                onSortChange={setSortBy}
                filters={filters}
                onFilterChange={setFilters}
                onReset={resetFilters}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filters Toggle & Sort */}
            <div className="lg:hidden mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-void-surface border border-void-border rounded-xl text-gray-300 hover:border-purple-500/50 transition-colors"
                >
                  <span className="font-medium">Filters</span>
                  {(filters.duration.length > 0 || filters.inStockOnly) && (
                    <span className="px-2 py-0.5 text-xs bg-purple-500/20 text-purple-400 rounded-full">
                      Active
                    </span>
                  )}
                </button>
              </div>

              {/* Mobile Filters Panel */}
              {mobileFiltersOpen && (
                <div className="mt-4 bg-void-surface rounded-2xl border border-void-border p-6">
                  <Filters
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    filters={filters}
                    onFilterChange={setFilters}
                    onReset={resetFilters}
                  />
                </div>
              )}
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-400 text-sm">
                Showing {filteredProducts.length} of {storeConfig.products.length} products
              </p>
            </div>

            {/* Product Grid */}
            <ProductGrid products={filteredProducts} columns={3} />

            {/* Trust Badge */}
            <div className="mt-12 flex items-center justify-center gap-3 text-gray-500">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
              <span className="text-sm">
                Secure checkout powered by{' '}
                <span className="text-purple-400 font-medium">SellAuth</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
