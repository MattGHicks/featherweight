'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Package, Plus, Search } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function GearPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="container py-6">Loading...</div>;
  }

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="container py-6">
      <PageHeader
        title="Gear Library"
        description="Manage all your gear items with detailed weight tracking"
      >
        <Button asChild>
          <Link href="/gear/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Gear
          </Link>
        </Button>
      </PageHeader>

      <div className="flex items-center space-x-2 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search gear..." className="pl-8" />
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Package className="h-16 w-16 text-muted-foreground mb-6" />
          <h3 className="text-lg font-semibold mb-2">No gear items yet</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            Start building your gear library by adding your first item. Track
            weights, categories, and more.
          </p>
          <Button asChild>
            <Link href="/gear/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Gear Item
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
