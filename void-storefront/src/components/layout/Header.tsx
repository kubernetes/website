'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { storeConfig } from '@/config/store';
import { cn } from '@/lib/utils';
import { Menu, X, ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui';

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-void-bg/80 backdrop-blur-lg border-b border-void-border'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <div className="absolute inset-0 rounded-lg bg-purple-500/50 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-bold text-white">
              {storeConfig.siteName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {storeConfig.navigation.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'text-white bg-purple-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Status Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-medium text-green-400">Online</span>
            </div>

            {/* Cart Icon (placeholder) */}
            <button
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>

            {/* Login Button (placeholder) */}
            <Link href="#" className="hidden md:block">
              <Button variant="ghost" size="sm" leftIcon={<User className="w-4 h-4" />}>
                Login
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'md:hidden absolute top-full left-0 right-0 bg-void-bg/95 backdrop-blur-lg border-b border-void-border transition-all duration-300',
          isMobileMenuOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
          {storeConfig.navigation.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'block px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                pathname === link.href
                  ? 'text-white bg-purple-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-void-border mt-3">
            <Link href="#" className="block w-full">
              <Button variant="ghost" className="w-full justify-center" leftIcon={<User className="w-4 h-4" />}>
                Login
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
