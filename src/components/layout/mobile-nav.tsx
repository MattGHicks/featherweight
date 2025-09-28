'use client';

import { useState } from 'react';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

import {
  BarChart3,
  ClipboardList,
  Feather,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Package,
  Settings,
  User,
  UserPlus,
} from 'lucide-react';

import { GlobalSearch } from '@/components/search/global-search';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const authenticatedNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Gear', href: '/gear', icon: Package },
  { name: 'Pack Lists', href: '/lists', icon: ClipboardList },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const unauthenticatedNavigation = [
  { name: 'Sign In', href: '/login', icon: LogIn },
  { name: 'Sign Up', href: '/signup', icon: UserPlus },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  const navigation = session
    ? authenticatedNavigation
    : unauthenticatedNavigation;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-2 focus-visible:ring-ring md:hidden min-h-[44px] min-w-[44px]"
          aria-label="Open navigation menu"
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b bg-muted/20">
            <Link
              href="/"
              className="flex items-center space-x-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              onClick={() => setOpen(false)}
            >
              <div className="p-2 bg-primary rounded-lg">
                <Feather
                  className="h-5 w-5 text-primary-foreground"
                  aria-hidden="true"
                />
              </div>
              <span className="font-bold text-lg">Featherweight</span>
            </Link>
          </div>

          {/* User Section (if authenticated) */}
          {session && (
            <div className="p-6 border-b bg-muted/10">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={session.user?.image ?? ''}
                    alt={`Profile picture for ${session.user?.name || session.user?.email || 'user'}`}
                  />
                  <AvatarFallback>
                    <User className="h-5 w-5" aria-hidden="true" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  {session.user?.name && (
                    <p className="font-medium text-sm truncate">
                      {session.user.name}
                    </p>
                  )}
                  {session.user?.email && (
                    <p className="text-xs text-muted-foreground truncate">
                      {session.user.email}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Global Search (if authenticated) */}
          {session && (
            <div className="p-6 border-b">
              <GlobalSearch />
            </div>
          )}

          {/* Navigation */}
          <nav
            className="flex-1 p-6 overflow-y-auto"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="space-y-2">
              {navigation.map(item => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center space-x-3 px-3 py-3 rounded-lg text-foreground font-medium transition-all duration-200 hover:bg-muted hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring group"
                  >
                    <IconComponent
                      className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors"
                      aria-hidden="true"
                    />
                    <span className="flex-1">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Sign Out Section (if authenticated) */}
          {session && (
            <>
              <Separator />
              <div className="p-6">
                <Button
                  variant="ghost"
                  onClick={() => {
                    signOut();
                    setOpen(false);
                  }}
                  className="w-full justify-start text-left px-3 py-3 h-auto font-medium hover:bg-muted group"
                >
                  <LogOut
                    className="h-5 w-5 mr-3 text-muted-foreground group-hover:text-primary transition-colors"
                    aria-hidden="true"
                  />
                  <span className="flex-1">Sign Out</span>
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
