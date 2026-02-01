'use client';

import React, { useState } from 'react';
import { storeConfig } from '@/config/store';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Got questions? We&apos;ve got answers. If you can&apos;t find what you&apos;re looking for, reach out to our support team.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {storeConfig.faq.map((item, index) => (
            <div
              key={index}
              className={cn(
                'rounded-2xl border transition-all duration-300',
                openIndex === index
                  ? 'bg-void-surface border-purple-500/50'
                  : 'bg-void-surface/50 border-void-border hover:border-purple-500/30'
              )}
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex items-center justify-between p-5 text-left focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-void-bg rounded-2xl"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="text-white font-medium pr-4">
                  {item.question}
                </span>
                <ChevronDown
                  className={cn(
                    'w-5 h-5 text-purple-400 flex-shrink-0 transition-transform duration-300',
                    openIndex === index && 'rotate-180'
                  )}
                />
              </button>

              <div
                id={`faq-answer-${index}`}
                className={cn(
                  'overflow-hidden transition-all duration-300',
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                )}
              >
                <div className="px-5 pb-5 pt-0">
                  <p className="text-gray-400 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
