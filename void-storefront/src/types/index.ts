// Product types
export interface Product {
  id: string;
  slug: string;
  name: string;
  descriptionShort: string;
  descriptionLong: string;
  priceLabel: string;
  priceValue: number; // For sorting
  durationMonths: number;
  badge: string;
  features: string[];
  inStock: boolean;
  // SellAuth integration - replace these placeholder IDs with your actual SellAuth product/variant IDs
  sellauthProductId: string;
  sellauthVariantId?: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface Step {
  step: number;
  title: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface StoreConfig {
  siteName: string;
  tagline: string;
  description: string;
  theme: {
    primaryColor: string;
    backgroundColor: string;
  };
  navigation: NavLink[];
  products: Product[];
  features: Feature[];
  howItWorks: Step[];
  testimonials: Testimonial[];
  faq: FAQItem[];
  socialLinks: SocialLink[];
  supportEmail: string;
  discordUrl: string;
}

// API types
export interface CheckoutRequest {
  slug: string;
  quantity?: number;
  customerEmail?: string;
  coupon?: string;
  affiliate?: string;
}

export interface CheckoutResponse {
  checkoutUrl: string;
}

export interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

// Filter/Sort types
export type SortOption = 'featured' | 'price-low' | 'price-high' | 'duration';

export interface FilterState {
  duration: number[];
  inStockOnly: boolean;
  priceRange: [number, number];
}
