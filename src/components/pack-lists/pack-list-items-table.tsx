'use client';

import { useState } from 'react';

import { Eye, EyeOff, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { WeightDisplay } from '@/components/ui/weight-display';
import { WeightUnit } from '@/lib/weight-utils';

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

interface PackListItemsTableProps {
  items: PackListItem[];
  onItemUpdated: (item: PackListItem) => void;
  onItemRemoved: (itemId: string) => void;
  packListId: string;
  preferredUnit?: WeightUnit;
}

export function PackListItemsTable({
  items,
  onItemUpdated,
  onItemRemoved,
  packListId,
  preferredUnit,
}: PackListItemsTableProps) {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(1);

  const handleIncludedChange = async (
    item: PackListItem,
    included: boolean
  ) => {
    try {
      const response = await fetch(
        `/api/pack-lists/${packListId}/items/${item.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            isIncluded: included,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update item');
      }

      const updatedItem = await response.json();
      onItemUpdated(updatedItem);
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Failed to update item. Please try again.');
    }
  };

  const handleQuantityEdit = (item: PackListItem) => {
    setEditingItem(item.id);
    setEditQuantity(item.quantity);
  };

  const handleQuantitySave = async (item: PackListItem) => {
    try {
      const response = await fetch(
        `/api/pack-lists/${packListId}/items/${item.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            quantity: editQuantity,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }

      const updatedItem = await response.json();
      onItemUpdated(updatedItem);
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity. Please try again.');
    }
  };

  const handleQuantityCancel = () => {
    setEditingItem(null);
    setEditQuantity(1);
  };

  const handleDelete = async (item: PackListItem) => {
    if (
      !confirm(`Remove &quot;${item.gearItem.name}&quot; from this pack list?`)
    ) {
      return;
    }

    try {
      const response = await fetch(
        `/api/pack-lists/${packListId}/items/${item.id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to remove item');
      }

      onItemRemoved(item.id);
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item. Please try again.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          No items in this pack list yet
        </p>
        <p className="text-sm text-muted-foreground">
          Use the "Add Gear" button to add items from your gear library
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">Inc.</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Unit Weight</TableHead>
          <TableHead className="w-[100px]">Qty</TableHead>
          <TableHead>Total Weight</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map(item => {
          const totalWeight = item.gearItem.weight * item.quantity;
          const isEditing = editingItem === item.id;

          return (
            <TableRow
              key={item.id}
              className={!item.isIncluded ? 'opacity-50' : ''}
            >
              <TableCell>
                <Checkbox
                  checked={item.isIncluded}
                  onCheckedChange={checked =>
                    handleIncludedChange(item, checked as boolean)
                  }
                />
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">{item.gearItem.name}</div>
                  {item.gearItem.description && (
                    <div className="text-sm text-muted-foreground line-clamp-2">
                      {item.gearItem.description}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  style={{
                    backgroundColor: `${item.gearItem.category.color}20`,
                    borderColor: item.gearItem.category.color,
                    color: item.gearItem.category.color,
                  }}
                >
                  {item.gearItem.category.name}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="font-mono">
                  <WeightDisplay
                    grams={item.gearItem.weight}
                    preferredUnit={preferredUnit}
                  />
                </span>
              </TableCell>
              <TableCell>
                {isEditing ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={editQuantity}
                      onChange={e =>
                        setEditQuantity(parseInt(e.target.value) || 1)
                      }
                      className="w-16"
                      min="1"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleQuantitySave(item)}
                      className="px-2"
                    >
                      ✓
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleQuantityCancel}
                      className="px-2"
                    >
                      ✕
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityEdit(item)}
                    className="font-mono hover:bg-muted"
                  >
                    {item.quantity}
                  </Button>
                )}
              </TableCell>
              <TableCell>
                <span className="font-mono font-semibold">
                  <WeightDisplay
                    grams={totalWeight}
                    preferredUnit={preferredUnit}
                  />
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-1">
                  {item.gearItem.isWorn && (
                    <Badge variant="outline" className="text-xs">
                      Worn
                    </Badge>
                  )}
                  {item.gearItem.isConsumable && (
                    <Badge variant="outline" className="text-xs">
                      Consumable
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        handleIncludedChange(item, !item.isIncluded)
                      }
                    >
                      {item.isIncluded ? (
                        <>
                          <EyeOff className="mr-2 h-4 w-4" />
                          Exclude
                        </>
                      ) : (
                        <>
                          <Eye className="mr-2 h-4 w-4" />
                          Include
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleQuantityEdit(item)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Quantity
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(item)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
