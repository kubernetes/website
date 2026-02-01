'use client';

import React from 'react';
import Link from 'next/link';
import { storeConfig } from '@/config/store';
import { Button } from '@/components/ui';
import { ArrowRight, MessageCircle } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-void-bg">
        {/* Purple radial gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-glow-strong opacity-50" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple-glow opacity-30 animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-purple-glow opacity-20" />

        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <div className="animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-8">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-sm font-medium text-purple-400">
              Premium Digital Access
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight">
            {storeConfig.siteName}
          </h1>

          {/* Tagline */}
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-400 mb-8 font-light">
            {storeConfig.tagline}
          </p>

          {/* Description */}
          <p className="text-gray-500 max-w-2xl mx-auto mb-12 text-lg">
            {storeConfig.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/products">
              <Button
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="min-w-[200px]"
              >
                View Products
              </Button>
            </Link>
            <a
              href={storeConfig.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="ghost"
                size="lg"
                leftIcon={<MessageCircle className="w-5 h-5" />}
                className="min-w-[200px]"
              >
                Join Support
              </Button>
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-gray-500 text-xs uppercase tracking-wider">
            Scroll
          </span>
          <div className="w-5 h-8 rounded-full border-2 border-gray-600 flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-gray-500 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
