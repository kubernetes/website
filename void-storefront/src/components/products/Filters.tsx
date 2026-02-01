'use client';

import React from 'react';
import { Select, Button } from '@/components/ui';
import { SortOption, FilterState } from '@/types';
import { cn } from '@/lib/utils';
import { X, SlidersHorizontal } from 'lucide-react';

interface FiltersProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  className?: string;
}

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'duration', label: 'Duration' },
];

const durationOptions = [
  { value: 1, label: '1 Month' },
  { value: 3, label: '3 Months' },
  { value: 6, label: '6 Months' },
];

export function Filters({
  sortBy,
  onSortChange,
  filters,
  onFilterChange,
  onReset,
  className,
}: FiltersProps) {
  const toggleDuration = (duration: number) => {
    const newDurations = filters.duration.includes(duration)
      ? filters.duration.filter(d => d !== duration)
      : [...filters.duration, duration];
    onFilterChange({ ...filters, duration: newDurations });
  };

  const toggleInStock = () => {
    onFilterChange({ ...filters, inStockOnly: !filters.inStockOnly });
  };

  const hasActiveFilters =
    filters.duration.length > 0 ||
    filters.inStockOnly ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 10;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Mobile Filter Header */}
      <div className="flex items-center justify-between lg:hidden">
        <div className="flex items-center gap-2 text-gray-400">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="text-sm font-medium">Filters</span>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Sort */}
      <div>
        <Select
          label="Sort by"
          options={sortOptions}
          value={sortBy}
          onChange={(value) => onSortChange(value as SortOption)}
        />
      </div>

      {/* Duration Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Duration
        </label>
        <div className="flex flex-wrap gap-2">
          {durationOptions.map(option => (
            <button
              key={option.value}
              onClick={() => toggleDuration(option.value)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                'border focus:outline-none focus:ring-2 focus:ring-purple-500',
                filters.duration.includes(option.value)
                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                  : 'bg-void-surface border-void-border text-gray-400 hover:border-purple-500/30'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Availability Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Availability
        </label>
        <button
          onClick={toggleInStock}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            'border focus:outline-none focus:ring-2 focus:ring-purple-500 w-full',
            filters.inStockOnly
              ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
              : 'bg-void-surface border-void-border text-gray-400 hover:border-purple-500/30'
          )}
        >
          <div
            className={cn(
              'w-4 h-4 rounded border-2 flex items-center justify-center transition-colors',
              filters.inStockOnly
                ? 'bg-purple-500 border-purple-500'
                : 'border-gray-500'
            )}
          >
            {filters.inStockOnly && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          In Stock Only
        </button>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Price Range
        </label>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={filters.priceRange[1]}
                onChange={(e) =>
                  onFilterChange({
                    ...filters,
                    priceRange: [filters.priceRange[0], parseFloat(e.target.value)],
                  })
                }
                className="w-full h-2 bg-void-surface rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>${filters.priceRange[0].toFixed(2)}</span>
            <span>${filters.priceRange[1].toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <Button variant="ghost" onClick={onReset} className="w-full hidden lg:flex">
          <X className="w-4 h-4 mr-2" />
          Reset Filters
        </Button>
      )}
    </div>
  );
}

export default Filters;
