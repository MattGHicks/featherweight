'use client';

import { useEffect, useState } from 'react';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { redirect, useParams } from 'next/navigation';

import {
  ArrowLeft,
  BarChart3,
  Download,
  Package,
  Plus,
  Search,
  Share,
} from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { AddGearItemModal } from '@/components/pack-lists/add-gear-item-modal';
import { PackListAnalytics } from '@/components/pack-lists/pack-list-analytics';
import { PackListItemsTable } from '@/components/pack-lists/pack-list-items-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WeightDisplay } from '@/components/ui/weight-display';
import { useUserPreferences } from '@/contexts/user-preferences-context';

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
  quantity: number;
  imageUrl?: string;
  isWorn: boolean;
  isConsumable: boolean;
  retailerUrl?: string;
  category: {
    id: string;
    name: string;
    color: string;
  };
}

interface PackListItem {
  id: string;
  gearItemId: string;
  quantity: number;
  isIncluded: boolean;
  gearItem: GearItem;
}

interface PackList {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  shareSlug?: string;
  stats: PackListStats;
  items: PackListItem[];
  createdAt: string;
  updatedAt: string;
}

export default function PackListDetailPage() {
  const { data: session, status } = useSession();
  const { preferences } = useUserPreferences();
  const params = useParams();
  const packListId = params.id as string;

  const [packList, setPackList] = useState<PackList | null>(null);
  const [userGoals, setUserGoals] = useState<{
    baseWeightGoal?: number;
    totalWeightGoal?: number;
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    if (!session) {
      setIsLoading(false);
      return;
    }

    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch pack list and user goals in parallel
        const [packListResponse, goalsResponse] = await Promise.all([
          fetch(`/api/pack-lists/${packListId}`),
          fetch('/api/user/goals'),
        ]);

        if (!packListResponse.ok) {
          if (packListResponse.status === 404) {
            throw new Error('Pack list not found');
          }
          throw new Error('Failed to fetch pack list');
        }

        const packListData = await packListResponse.json();
        setPackList(packListData);

        // Goals response might fail if user hasn't set goals yet
        if (goalsResponse.ok) {
          const goalsData = await goalsResponse.json();
          setUserGoals(goalsData);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load pack list'
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [session, packListId]);

  if (status === 'loading' || isLoading) {
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

  if (error) {
    return (
      <div
        className="w-full min-h-screen flex items-center justify-center"
        style={{ padding: '2rem clamp(2rem, 5vw, 8rem)' }}
      >
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button asChild>
            <Link href="/lists">Back to Pack Lists</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!packList) {
    return null;
  }

  // Filter items based on search term
  const filteredItems = packList.items.filter(
    item =>
      item.gearItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.gearItem.category.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.gearItem.description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleItemAdded = (newItem: PackListItem) => {
    setPackList(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        items: [...prev.items, newItem],
        stats: {
          ...prev.stats,
          itemCount: prev.stats.itemCount + 1,
          totalWeight:
            prev.stats.totalWeight + newItem.gearItem.weight * newItem.quantity,
          baseWeight:
            prev.stats.baseWeight +
            (!newItem.gearItem.isConsumable && !newItem.gearItem.isWorn
              ? newItem.gearItem.weight * newItem.quantity
              : 0),
        },
      };
    });
  };

  const handleItemUpdated = (updatedItem: PackListItem) => {
    setPackList(prev => {
      if (!prev) return prev;

      const oldItem = prev.items.find(item => item.id === updatedItem.id);
      if (!oldItem) return prev;

      const newItems = prev.items.map(item =>
        item.id === updatedItem.id ? updatedItem : item
      );

      // Recalculate stats
      const totalWeight = newItems.reduce((sum, item) => {
        return sum + item.gearItem.weight * item.quantity;
      }, 0);

      const baseWeight = newItems.reduce((sum, item) => {
        if (!item.gearItem.isConsumable && !item.gearItem.isWorn) {
          return sum + item.gearItem.weight * item.quantity;
        }
        return sum;
      }, 0);

      return {
        ...prev,
        items: newItems,
        stats: {
          totalWeight,
          baseWeight,
          itemCount: newItems.length,
        },
      };
    });
  };

  const handleItemRemoved = (itemId: string) => {
    setPackList(prev => {
      if (!prev) return prev;

      const newItems = prev.items.filter(item => item.id !== itemId);

      // Recalculate stats
      const totalWeight = newItems.reduce((sum, item) => {
        return sum + item.gearItem.weight * item.quantity;
      }, 0);

      const baseWeight = newItems.reduce((sum, item) => {
        if (!item.gearItem.isConsumable && !item.gearItem.isWorn) {
          return sum + item.gearItem.weight * item.quantity;
        }
        return sum;
      }, 0);

      return {
        ...prev,
        items: newItems,
        stats: {
          totalWeight,
          baseWeight,
          itemCount: newItems.length,
        },
      };
    });
  };

  const exportAsCSV = () => {
    if (!packList) return;

    const headers = [
      'Item Name',
      'Category',
      'Description',
      'Qty',
      'Weight (g)',
      'Unit Weight (g)',
      'Type',
    ];
    const rows = packList.items.map(item => [
      item.gearItem.name,
      item.gearItem.category.name,
      item.gearItem.description || '',
      item.quantity,
      item.gearItem.weight * item.quantity,
      item.gearItem.weight,
      `${item.gearItem.isWorn ? 'Worn' : ''}${item.gearItem.isConsumable ? ' Consumable' : ''}`.trim() ||
        'Base',
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `${packList.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyShareURL = async () => {
    if (!packList || !packList.isPublic || !packList.shareSlug) {
      alert('This pack list must be public to share');
      return;
    }

    const shareURL = `${window.location.origin}/lists/${packList.id}?share=${packList.shareSlug}`;
    try {
      await navigator.clipboard.writeText(shareURL);
      alert('Share URL copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy URL:', err);
      prompt('Copy this URL to share:', shareURL);
    }
  };

  return (
    <div
      className="w-full min-h-screen"
      style={{ padding: '2rem clamp(2rem, 5vw, 8rem)' }}
    >
      <PageHeader
        title={packList.name}
        description={packList.description || 'Pack list details and gear items'}
      >
        <div className="flex items-center gap-2">
          <Badge variant={packList.isPublic ? 'default' : 'secondary'}>
            {packList.isPublic ? 'Public' : 'Private'}
          </Badge>

          {/* Export and Share Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={exportAsCSV}>
                <Download className="mr-2 h-4 w-4" />
                Export as CSV
              </DropdownMenuItem>
              {packList.isPublic && packList.shareSlug && (
                <DropdownMenuItem onClick={copyShareURL}>
                  <Share className="mr-2 h-4 w-4" />
                  Copy Share Link
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" asChild>
            <Link href="/lists">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Pack Lists
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
              {packList.stats.baseWeight > 0 ? (
                <WeightDisplay
                  grams={packList.stats.baseWeight}
                  preferredUnit={preferences?.preferredUnits}
                />
              ) : (
                '--'
              )}
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
              {packList.stats.totalWeight > 0 ? (
                <WeightDisplay
                  grams={packList.stats.totalWeight}
                  preferredUnit={preferences?.preferredUnits}
                />
              ) : (
                '--'
              )}
            </div>
            <CardDescription>All included items</CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Interface */}
      <Tabs defaultValue="items" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="items" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Items
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="space-y-6">
          {/* Search and Add Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1 max-w-sm">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search gear items..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Gear
            </Button>
          </div>

          {/* Pack List Items Table */}
          <Card>
            <CardContent className="p-0">
              <PackListItemsTable
                items={filteredItems}
                onItemUpdated={handleItemUpdated}
                onItemRemoved={handleItemRemoved}
                packListId={packListId}
                preferredUnit={preferences?.preferredUnits}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <PackListAnalytics
            items={packList.items}
            userGoals={userGoals}
            preferredUnit={preferences?.preferredUnits}
          />
        </TabsContent>
      </Tabs>

      {/* Add Gear Item Modal */}
      <AddGearItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onItemAdded={handleItemAdded}
        packListId={packListId}
      />
    </div>
  );
}
