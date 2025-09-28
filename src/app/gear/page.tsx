'use client';

import { useSession } from 'next-auth/react';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Package, Plus, Table as TableIcon, Grid3X3, Upload, Smartphone } from 'lucide-react';

import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GearTable } from '@/components/gear/gear-table';
import { GearFilters } from '@/components/gear/gear-filters';
import { GearItemCard } from '@/components/gear/gear-item-card';
import { GearEditDialog } from '@/components/gear/gear-edit-dialog';
import { CSVImportDialog } from '@/components/gear/csv-import-dialog';
import { BulkOperations } from '@/components/gear/bulk-operations';
import { MobileGearList } from '@/components/gear/mobile-gear-list';
import { FloatingActionButton } from '@/components/ui/floating-action-button';
import { TouchButton } from '@/components/ui/touch-friendly-button';
import { useGear } from '@/hooks/use-gear';
import { WeightDisplay } from '@/components/ui/weight-display';

type ViewMode = 'table' | 'grid' | 'mobile';

export default function GearPage() {
  const { data: session, status } = useSession();
  const { gearItems, categories, isLoading, error, deleteGearItem, updateGearItem } = useGear();

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // View and filter state - automatically set mobile view on mobile devices
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  useEffect(() => {
    if (isMobile && viewMode !== 'mobile') {
      setViewMode('mobile');
    }
  }, [isMobile, viewMode]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Selection state for bulk operations
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [csvImportOpen, setCsvImportOpen] = useState(false);

  // Enhanced filtering logic - MUST be before early returns to follow hooks rules
  const filteredGearItems = useMemo(() => {
    return gearItems.filter(item => {
      // Search filter
      const matchesSearch = !searchTerm ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.name.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory = !selectedCategory || item.category.id === selectedCategory;

      // Type filter
      const matchesType = !selectedType ||
        (selectedType === 'base' && !item.isWorn && !item.isConsumable) ||
        (selectedType === 'worn' && item.isWorn) ||
        (selectedType === 'consumable' && item.isConsumable);

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [gearItems, searchTerm, selectedCategory, selectedType]);

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

  const hasActiveFilters = !!(searchTerm || selectedCategory || selectedType);

  if (error) {
    return (
      <div
        className="w-full min-h-screen flex items-center justify-center"
        style={{ padding: '2rem clamp(2rem, 5vw, 8rem)' }}
      >
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading gear items</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSelectedType(null);
  };

  const handleItemsUpdated = () => {
    // Refresh gear data after bulk operations
    window.location.reload();
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setEditDialogOpen(true);
  };

  const handleUpdate = async (data: any) => {
    try {
      setIsUpdating(true);
      await updateGearItem(data.id, {
        name: data.name,
        description: data.description,
        weight: data.weight,
        quantity: data.quantity,
        categoryId: data.categoryId,
        imageUrl: data.imageUrl,
        isWorn: data.isWorn,
        isConsumable: data.isConsumable,
        retailerUrl: data.retailerUrl,
      });
    } catch (error) {
      console.error('Error updating gear item:', error);
      alert('Failed to update gear item. Please try again.');
      throw error; // Re-throw to prevent dialog from closing
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (item: any) => {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      try {
        await deleteGearItem(item.id);
      } catch (error) {
        console.error('Error deleting gear item:', error);
        alert('Failed to delete gear item. Please try again.');
      }
    }
  };

  return (
    <div
      className="w-full min-h-screen"
      style={{ padding: '2rem clamp(2rem, 5vw, 8rem)' }}
    >
      <PageHeader
        title="Gear Library"
        description="Manage all your gear items with detailed weight tracking"
      >
        <div className="flex gap-2">
          {/* View Mode Toggle - Hidden on mobile since mobile view is automatic */}
          {!isMobile && (
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="border-none rounded-r-none"
              >
                <TableIcon className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="border-none rounded-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('mobile')}
                className="border-none rounded-l-none"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
          )}

          {!isMobile && (
            <Button variant="outline" onClick={() => setCsvImportOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Import CSV
            </Button>
          )}

          {isMobile ? (
            <TouchButton asChild>
              <Link href="/gear/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Gear
              </Link>
            </TouchButton>
          ) : (
            <Button asChild>
              <Link href="/gear/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Gear
              </Link>
            </Button>
          )}
        </div>
      </PageHeader>

      {/* Filters */}
      <div className="mb-6">
        <GearFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          categories={categories}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Bulk Operations - Hidden on mobile */}
      {!isMobile && (
        <BulkOperations
          selectedItems={selectedItems}
          items={filteredGearItems}
          categories={categories}
          onItemsUpdated={handleItemsUpdated}
          onSelectionChange={setSelectedItems}
        />
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading gear items...</div>
        </div>
      ) : filteredGearItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-16 w-16 text-muted-foreground mb-6" />
            <h3 className="text-lg font-semibold mb-2">
              {hasActiveFilters ? 'No gear items found' : 'No gear items yet'}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              {hasActiveFilters
                ? 'Try adjusting your filters to find what you\'re looking for.'
                : 'Start building your gear library by adding your first item. Track weights, categories, and more.'
              }
            </p>
            {hasActiveFilters ? (
              <Button onClick={handleClearFilters} variant="outline">
                Clear Filters
              </Button>
            ) : (
              <Button asChild>
                <Link href="/gear/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Gear Item
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Content based on view mode */}
          {viewMode === 'table' ? (
            <GearTable
              gearItems={filteredGearItems}
              onEdit={handleEdit}
              onDelete={handleDelete}
              selectedItems={selectedItems}
              onItemSelectionChange={(itemId, selected) => {
                if (selected) {
                  setSelectedItems([...selectedItems, itemId]);
                } else {
                  setSelectedItems(selectedItems.filter(id => id !== itemId));
                }
              }}
            />
          ) : viewMode === 'mobile' ? (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                {filteredGearItems.length} item{filteredGearItems.length !== 1 ? 's' : ''}
                {hasActiveFilters && ' (filtered)'}
                • Total weight: <WeightDisplay grams={filteredGearItems.reduce((sum, item) => sum + (item.weight * item.quantity), 0)} />
              </div>
              <MobileGearList
                items={filteredGearItems}
                onEdit={handleEdit}
                onDelete={async (id) => {
                  const item = filteredGearItems.find(item => item.id === id);
                  if (item) {
                    await handleDelete(item);
                  }
                }}
                isLoading={isLoading}
              />
            </>
          ) : (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                {filteredGearItems.length} item{filteredGearItems.length !== 1 ? 's' : ''}
                {hasActiveFilters && ' (filtered)'}
                • Total weight: <WeightDisplay grams={filteredGearItems.reduce((sum, item) => sum + (item.weight * item.quantity), 0)} />
              </div>
              <div
                className="grid gap-6"
                style={{
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                }}
              >
                {filteredGearItems.map((item) => (
                  <GearItemCard
                    key={item.id}
                    item={item}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Edit Dialog */}
      <GearEditDialog
        isOpen={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingItem(null);
        }}
        gearItem={editingItem}
        categories={categories}
        onSubmit={handleUpdate}
        isLoading={isUpdating}
      />

      <CSVImportDialog
        isOpen={csvImportOpen}
        onClose={() => setCsvImportOpen(false)}
        onImportComplete={() => {
          // Refresh gear data after import
          window.location.reload();
        }}
      />

      {/* Mobile Floating Action Button */}
      {isMobile && (
        <FloatingActionButton
          actions={[
            {
              icon: <Upload className="h-5 w-5" />,
              label: 'Import CSV',
              onClick: () => setCsvImportOpen(true),
              variant: 'secondary',
            },
          ]}
          mainAction={() => window.location.href = '/gear/new'}
        />
      )}
    </div>
  );
}
