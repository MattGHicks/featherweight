'use client';

import { useState } from 'react';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Gear', href: '/gear' },
  { name: 'Pack Lists', href: '/lists' },
  { name: 'Analytics', href: '/analytics' },
  { name: 'Settings', href: '/settings' },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <Link
          href="/"
          className="flex items-center"
          onClick={() => setOpen(false)}
        >
          <span className="font-bold">Featherweight</span>
        </Link>
        <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-3">
            {navigation.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
