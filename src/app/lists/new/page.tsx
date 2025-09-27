'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import { useState } from 'react';

import { ArrowLeft } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { PackListForm } from '@/components/pack-lists/pack-list-form';

export default function NewPackListPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div className="container px-4 md:px-6 py-6">Loading...</div>;
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
          <PackListForm />
        </div>
      </div>
    </div>
  );
}
