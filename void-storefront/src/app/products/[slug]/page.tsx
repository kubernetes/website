import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { storeConfig, getProductBySlug, getRelatedProducts } from '@/config/store';
import { Badge, Button, Card, CardContent } from '@/components/ui';
import { ProductCard } from '@/components/products';
import { ProductDetails } from './ProductDetails';
import {
  ArrowLeft,
  Check,
  Clock,
  Shield,
  Zap,
  MessageCircle,
  Mail,
} from 'lucide-react';

interface ProductPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return storeConfig.products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = getProductBySlug(params.slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.name,
    description: product.descriptionShort,
    openGraph: {
      title: `${product.name} | ${storeConfig.siteName}`,
      description: product.descriptionShort,
    },
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(params.slug);

  const badgeVariant =
    product.badge === 'Popular'
      ? 'popular'
      : product.badge === 'Best Value'
      ? 'value'
      : 'starter';

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-purple-glow opacity-30" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-purple-glow opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Product Info */}
          <div>
            {/* Badge */}
            <Badge variant={badgeVariant} size="md" className="mb-4">
              {product.badge}
            </Badge>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white">
                  {product.priceLabel}
                </span>
                <span className="text-gray-400 text-lg">
                  / {product.durationMonths}{' '}
                  {product.durationMonths === 1 ? 'month' : 'months'}
                </span>
              </div>
              {product.durationMonths > 1 && (
                <p className="text-purple-400 mt-2">
                  That&apos;s only ${(product.priceValue / product.durationMonths).toFixed(2)}/month
                </p>
              )}
            </div>

            {/* Short Description */}
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              {product.descriptionShort}
            </p>

            {/* Buy Button */}
            <ProductDetails product={product} />

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 mt-8 pt-8 border-t border-void-border">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Zap className="w-4 h-4 text-purple-400" />
                Instant Delivery
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Shield className="w-4 h-4 text-purple-400" />
                Secure Payment
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Clock className="w-4 h-4 text-purple-400" />
                24/7 Support
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* What You Get */}
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  What You Get
                </h2>
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-gray-300"
                    >
                      <Check className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Description
                </h2>
                <div className="prose prose-invert prose-sm max-w-none">
                  {product.descriptionLong.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-400 mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Requirements
                </h2>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>• Valid email address for delivery</li>
                  <li>• Compatible device or platform</li>
                  <li>• Active internet connection</li>
                </ul>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Need Help?
                </h2>
                <p className="text-gray-400 text-sm mb-4">
                  Our support team is available 24/7 to assist you.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={storeConfig.discordUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<MessageCircle className="w-4 h-4" />}
                    >
                      Discord
                    </Button>
                  </a>
                  <a href={`mailto:${storeConfig.supportEmail}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Mail className="w-4 h-4" />}
                    >
                      Email Support
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-24">
            <h2 className="text-2xl font-bold text-white mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
