import React from 'react';
import Link from 'next/link';
import { storeConfig } from '@/config/store';
import { MessageCircle, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-void-bg border-t border-void-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <span className="text-xl font-bold text-white">
                {storeConfig.siteName}
              </span>
            </Link>
            <p className="text-gray-400 text-sm max-w-sm mb-4">
              {storeConfig.description}
            </p>
            <div className="flex items-center gap-4">
              <a
                href={storeConfig.discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Discord
              </a>
              <a
                href={`mailto:${storeConfig.supportEmail}`}
                className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                Email
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {storeConfig.navigation.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/refund"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-void-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} {storeConfig.siteName}. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <span>Secure payments by</span>
            <span className="text-purple-400 font-medium">SellAuth</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
