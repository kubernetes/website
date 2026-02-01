import {
  Hero,
  ProductPreview,
  Features,
  HowItWorks,
  Testimonials,
  FAQ,
} from '@/components/home';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProductPreview />
      <Features />
      <HowItWorks />
      <Testimonials />
      <FAQ />
    </>
  );
}
