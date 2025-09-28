'use client';

import { useState } from 'react';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

import { GearForm } from '@/components/gear/gear-form';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { useGear } from '@/hooks/use-gear';

export default function NewGearPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { categories, createGearItem } = useGear();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (status === 'loading') {
    return <div className="container px-4 md:px-6 py-6">Loading...</div>;
  }

  if (!session) {
    redirect('/login');
  }

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      await createGearItem(data);
      router.push('/gear');
    } catch (error) {
      console.error('Error creating gear item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen"
      style={{ padding: '2rem clamp(2rem, 5vw, 8rem)' }}
    >
      <PageHeader
        title="Add New Gear"
        description="Add a new item to your gear library"
      >
        <Button variant="outline" asChild>
          <Link href="/gear">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Gear
          </Link>
        </Button>
      </PageHeader>

      <div className="max-w-2xl">
        <div className="rounded-lg border p-6">
          <GearForm
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={() => router.push('/gear')}
            isLoading={isSubmitting}
            submitLabel="Create Gear Item"
          />
        </div>
      </div>
    </div>
  );
}
