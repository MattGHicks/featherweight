'use client';

import { useState } from 'react';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

import { Backpack, Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const authenticatedNavigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Gear', href: '/gear' },
  { name: 'Pack Lists', href: '/lists' },
  { name: 'Analytics', href: '/analytics' },
  { name: 'Settings', href: '/settings' },
];

const unauthenticatedNavigation = [
  { name: 'Sign In', href: '/login' },
  { name: 'Sign Up', href: '/signup' },
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
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-2 focus-visible:ring-ring md:hidden min-h-[44px] min-w-[44px]"
          aria-label="Open navigation menu"
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <Link
          href="/"
          className="flex items-center space-x-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          onClick={() => setOpen(false)}
        >
          <Backpack className="h-5 w-5" aria-hidden="true" />
          <span className="font-bold">Featherweight</span>
        </Link>
        <nav
          className="my-6 h-[calc(100vh-8rem)] pb-10 pl-6"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col space-y-4">
            {navigation.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-foreground font-medium transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-2 py-3 min-h-[44px] flex items-center"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
