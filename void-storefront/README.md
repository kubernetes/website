# Void Storefront

A production-ready digital product storefront built with Next.js 14, TypeScript, and TailwindCSS. Features a dark + purple theme, SellAuth integration for payments, and a modern, responsive design.

## Features

- **Modern Dark Theme**: Sleek dark purple aesthetic with subtle gradients and glow effects
- **Responsive Design**: Fully responsive across all device sizes
- **SellAuth Integration**: Secure server-side checkout session creation
- **Product Collection**: Filterable and sortable product grid
- **Product Details**: Detailed product pages with related products
- **Contact Form**: Rate-limited contact form with validation
- **Accessible**: Focus states, ARIA labels, and semantic HTML
- **Fast**: Optimized for performance with Next.js App Router

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Payments**: SellAuth

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- SellAuth account

### Installation

1. Clone and install dependencies:

```bash
cd void-storefront
npm install
```

2. Create environment file:

```bash
cp .env.example .env.local
```

3. Configure environment variables in `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SELLAUTH_API_KEY=your_sellauth_api_key
SELLAUTH_SHOP_ID=your_sellauth_shop_id
```

4. Configure SellAuth product IDs in `src/config/store.ts`:

```typescript
products: [
  {
    // ... other fields
    sellauthProductId: 'YOUR_ACTUAL_SELLAUTH_PRODUCT_ID',
  },
  // ...
]
```

5. Run development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
void-storefront/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── checkout/      # SellAuth checkout endpoint
│   │   │   └── contact/       # Contact form endpoint
│   │   ├── products/          # Products pages
│   │   │   └── [slug]/        # Product detail page
│   │   ├── contact/           # Contact page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   ├── layout/            # Header, Footer
│   │   ├── home/              # Home page sections
│   │   └── products/          # Product components
│   ├── config/
│   │   └── store.ts           # Single source of truth for all data
│   ├── lib/
│   │   ├── sellauth.ts        # SellAuth API client
│   │   ├── rate-limit.ts      # Rate limiting
│   │   └── utils.ts           # Utility functions
│   └── types/
│       └── index.ts           # TypeScript types
├── tailwind.config.ts          # Tailwind configuration
├── next.config.js              # Next.js configuration
└── package.json
```

## Configuration

All store data is configured in `src/config/store.ts`:

- **Site Info**: Name, tagline, description
- **Products**: All 3 subscription plans with SellAuth IDs
- **Features**: 6 feature highlights
- **How It Works**: 3-step process
- **Testimonials**: Customer reviews
- **FAQ**: 6 frequently asked questions
- **Contact**: Support email and Discord

### Updating Products

To update products, edit the `products` array in `src/config/store.ts`:

```typescript
products: [
  {
    id: 'void-1mo',
    slug: 'void-1-month',
    name: 'Void - 1 Month Access',
    priceLabel: '$2.49',
    priceValue: 2.49,
    durationMonths: 1,
    badge: 'Starter',
    features: ['Feature 1', 'Feature 2'],
    inStock: true,
    sellauthProductId: 'your_sellauth_product_id',
  },
]
```

## API Routes

### POST /api/checkout

Creates a SellAuth checkout session.

**Request:**
```json
{
  "slug": "void-1-month",
  "quantity": 1,
  "customerEmail": "customer@example.com",
  "coupon": "DISCOUNT10",
  "affiliate": "partner123"
}
```

**Response:**
```json
{
  "checkoutUrl": "https://sellauth.com/checkout/..."
}
```

### POST /api/contact

Handles contact form submissions.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I have a question..."
}
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Set these in your deployment platform:

- `NEXT_PUBLIC_SITE_URL`: Your production URL
- `SELLAUTH_API_KEY`: Your SellAuth API key
- `SELLAUTH_SHOP_ID`: Your SellAuth shop ID

## Security

- SellAuth API key is never exposed to the client
- All API routes are rate-limited
- User inputs are sanitized
- HTTPS enforced in production

## Customization

### Theme Colors

Edit `tailwind.config.ts` to change colors:

```typescript
colors: {
  void: {
    bg: '#0B0B12',        // Main background
    surface: '#16161F',    // Card backgrounds
  },
  purple: {
    500: '#8B5CF6',        // Primary accent
  },
}
```

### Adding Pages

Create new pages in `src/app/`:

```tsx
// src/app/terms/page.tsx
export default function TermsPage() {
  return <div>Terms of Service</div>;
}
```

## License

MIT
