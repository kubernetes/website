import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIdentifier } from '@/lib/rate-limit';
import { sanitizeInput, isValidEmail } from '@/lib/utils';
import { ContactRequest } from '@/types';

/**
 * POST /api/contact
 *
 * Handles contact form submissions.
 * If no email service is configured, logs the submission and returns success.
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting - stricter for contact form
    const clientId = getClientIdentifier(request.headers);
    const rateLimit = checkRateLimit(`contact:${clientId}`, {
      windowMs: 60000, // 1 minute
      maxRequests: 3, // 3 submissions per minute
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait before trying again.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimit.resetTime - Date.now()) / 1000)),
          },
        }
      );
    }

    // Parse and validate request body
    let body: ContactRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { name, email, message } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Please provide a valid name (at least 2 characters)' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return NextResponse.json(
        { error: 'Please provide a message (at least 10 characters)' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(name).slice(0, 100),
      email: sanitizeInput(email).slice(0, 254),
      message: sanitizeInput(message).slice(0, 5000),
      submittedAt: new Date().toISOString(),
      clientIp: clientId,
    };

    // Log the submission (replace with email service in production)
    console.log('=== Contact Form Submission ===');
    console.log(JSON.stringify(sanitizedData, null, 2));
    console.log('===============================');

    /**
     * TODO: Integrate with your preferred email service
     *
     * Example with SendGrid:
     * await sendgrid.send({
     *   to: 'support@void.store',
     *   from: 'noreply@void.store',
     *   subject: `Contact Form: ${sanitizedData.name}`,
     *   text: `
     *     Name: ${sanitizedData.name}
     *     Email: ${sanitizedData.email}
     *     Message: ${sanitizedData.message}
     *   `,
     * });
     *
     * Example with Resend:
     * await resend.emails.send({
     *   from: 'Void <noreply@void.store>',
     *   to: ['support@void.store'],
     *   subject: `Contact Form: ${sanitizedData.name}`,
     *   text: sanitizedData.message,
     *   reply_to: sanitizedData.email,
     * });
     */

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your message. We\'ll get back to you soon!',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);

    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
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
