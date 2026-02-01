import React from 'react';
import { storeConfig } from '@/config/store';
import { Card, CardContent } from '@/components/ui';
import { Star, Quote } from 'lucide-react';

export function Testimonials() {
  return (
    <section className="py-24 bg-void-bg-light relative">
      {/* Background */}
      <div className="absolute inset-0 bg-purple-glow opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            What Our Users Say
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what our community has to say.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {storeConfig.testimonials.map((testimonial) => (
            <Card key={testimonial.id} hover className="bg-void-surface/80 backdrop-blur-sm">
              <CardContent className="p-6">
                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-purple-500/30 mb-4" />

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-purple-400 fill-purple-400"
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-300 mb-6 leading-relaxed">
                  &quot;{testimonial.content}&quot;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  {/* Avatar placeholder */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-semibold text-sm">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">
                      {testimonial.name}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
