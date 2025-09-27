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
      <section className="flex-1 w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Optimize Your Pack Weight
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Track your gear, create pack lists, and achieve your ultralight
                backpacking goals with Featherweight.
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link href="/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <Card>
              <CardHeader>
                <Backpack className="h-10 w-10 mb-2" />
                <CardTitle>Gear Management</CardTitle>
                <CardDescription>
                  Organize your gear library with detailed weight tracking and
                  categorization.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Scale className="h-10 w-10 mb-2" />
                <CardTitle>Pack Lists</CardTitle>
                <CardDescription>
                  Create multiple pack lists for different trips with real-time
                  weight calculations.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <BarChart3 className="h-10 w-10 mb-2" />
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
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Ready to Go Ultralight?
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Join the community of weight-conscious backpackers and start
                optimizing your gear today.
              </p>
            </div>
            <Button asChild size="lg">
              <Link href="/signup">
                Start Tracking Your Gear
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
