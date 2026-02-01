import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlug } from '@/config/store';
import { createCheckoutSession } from '@/lib/sellauth';
import { checkRateLimit, getClientIdentifier } from '@/lib/rate-limit';
import { sanitizeInput, isValidEmail } from '@/lib/utils';
import { CheckoutRequest } from '@/types';

/**
 * POST /api/checkout
 *
 * Creates a SellAuth checkout session for a product.
 * Rate limited to prevent abuse.
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request.headers);
    const rateLimit = checkRateLimit(clientId, {
      windowMs: 60000, // 1 minute
      maxRequests: 10, // 10 requests per minute
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rateLimit.resetTime),
            'Retry-After': String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)),
          },
        }
      );
    }

    // Parse and validate request body
    let body: CheckoutRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { slug, quantity, customerEmail, coupon, affiliate } = body;

    // Validate slug
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { error: 'Product slug is required' },
        { status: 400 }
      );
    }

    // Get product from config
    const product = getProductBySlug(sanitizeInput(slug));
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check stock
    if (!product.inStock) {
      return NextResponse.json(
        { error: 'This product is currently out of stock' },
        { status: 400 }
      );
    }

    // Validate quantity
    const validQuantity = Math.min(Math.max(1, Number(quantity) || 1), 10);

    // Validate email if provided
    if (customerEmail && !isValidEmail(customerEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Create checkout session
    const checkoutUrl = await createCheckoutSession(slug, {
      quantity: validQuantity,
      customerEmail: customerEmail ? sanitizeInput(customerEmail) : undefined,
      coupon: coupon ? sanitizeInput(coupon) : undefined,
      affiliate: affiliate ? sanitizeInput(affiliate) : undefined,
    });

    return NextResponse.json(
      { checkoutUrl },
      {
        status: 200,
        headers: {
          'X-RateLimit-Remaining': String(rateLimit.remaining),
        },
      }
    );
  } catch (error) {
    console.error('Checkout error:', error);

    // Return user-friendly error message
    const message =
      error instanceof Error
        ? error.message
        : 'An unexpected error occurred. Please try again.';

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// Only allow POST requests
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
