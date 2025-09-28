'use client';

import { useState } from 'react';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { List, Plus, Search } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { PackListCard } from '@/components/pack-lists/pack-list-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { usePackLists } from '@/hooks/use-pack-lists';

export default function PackListsPage() {
  const { data: session, status } = useSession();
  const { packLists, isLoading, error, deletePackList } = usePackLists();
  const [searchTerm, setSearchTerm] = useState('');

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

  if (error) {
    return (
      <div
        className="w-full min-h-screen flex items-center justify-center"
        style={{ padding: '2rem clamp(2rem, 5vw, 8rem)' }}
      >
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading pack lists</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  // Filter pack lists based on search term
  const filteredPackLists = packLists.filter(
    list =>
      list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      list.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (packList: any) => {
    if (confirm(`Are you sure you want to delete "${packList.name}"?`)) {
      try {
        await deletePackList(packList.id);
      } catch (error) {
        console.error('Error deleting pack list:', error);
        alert('Failed to delete pack list. Please try again.');
      }
    }
  };

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
          <Input
            placeholder="Search pack lists..."
            className="pl-8"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading pack lists...</div>
        </div>
      ) : filteredPackLists.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <List className="h-16 w-16 text-muted-foreground mb-6" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm ? 'No pack lists found' : 'No pack lists yet'}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              {searchTerm
                ? "Try adjusting your search terms to find what you're looking for."
                : 'Create your first pack list to start planning trips and optimizing your gear selection.'}
            </p>
            <Button asChild>
              <Link href="/lists/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Pack List
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            {filteredPackLists.length} pack list
            {filteredPackLists.length !== 1 ? 's' : ''}
            {searchTerm && ` matching "${searchTerm}"`}
          </div>
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            }}
          >
            {filteredPackLists.map(packList => (
              <PackListCard
                key={packList.id}
                packList={packList}
                onEdit={packList => {
                  // TODO: Implement edit functionality
                  console.log('Edit pack list:', packList);
                }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
