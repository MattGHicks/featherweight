'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

import { Share, Copy, ArrowLeft, Globe } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PublicPackListTable } from '@/components/pack-lists/public-pack-list-table';
import { formatWeight } from '@/lib/utils';

interface PackListStats {
  totalWeight: number;
  baseWeight: number;
  itemCount: number;
}

interface GearItem {
  id: string;
  name: string;
  description?: string;
  weight: number;
  isWorn: boolean;
  isConsumable: boolean;
  category: {
    id: string;
    name: string;
    color: string;
  };
}

interface PackListItem {
  id: string;
  quantity: number;
  isIncluded: boolean;
  gearItem: GearItem;
}

interface PublicPackList {
  id: string;
  name: string;
  description?: string;
  shareSlug: string;
  stats: PackListStats;
  items: PackListItem[];
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
  };
}

export default function PublicPackListPage() {
  const params = useParams();
  const shareSlug = params.shareSlug as string;

  const [packList, setPackList] = useState<PublicPackList | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPublicPackList() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/public/pack-lists/${shareSlug}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Pack list not found or no longer public');
          }
          throw new Error('Failed to load pack list');
        }

        const data = await response.json();
        setPackList(data);
      } catch (err) {
        console.error('Error fetching public pack list:', err);
        setError(err instanceof Error ? err.message : 'Failed to load pack list');
      } finally {
        setIsLoading(false);
      }
    }

    if (shareSlug) {
      fetchPublicPackList();
    }
  }, [shareSlug]);

  const copyURL = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Pack list URL copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy URL:', err);
      prompt('Copy this URL:', window.location.href);
    }
  };

  const copyToMyList = async () => {
    // This would require authentication, so redirect to login if not logged in
    const response = await fetch('/api/auth/session');
    if (!response.ok) {
      alert('Please sign in to copy this pack list to your account');
      window.location.href = '/login';
      return;
    }

    try {
      const copyResponse = await fetch(`/api/pack-lists/${packList?.id}/copy`, {
        method: 'POST',
      });

      if (copyResponse.ok) {
        const newPackList = await copyResponse.json();
        alert('Pack list copied to your account!');
        window.location.href = `/lists/${newPackList.id}`;
      } else {
        throw new Error('Failed to copy pack list');
      }
    } catch (error) {
      console.error('Error copying pack list:', error);
      alert('Failed to copy pack list. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div
        className="w-full min-h-screen flex items-center justify-center"
        style={{ padding: '2rem clamp(2rem, 5vw, 8rem)' }}
      >
        Loading pack list...
      </div>
    );
  }

  if (error || !packList) {
    return (
      <div
        className="w-full min-h-screen flex items-center justify-center"
        style={{ padding: '2rem clamp(2rem, 5vw, 8rem)' }}
      >
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Globe className="h-16 w-16 text-muted-foreground mb-6" />
            <h3 className="text-lg font-semibold mb-2">Pack List Not Found</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              {error || 'This pack list may have been made private or deleted.'}
            </p>
            <Button asChild>
              <Link href="/">Visit Featherweight</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-screen"
      style={{ padding: '2rem clamp(2rem, 5vw, 8rem)' }}
    >
      <PageHeader
        title={packList.name}
        description={
          packList.description ||
          `Shared by ${packList.user.name} • Updated ${new Date(packList.updatedAt).toLocaleDateString()}`
        }
      >
        <div className="flex items-center gap-2">
          <Badge variant="default">
            <Globe className="mr-1 h-3 w-3" />
            Public
          </Badge>

          <Button variant="outline" onClick={copyURL}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Link
          </Button>

          <Button variant="outline" onClick={copyToMyList}>
            <Share className="mr-2 h-4 w-4" />
            Copy to My Lists
          </Button>

          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Visit Featherweight
            </Link>
          </Button>
        </div>
      </PageHeader>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{packList.stats.itemCount}</div>
            <CardDescription>Total gear items</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Base Weight</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {packList.stats.baseWeight > 0 ? formatWeight(packList.stats.baseWeight) : '--'}
            </div>
            <CardDescription>Excluding worn & consumable</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Total Weight</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {packList.stats.totalWeight > 0 ? formatWeight(packList.stats.totalWeight) : '--'}
            </div>
            <CardDescription>All included items</CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Pack List Items Table */}
      <Card>
        <CardContent className="p-0">
          <PublicPackListTable items={packList.items} />
        </CardContent>
      </Card>

      {/* Footer with Featherweight Branding */}
      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>
          Created with{' '}
          <Link href="/" className="font-medium hover:text-primary">
            Featherweight
          </Link>{' '}
          - The modern gear management platform for ultralight backpackers
        </p>
      </div>
    </div>
  );
}