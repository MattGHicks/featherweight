'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

import { Backpack, LogOut, Settings, User } from 'lucide-react';

import { MobileNav } from '@/components/layout/mobile-nav';
import { GlobalSearch } from '@/components/search/global-search';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function SiteHeader() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div
        className="flex items-center w-full"
        style={{
          height: 'clamp(3.5rem, 4vw, 4rem)',
          padding: '0 clamp(1rem, 3vw, 2rem)',
        }}
      >
        {/* Logo - Always on the left */}
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center space-x-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            <Backpack className="h-6 w-6" aria-hidden="true" />
            <span className="hidden font-bold sm:inline-block">
              Featherweight
            </span>
            <span className="sr-only">Featherweight Home</span>
          </Link>
        </div>

        {/* Center section - Search and Navigation */}
        <div className="flex-1 flex items-center justify-center max-w-2xl mx-4">
          {session && (
            <>
              {/* Global Search - Visible on desktop */}
              <div className="hidden md:block flex-1 max-w-md">
                <GlobalSearch />
              </div>

              {/* Desktop Navigation - Right side */}
              <nav
                className="hidden md:flex items-center ml-6"
                style={{ gap: 'clamp(1rem, 2vw, 2rem)' }}
                role="navigation"
                aria-label="Main navigation"
              >
                <Link
                  href="/dashboard"
                  className="text-sm font-medium transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-2 py-1"
                >
                  Dashboard
                </Link>
                <Link
                  href="/gear"
                  className="text-sm font-medium transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-2 py-1"
                >
                  Gear
                </Link>
                <Link
                  href="/lists"
                  className="text-sm font-medium transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-2 py-1"
                >
                  Pack Lists
                </Link>
                <Link
                  href="/analytics"
                  className="text-sm font-medium transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-2 py-1"
                >
                  Analytics
                </Link>
              </nav>
            </>
          )}
        </div>

        {/* Right side - User menu/Sign In button and Mobile menu */}
        <div
          className="flex items-center ml-auto"
          style={{ gap: 'clamp(0.5rem, 1vw, 1rem)' }}
        >
          {/* User Authentication - Always visible */}
          {status === 'loading' ? (
            <div
              className="h-8 w-8 animate-pulse rounded-full bg-muted"
              role="status"
              aria-label="Loading user profile"
            />
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                  aria-label={`Open user menu for ${session.user?.name || session.user?.email || 'user'}`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session.user?.image ?? ''}
                      alt={`Profile picture for ${session.user?.name || session.user?.email || 'user'}`}
                    />
                    <AvatarFallback>
                      <User className="h-4 w-4" aria-hidden="true" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {session.user?.name && (
                      <p className="font-medium">{session.user.name}</p>
                    )}
                    {session.user?.email && (
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {session.user.email}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" aria-hidden="true" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={() => signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => signIn()} className="min-h-[44px]">
              Sign In
            </Button>
          )}

          {/* Mobile Navigation - Only visible on mobile/tablet */}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
