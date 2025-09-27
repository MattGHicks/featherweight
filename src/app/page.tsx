'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ArrowRight, Backpack, BarChart3, Scale } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Home() {
  const { data: session } = useSession();

  // Redirect authenticated users to dashboard
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section
        className="flex-1 w-full"
        style={{ padding: 'clamp(4rem, 8vw, 12rem) clamp(2rem, 5vw, 8rem)' }}
      >
        <div className="w-full max-w-none" style={{ margin: '0 auto' }}>
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Optimize Your Pack Weight
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl leading-relaxed">
                Track your gear, create pack lists, and achieve your ultralight
                backpacking goals with Featherweight.
              </p>
            </div>
            <div
              className="flex flex-col sm:flex-row items-center justify-center w-full"
              style={{ gap: 'clamp(1rem, 2vw, 1.5rem)' }}
            >
              <Button
                asChild
                size="lg"
                className="min-h-[44px]"
                style={{
                  padding:
                    'clamp(0.75rem, 1.5vw, 1rem) clamp(1.5rem, 3vw, 2rem)',
                  fontSize: 'clamp(0.875rem, 1.25vw, 1rem)',
                }}
              >
                <Link href="/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="min-h-[44px]"
                style={{
                  padding:
                    'clamp(0.75rem, 1.5vw, 1rem) clamp(1.5rem, 3vw, 2rem)',
                  fontSize: 'clamp(0.875rem, 1.25vw, 1rem)',
                }}
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="w-full bg-muted/30"
        style={{ padding: 'clamp(4rem, 8vw, 8rem) clamp(2rem, 5vw, 8rem)' }}
      >
        <div className="w-full max-w-none" style={{ margin: '0 auto' }}>
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl mb-4">
              Everything you need for ultralight backpacking
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools to help you achieve your base weight goals
            </p>
          </div>
          <div
            className="grid gap-[3%]"
            style={{
              gridTemplateColumns:
                'repeat(auto-fit, minmax(clamp(250px, 30vw, 350px), 1fr))',
            }}
          >
            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <Backpack
                  className="h-10 w-10 mb-2 text-primary"
                  aria-hidden="true"
                />
                <CardTitle>Gear Management</CardTitle>
                <CardDescription>
                  Organize your gear library with detailed weight tracking and
                  categorization.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <Scale
                  className="h-10 w-10 mb-2 text-primary"
                  aria-hidden="true"
                />
                <CardTitle>Pack Lists</CardTitle>
                <CardDescription>
                  Create multiple pack lists for different trips with real-time
                  weight calculations.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <BarChart3
                  className="h-10 w-10 mb-2 text-primary"
                  aria-hidden="true"
                />
                <CardTitle>Weight Analytics</CardTitle>
                <CardDescription>
                  Visualize your weight distribution and track progress toward
                  your base weight goals.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="w-full"
        style={{ padding: 'clamp(4rem, 8vw, 8rem) clamp(2rem, 5vw, 8rem)' }}
      >
        <div className="w-full max-w-none" style={{ margin: '0 auto' }}>
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Ready to Go Ultralight?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl leading-relaxed">
                Join the community of weight-conscious backpackers and start
                optimizing your gear today.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="min-h-[44px]"
              style={{
                padding: 'clamp(0.75rem, 1.5vw, 1rem) clamp(1.5rem, 3vw, 2rem)',
                fontSize: 'clamp(0.875rem, 1.25vw, 1rem)',
              }}
            >
              <Link href="/signup">
                Start Tracking Your Gear
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
