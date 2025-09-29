'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { ArrowRight, Sparkles, TrendingDown, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

function AnimatedCounter({
  end,
  duration = 2000,
  suffix = '',
  prefix = '',
}: CounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let requestId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(end * easeOutQuart));

      if (progress < 1) {
        requestId = requestAnimationFrame(animate);
      }
    };

    requestId = requestAnimationFrame(animate);

    return () => {
      if (requestId) {
        cancelAnimationFrame(requestId);
      }
    };
  }, [end, duration]);

  return (
    <span>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export function HeroSection() {
  return (
    <section
      className="flex-1 w-full relative overflow-hidden"
      style={{ padding: 'clamp(4rem, 8vw, 12rem) clamp(2rem, 5vw, 8rem)' }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
        <svg
          className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 opacity-50"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="w-full max-w-none relative" style={{ margin: '0 auto' }}>
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Column - Main Content */}
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                AI-Powered Gear Management
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                Optimize Your Pack Weight with{' '}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  AI Intelligence
                </span>
              </h1>

              {/* Subheadline */}
              <p className="max-w-[600px] text-muted-foreground md:text-xl leading-relaxed mx-auto lg:mx-0">
                Track your gear, create smart pack lists, and achieve your
                ultralight backpacking goals. Let AI help you find lighter
                alternatives and optimize every ounce.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button asChild size="lg" className="min-h-[48px] px-8 text-base">
                <Link href="/signup">
                  Start Optimizing for Free
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="min-h-[48px] px-8 text-base"
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="text-center lg:text-left">
              <p className="text-sm text-muted-foreground mb-3">
                Join the ultralight community
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">
                    <AnimatedCounter end={1250} suffix="+" />
                  </span>
                  <span className="text-muted-foreground">Active Users</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-green-600" />
                  <span className="font-semibold">
                    <AnimatedCounter end={28} suffix="%" />
                  </span>
                  <span className="text-muted-foreground">
                    Average Weight Savings
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual Demo */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              {/* Mock App Interface */}
              <div className="bg-background border-2 border-muted rounded-2xl shadow-2xl overflow-hidden">
                {/* Mock Header */}
                <div className="bg-muted/50 px-4 py-3 border-b flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-xs text-muted-foreground ml-2">
                    featherweight.app/dashboard
                  </div>
                </div>

                {/* Mock Content */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Your Pack Weight</h3>
                    <div className="flex items-center gap-2 text-green-600">
                      <TrendingDown className="h-4 w-4" />
                      <span className="text-sm font-medium">-2.3 lbs</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Base Weight</span>
                      <span className="font-mono text-lg">
                        <AnimatedCounter end={12} suffix=".4 lbs" />
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-primary h-2 rounded-full w-3/4 animate-pulse"></div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      🎯 Goal: 15.0 lbs • On track!
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="text-sm font-medium">
                      Recent AI Suggestions
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs bg-primary/5 rounded-lg p-2">
                        <Sparkles className="h-3 w-3 text-primary" />
                        <span>Found lighter tent: -8oz potential savings</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs bg-primary/5 rounded-lg p-2">
                        <Sparkles className="h-3 w-3 text-primary" />
                        <span>Alternative sleeping bag: -1.2lbs available</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-background border rounded-lg shadow-lg p-3 animate-bounce">
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="font-medium">AI Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
