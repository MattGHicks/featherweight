'use client';

import { useState } from 'react';

import { Check, Edit3, MoreHorizontal, Tags, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface GearItem {
  id: string;
  name: string;
  description?: string;
  weight: number;
  quantity: number;
  isWorn: boolean;
  isConsumable: boolean;
  categoryId: string;
  category: {
    id: string;
    name: string;
    color: string;
  };
}

interface Category {
  id: string;
  name: string;
  color: string;
}

interface BulkOperationsProps {
  selectedItems: string[];
  items: GearItem[];
  categories: Category[];
  onItemsUpdated: () => void;
  onSelectionChange: (selectedIds: string[]) => void;
}

type BulkOperation = 'edit' | 'delete' | 'categorize' | null;

export function BulkOperations({
  selectedItems,
  items,
  categories,
  onItemsUpdated,
  onSelectionChange,
}: BulkOperationsProps) {
  const [currentOperation, setCurrentOperation] = useState<BulkOperation>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Bulk edit form state
  const [bulkEditData, setBulkEditData] = useState({
    weight: '',
    quantity: '',
    categoryId: '',
    isWorn: false,
    isConsumable: false,
    description: '',
  });

  const selectedItemsData = items.filter(item =>
    selectedItems.includes(item.id)
  );
  const selectedCount = selectedItems.length;

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(items.map(item => item.id));
    }
  };

  const handleBulkEdit = async () => {
    if (selectedItems.length === 0) return;

    setIsLoading(true);
    try {
      const updates: any = {};

      if (bulkEditData.weight && !isNaN(Number(bulkEditData.weight))) {
        updates.weight = Number(bulkEditData.weight);
      }
      if (bulkEditData.quantity && !isNaN(Number(bulkEditData.quantity))) {
        updates.quantity = Number(bulkEditData.quantity);
      }
      if (bulkEditData.categoryId) {
        updates.categoryId = bulkEditData.categoryId;
      }
      if (bulkEditData.description.trim()) {
        updates.description = bulkEditData.description.trim();
      }

      updates.isWorn = bulkEditData.isWorn;
      updates.isConsumable = bulkEditData.isConsumable;

      const response = await fetch('/api/gear/bulk', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemIds: selectedItems,
          updates,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update items');
      }

      setBulkEditData({
        weight: '',
        quantity: '',
        categoryId: '',
        isWorn: false,
        isConsumable: false,
        description: '',
      });
      setCurrentOperation(null);
      onSelectionChange([]);
      onItemsUpdated();
    } catch (error) {
      console.error('Error updating items:', error);
      alert('Failed to update items. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;

    if (
      !confirm(
        `Are you sure you want to delete ${selectedCount} items? This action cannot be undone.`
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/gear/bulk', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemIds: selectedItems,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete items');
      }

      setCurrentOperation(null);
      onSelectionChange([]);
      onItemsUpdated();
    } catch (error) {
      console.error('Error deleting items:', error);
      alert('Failed to delete items. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkCategorize = async (categoryId: string) => {
    if (selectedItems.length === 0) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/gear/bulk', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemIds: selectedItems,
          updates: { categoryId },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to categorize items');
      }

      setCurrentOperation(null);
      onSelectionChange([]);
      onItemsUpdated();
    } catch (error) {
      console.error('Error categorizing items:', error);
      alert('Failed to categorize items. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Bulk Operations</CardTitle>
            <CardDescription>
              {selectedCount} item{selectedCount === 1 ? '' : 's'} selected
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedItems.length === items.length}
              onCheckedChange={handleSelectAll}
              aria-label="Select all items"
            />
            <span className="text-sm text-muted-foreground">Select All</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Selected Items Preview */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {selectedItemsData.slice(0, 5).map(item => (
              <Badge key={item.id} variant="secondary" className="text-xs">
                {item.name}
              </Badge>
            ))}
            {selectedCount > 5 && (
              <Badge variant="outline" className="text-xs">
                +{selectedCount - 5} more
              </Badge>
            )}
          </div>
        </div>

        {/* Operation Buttons */}
        {!currentOperation && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentOperation('edit')}
              disabled={isLoading}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Bulk Edit
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={isLoading}>
                  <Tags className="w-4 h-4 mr-2" />
                  Change Category
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {categories.map(category => (
                  <DropdownMenuItem
                    key={category.id}
                    onClick={() => handleBulkCategorize(category.id)}
                  >
                    <div
                      className="w-3 h-3 rounded mr-2"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={isLoading}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Selected
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelectionChange([])}
            >
              Clear Selection
            </Button>
          </div>
        )}

        {/* Bulk Edit Form */}
        {currentOperation === 'edit' && (
          <div className="space-y-4 border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bulk-weight">Weight (g)</Label>
                <Input
                  id="bulk-weight"
                  type="number"
                  placeholder="Leave empty to keep current"
                  value={bulkEditData.weight}
                  onChange={e =>
                    setBulkEditData({ ...bulkEditData, weight: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bulk-quantity">Quantity</Label>
                <Input
                  id="bulk-quantity"
                  type="number"
                  placeholder="Leave empty to keep current"
                  value={bulkEditData.quantity}
                  onChange={e =>
                    setBulkEditData({
                      ...bulkEditData,
                      quantity: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bulk-category">Category</Label>
                <Select
                  value={bulkEditData.categoryId}
                  onValueChange={value =>
                    setBulkEditData({ ...bulkEditData, categoryId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category to change" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded mr-2"
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bulk-description">Description</Label>
              <Textarea
                id="bulk-description"
                placeholder="Leave empty to keep current descriptions"
                value={bulkEditData.description}
                onChange={e =>
                  setBulkEditData({
                    ...bulkEditData,
                    description: e.target.value,
                  })
                }
                rows={3}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bulk-worn"
                  checked={bulkEditData.isWorn}
                  onCheckedChange={checked =>
                    setBulkEditData({
                      ...bulkEditData,
                      isWorn: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="bulk-worn">Mark as worn</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bulk-consumable"
                  checked={bulkEditData.isConsumable}
                  onCheckedChange={checked =>
                    setBulkEditData({
                      ...bulkEditData,
                      isConsumable: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="bulk-consumable">Mark as consumable</Label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleBulkEdit} disabled={isLoading}>
                <Check className="w-4 h-4 mr-2" />
                {isLoading ? 'Updating...' : 'Apply Changes'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentOperation(null)}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
