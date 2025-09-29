'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

import { AIAssistantSection } from '@/components/landing/ai-assistant-section';
import { FAQSection } from '@/components/landing/faq-section';
import { FeaturesGrid } from '@/components/landing/features-grid';
import { HeroSection } from '@/components/landing/hero-section';
import { HowItWorks } from '@/components/landing/how-it-works';
import { ImageCaptureSection } from '@/components/landing/image-capture-section';
import { SocialProof } from '@/components/landing/social-proof';
import { WeightCalculatorDemo } from '@/components/landing/weight-calculator-demo';

export default function Home() {
  const { data: session } = useSession();

  // Redirect authenticated users to dashboard
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Enhanced Hero Section */}
      <HeroSection />

      {/* AI Assistant Showcase */}
      <AIAssistantSection />

      {/* Image Capture Section */}
      <ImageCaptureSection />

      {/* Enhanced Features Grid */}
      <FeaturesGrid />

      {/* Interactive Weight Calculator Demo */}
      <WeightCalculatorDemo />

      {/* How It Works Timeline */}
      <HowItWorks />

      {/* Social Proof & Testimonials */}
      <SocialProof />

      {/* FAQ Section */}
      <FAQSection />
    </div>
  );
}
