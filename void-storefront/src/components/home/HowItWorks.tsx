import React from 'react';
import { storeConfig } from '@/config/store';

export function HowItWorks() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Getting started with Void is simple. Follow these three easy steps.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {storeConfig.howItWorks.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line */}
              {index < storeConfig.howItWorks.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+60px)] w-[calc(100%-60px)] h-[2px] bg-gradient-to-r from-purple-500/50 to-transparent" />
              )}

              <div className="text-center">
                {/* Step Number */}
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 text-white text-2xl font-bold mb-6 shadow-glow">
                  {step.step}
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-purple-500/50 blur-xl opacity-50" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
