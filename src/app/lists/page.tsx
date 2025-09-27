'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { List, Plus, Search } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function PackListsPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div
        className="w-full min-h-screen flex items-center justify-center"
        style={{ padding: '2rem clamp(2rem, 5vw, 8rem)' }}
      >
        Loading...
      </div>
    );
  }

  if (!session) {
    redirect('/login');
  }

  return (
    <div
      className="w-full min-h-screen"
      style={{ padding: '2rem clamp(2rem, 5vw, 8rem)' }}
    >
      <PageHeader
        title="Pack Lists"
        description="Manage your pack lists for different trips and scenarios"
      >
        <Button asChild>
          <Link href="/lists/new">
            <Plus className="mr-2 h-4 w-4" />
            New Pack List
          </Link>
        </Button>
      </PageHeader>

      <div className="flex items-center space-x-2 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search pack lists..." className="pl-8" />
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <List className="h-16 w-16 text-muted-foreground mb-6" />
          <h3 className="text-lg font-semibold mb-2">No pack lists yet</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            Create your first pack list to start planning trips and optimizing
            your gear selection.
          </p>
          <Button asChild>
            <Link href="/lists/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Pack List
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
