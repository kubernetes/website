import { StoreConfig } from '@/types';

/**
 * VOID STOREFRONT CONFIGURATION
 *
 * This is the single source of truth for all store data.
 * Edit this file to customize products, features, FAQ, and more.
 */

export const storeConfig: StoreConfig = {
  siteName: 'Void',
  tagline: 'Access. Simple. Fast.',
  description: 'Premium digital subscriptions for seamless access to exclusive content and features.',

  theme: {
    primaryColor: '#8B5CF6',
    backgroundColor: '#0B0B12',
  },

  navigation: [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Contact', href: '/contact' },
  ],

  /**
   * PRODUCTS
   *
   * To connect to SellAuth, replace the sellauthProductId values below
   * with your actual SellAuth product IDs from your SellAuth dashboard.
   */
  products: [
    {
      id: 'void-1mo',
      slug: 'void-1-month',
      name: 'Void - 1 Month Access',
      descriptionShort: 'Perfect for trying out Void with full access for 30 days.',
      descriptionLong: `Get started with Void and experience everything we have to offer. This 1-month subscription gives you complete access to all features, updates, and support.

**What's included:**
- Full access to all Void features
- Regular updates and improvements
- Priority customer support
- Access to exclusive community channels
- Instant delivery upon purchase`,
      priceLabel: '$2.49',
      priceValue: 2.49,
      durationMonths: 1,
      badge: 'Starter',
      features: [
        'Full feature access',
        '30 days duration',
        'Instant activation',
        'Priority support',
        'All updates included',
      ],
      inStock: true,
      // ⚠️ REPLACE WITH YOUR SELLAUTH PRODUCT ID
      sellauthProductId: 'YOUR_SELLAUTH_PRODUCT_ID_1MO',
      sellauthVariantId: undefined,
    },
    {
      id: 'void-3mo',
      slug: 'void-3-month',
      name: 'Void - 3 Month Access',
      descriptionShort: 'Our most popular choice - save more with 3 months of access.',
      descriptionLong: `The smart choice for committed users. Save over 25% compared to monthly pricing while enjoying uninterrupted access to Void for three full months.

**What's included:**
- Full access to all Void features
- Regular updates and improvements
- Priority customer support
- Access to exclusive community channels
- Instant delivery upon purchase
- Extended validity for peace of mind`,
      priceLabel: '$5.50',
      priceValue: 5.50,
      durationMonths: 3,
      badge: 'Popular',
      features: [
        'Full feature access',
        '90 days duration',
        'Instant activation',
        'Priority support',
        'All updates included',
      ],
      inStock: true,
      // ⚠️ REPLACE WITH YOUR SELLAUTH PRODUCT ID
      sellauthProductId: 'YOUR_SELLAUTH_PRODUCT_ID_3MO',
      sellauthVariantId: undefined,
    },
    {
      id: 'void-6mo',
      slug: 'void-6-month',
      name: 'Void - 6 Month Access',
      descriptionShort: 'Best value - maximum savings with 6 months of premium access.',
      descriptionLong: `The ultimate value package. Get 6 months of complete access at our best price per month. Perfect for power users who want long-term access without worrying about renewals.

**What's included:**
- Full access to all Void features
- Regular updates and improvements
- Priority customer support
- Access to exclusive community channels
- Instant delivery upon purchase
- Best price per month
- VIP community status`,
      priceLabel: '$8.50',
      priceValue: 8.50,
      durationMonths: 6,
      badge: 'Best Value',
      features: [
        'Full feature access',
        '180 days duration',
        'Instant activation',
        'Priority support',
        'All updates included',
      ],
      inStock: true,
      // ⚠️ REPLACE WITH YOUR SELLAUTH PRODUCT ID
      sellauthProductId: 'YOUR_SELLAUTH_PRODUCT_ID_6MO',
      sellauthVariantId: undefined,
    },
  ],

  features: [
    {
      icon: 'Zap',
      title: 'Instant Activation',
      description: 'Get access immediately after purchase. No waiting, no delays.',
    },
    {
      icon: 'Shield',
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security measures.',
    },
    {
      icon: 'Clock',
      title: '24/7 Availability',
      description: 'Access your subscription anytime, anywhere, on any device.',
    },
    {
      icon: 'RefreshCw',
      title: 'Regular Updates',
      description: 'Continuous improvements and new features added regularly.',
    },
    {
      icon: 'Headphones',
      title: 'Priority Support',
      description: 'Dedicated support team ready to help whenever you need.',
    },
    {
      icon: 'Users',
      title: 'Community Access',
      description: 'Join our exclusive community of like-minded users.',
    },
  ],

  howItWorks: [
    {
      step: 1,
      title: 'Choose Your Plan',
      description: 'Select the subscription duration that fits your needs.',
    },
    {
      step: 2,
      title: 'Secure Checkout',
      description: 'Complete your purchase through our secure payment system.',
    },
    {
      step: 3,
      title: 'Instant Access',
      description: 'Receive your access credentials immediately via email.',
    },
  ],

  testimonials: [
    {
      id: '1',
      name: 'Alex M.',
      role: 'Power User',
      content: 'Void has completely transformed my workflow. The instant activation and reliable service make it a no-brainer.',
    },
    {
      id: '2',
      name: 'Sarah K.',
      role: 'Content Creator',
      content: 'I\'ve tried many similar services, but Void stands out with its simplicity and excellent support team.',
    },
    {
      id: '3',
      name: 'Mike R.',
      role: 'Developer',
      content: 'The 6-month plan is incredible value. Saved me so much compared to alternatives. Highly recommended!',
    },
  ],

  faq: [
    {
      question: 'How do I receive my access after purchase?',
      answer: 'After completing your purchase, you\'ll receive an email with your access credentials within seconds. The delivery is fully automated and instant.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, and various cryptocurrency options through our secure payment processor SellAuth.',
    },
    {
      question: 'Can I upgrade my subscription?',
      answer: 'Yes! You can upgrade to a longer duration at any time. Contact our support team for a prorated upgrade.',
    },
    {
      question: 'Is there a refund policy?',
      answer: 'We offer refunds within 24 hours of purchase if you experience any issues. Please contact support with your order details.',
    },
    {
      question: 'How do I get support?',
      answer: 'You can reach our support team through the Contact page, via email, or through our Discord community for fastest response.',
    },
    {
      question: 'Are updates included?',
      answer: 'Yes, all updates and improvements released during your subscription period are included at no extra cost.',
    },
  ],

  socialLinks: [
    { label: 'Discord', href: 'https://discord.gg/void', icon: 'MessageCircle' },
    { label: 'Twitter', href: 'https://twitter.com/void', icon: 'Twitter' },
  ],

  // Contact information
  supportEmail: 'support@void.store',
  discordUrl: 'https://discord.gg/void',
};

// Helper functions to access store data
export const getProductBySlug = (slug: string) =>
  storeConfig.products.find(p => p.slug === slug);

export const getProductById = (id: string) =>
  storeConfig.products.find(p => p.id === id);

export const getRelatedProducts = (currentSlug: string) =>
  storeConfig.products.filter(p => p.slug !== currentSlug);
