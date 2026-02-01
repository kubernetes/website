/**
 * SellAuth API Integration
 *
 * This module handles all communication with the SellAuth API.
 * The API key is NEVER exposed to the client - all calls go through our API routes.
 *
 * CONFIGURATION:
 * 1. Set SELLAUTH_API_KEY in your environment variables
 * 2. Set SELLAUTH_SHOP_ID in your environment variables
 * 3. Update the sellauthProductId in src/config/store.ts for each product
 */

import { getProductBySlug } from '@/config/store';

// SellAuth API base URL
const SELLAUTH_API_URL = 'https://api.sellauth.com/v1';

interface SellAuthCheckoutParams {
  productId: string;
  variantId?: string;
  quantity: number;
  customerEmail?: string;
  coupon?: string;
  affiliate?: string;
  returnUrl?: string;
}

interface SellAuthCheckoutResponse {
  success: boolean;
  checkout_url?: string;
  error?: string;
}

/**
 * Create a checkout session with SellAuth
 *
 * @param slug - Product slug from store config
 * @param options - Optional checkout parameters
 * @returns Checkout URL or throws an error
 */
export async function createCheckoutSession(
  slug: string,
  options: {
    quantity?: number;
    customerEmail?: string;
    coupon?: string;
    affiliate?: string;
  } = {}
): Promise<string> {
  const apiKey = process.env.SELLAUTH_API_KEY;
  const shopId = process.env.SELLAUTH_SHOP_ID;

  if (!apiKey) {
    console.error('SELLAUTH_API_KEY is not configured');
    throw new Error('Payment system is not configured. Please contact support.');
  }

  if (!shopId) {
    console.error('SELLAUTH_SHOP_ID is not configured');
    throw new Error('Payment system is not configured. Please contact support.');
  }

  // Get product from config
  const product = getProductBySlug(slug);
  if (!product) {
    throw new Error('Product not found');
  }

  if (!product.inStock) {
    throw new Error('This product is currently out of stock');
  }

  // Build the return URL
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Prepare checkout parameters
  const params: SellAuthCheckoutParams = {
    productId: product.sellauthProductId,
    variantId: product.sellauthVariantId,
    quantity: options.quantity || 1,
    customerEmail: options.customerEmail,
    coupon: options.coupon,
    affiliate: options.affiliate,
    returnUrl: `${siteUrl}/products/${slug}?checkout=success`,
  };

  try {
    // SellAuth API call to create checkout session
    // Adjust endpoint and payload structure based on SellAuth's actual API documentation
    const response = await fetch(`${SELLAUTH_API_URL}/shops/${shopId}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        product_id: params.productId,
        variant_id: params.variantId,
        quantity: params.quantity,
        customer_email: params.customerEmail,
        coupon_code: params.coupon,
        affiliate_code: params.affiliate,
        return_url: params.returnUrl,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('SellAuth API error:', response.status, errorData);

      if (response.status === 401) {
        throw new Error('Payment authentication failed. Please contact support.');
      }
      if (response.status === 404) {
        throw new Error('Product not found in payment system. Please contact support.');
      }
      throw new Error('Unable to create checkout. Please try again.');
    }

    const data: SellAuthCheckoutResponse = await response.json();

    if (!data.success || !data.checkout_url) {
      throw new Error(data.error || 'Failed to create checkout session');
    }

    return data.checkout_url;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error('Unexpected error creating checkout:', error);
    throw new Error('An unexpected error occurred. Please try again.');
  }
}

/**
 * Validate a webhook signature from SellAuth
 * Use this to verify incoming webhook requests
 */
export function validateWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  // Implement signature validation based on SellAuth's webhook documentation
  // This is a placeholder - adjust based on actual SellAuth webhook specs
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
