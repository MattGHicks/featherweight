'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';

export default function NewPackListPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="container px-4 md:px-6 py-6">Loading...</div>;
  }

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="container px-4 md:px-6 py-6">
      <PageHeader
        title="Create New Pack List"
        description="Create a new pack list for your next adventure"
      >
        <Button variant="outline" asChild>
          <Link href="/lists">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Pack Lists
          </Link>
        </Button>
      </PageHeader>

      <div className="max-w-2xl">
        <div className="rounded-lg border p-6">
          <p className="text-muted-foreground">
            Pack list creation form will be implemented here...
          </p>
        </div>
      </div>
    </div>
  );
}
