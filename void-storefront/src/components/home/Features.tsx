import React from 'react';
import { storeConfig } from '@/config/store';
import { Card, CardContent } from '@/components/ui';
import {
  Zap,
  Shield,
  Clock,
  RefreshCw,
  Headphones,
  Users,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Zap: <Zap className="w-6 h-6" />,
  Shield: <Shield className="w-6 h-6" />,
  Clock: <Clock className="w-6 h-6" />,
  RefreshCw: <RefreshCw className="w-6 h-6" />,
  Headphones: <Headphones className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
};

export function Features() {
  return (
    <section className="py-24 bg-void-bg-light relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-void-bg via-transparent to-void-bg" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Why Choose Void?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We&apos;ve built our service with your needs in mind. Here&apos;s what makes us different.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {storeConfig.features.map((feature, index) => (
            <Card key={index} hover className="bg-void-surface/50 backdrop-blur-sm">
              <CardContent className="p-6">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
                  {iconMap[feature.icon] || <Zap className="w-6 h-6" />}
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
