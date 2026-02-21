// Landing page (/)
import LandingNavbar from '@/components/landing/LandingNavbar';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import Features from '@/components/landing/Features';
import Pricing from '@/components/landing/Pricing';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <>
      <LandingNavbar />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
