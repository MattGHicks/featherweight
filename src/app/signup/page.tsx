'use client';

import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Feather } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function SignUpPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div
        className="flex h-screen w-screen flex-col items-center justify-center"
        style={{ padding: 'clamp(1rem, 3vw, 2rem)' }}
      >
        <div
          className="mx-auto flex w-full flex-col justify-center"
          style={{
            maxWidth: 'clamp(300px, 90vw, 400px)',
            gap: 'clamp(1rem, 3vw, 1.5rem)',
          }}
        >
          <div className="flex flex-col space-y-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Feather className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Loading...
            </h1>
          </div>
        </div>
      </div>
    );
  }

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div
      className="flex h-screen w-screen flex-col items-center justify-center"
      style={{ padding: 'clamp(1rem, 3vw, 2rem)' }}
    >
      <div
        className="mx-auto flex w-full flex-col justify-center"
        style={{
          maxWidth: 'clamp(300px, 90vw, 400px)',
          gap: 'clamp(1rem, 3vw, 1.5rem)',
        }}
      >
        <div className="flex flex-col space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <Feather
              className="h-6 w-6 text-primary-foreground"
              aria-hidden="true"
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Get started
            </h1>
            <p className="text-sm text-muted-foreground">
              Create your Featherweight account to start tracking gear
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Choose your preferred sign-up method
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full min-h-[44px]"
              onClick={() => signIn('email', { callbackUrl: '/dashboard' })}
            >
              Continue with Email
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full min-h-[44px]"
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            >
              Continue with Google
            </Button>
            <Button
              variant="outline"
              className="w-full min-h-[44px]"
              onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
            >
              Continue with GitHub
            </Button>
          </CardContent>
        </Card>

        <p className="px-8 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-primary hover:text-primary/80 underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
