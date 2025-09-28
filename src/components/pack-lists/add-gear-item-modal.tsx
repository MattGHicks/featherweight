'use client';

import { useEffect, useState } from 'react';
import { Search, Plus } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatWeight } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  color: string;
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
  category: Category;
}

interface PackListItem {
  id: string;
  gearItemId: string;
  quantity: number;
  isIncluded: boolean;
  gearItem: GearItem;
}

interface AddGearItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onItemAdded: (item: PackListItem) => void;
  packListId: string;
}

export function AddGearItemModal({
  isOpen,
  onClose,
  onItemAdded,
  packListId,
}: AddGearItemModalProps) {
  const [gearItems, setGearItems] = useState<GearItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    async function fetchData() {
      try {
        setIsLoading(true);

        const [gearResponse, categoriesResponse] = await Promise.all([
          fetch('/api/gear'),
          fetch('/api/categories'),
        ]);

        if (!gearResponse.ok || !categoriesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [gearData, categoriesData] = await Promise.all([
          gearResponse.json(),
          categoriesResponse.json(),
        ]);

        setGearItems(gearData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [isOpen]);

  const handleClose = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedItems(new Set());
    onClose();
  };

  const handleItemToggle = (itemId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleSubmit = async () => {
    if (selectedItems.size === 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const promises = Array.from(selectedItems).map(async (gearItemId) => {
        const response = await fetch(`/api/pack-lists/${packListId}/items`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            gearItemId,
            quantity: 1,
            isIncluded: true,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to add item');
        }

        return response.json();
      });

      const addedItems = await Promise.all(promises);

      // Notify parent of each added item
      addedItems.forEach(item => onItemAdded(item));

      handleClose();
    } catch (error) {
      console.error('Error adding items:', error);
      alert('Failed to add some items. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter gear items based on search and category
  const filteredGearItems = gearItems.filter(item => {
    const matchesSearch = !searchTerm ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || item.category.id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Gear Items</DialogTitle>
          <DialogDescription>
            Select gear items from your library to add to this pack list
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Search and Filter Controls */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search gear items..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-48">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Selected Items Count */}
          {selectedItems.size > 0 && (
            <div className="text-sm text-muted-foreground">
              {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
            </div>
          )}

          {/* Gear Items List */}
          <div className="flex-1 overflow-auto border rounded-lg">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">Loading gear items...</div>
              </div>
            ) : filteredGearItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground mb-2">
                  {searchTerm || selectedCategory !== 'all'
                    ? 'No gear items match your filters'
                    : 'No gear items found'
                  }
                </p>
                {!searchTerm && selectedCategory === 'all' && (
                  <p className="text-sm text-muted-foreground">
                    Add some gear items to your library first
                  </p>
                )}
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {filteredGearItems.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleItemToggle(item.id)}
                  >
                    <Checkbox
                      checked={selectedItems.has(item.id)}
                      onCheckedChange={() => handleItemToggle(item.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="font-medium truncate">{item.name}</div>
                          {item.description && (
                            <div className="text-sm text-muted-foreground line-clamp-2">
                              {item.description}
                            </div>
                          )}
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="secondary"
                              style={{
                                backgroundColor: `${item.category.color}20`,
                                borderColor: item.category.color,
                                color: item.category.color,
                              }}
                            >
                              {item.category.name}
                            </Badge>
                            {item.isWorn && (
                              <Badge variant="outline" className="text-xs">
                                Worn
                              </Badge>
                            )}
                            {item.isConsumable && (
                              <Badge variant="outline" className="text-xs">
                                Consumable
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="font-mono font-semibold">
                            {formatWeight(item.weight)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedItems.size === 0 || isSubmitting}
          >
            {isSubmitting ? (
              'Adding...'
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add {selectedItems.size} Item{selectedItems.size !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}