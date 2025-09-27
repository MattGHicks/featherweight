'use client';

import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Backpack } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function LoginPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Backpack className="h-6 w-6 text-primary-foreground" />
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
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <Backpack className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your Featherweight account
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Choose your preferred sign-in method
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full"
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
              className="w-full"
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            >
              Continue with Google
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
            >
              Continue with GitHub
            </Button>
          </CardContent>
        </Card>

        <p className="px-8 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="hover:text-brand underline underline-offset-4"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
