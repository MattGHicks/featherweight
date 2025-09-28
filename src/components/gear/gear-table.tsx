'use client';

import { useState } from 'react';

import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Edit2,
  ExternalLink,
  MoreHorizontal,
  Trash2,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

interface Category {
  id: string;
  name: string;
  color?: string;
}

interface GearItem {
  id: string;
  name: string;
  description?: string;
  weight: number;
  quantity: number;
  isWorn: boolean;
  isConsumable: boolean;
  imageUrl?: string;
  retailerUrl?: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

type SortField =
  | 'name'
  | 'category'
  | 'weight'
  | 'quantity'
  | 'totalWeight'
  | 'createdAt'
  | 'updatedAt';
type SortDirection = 'asc' | 'desc';

interface GearTableProps {
  gearItems: GearItem[];
  onEdit?: (item: GearItem) => void;
  onDelete?: (item: GearItem) => void;
  selectedItems?: string[];
  onItemSelectionChange?: (itemId: string, selected: boolean) => void;
  preferredUnit?: WeightUnit;
}

export function GearTable({
  gearItems,
  onEdit,
  onDelete,
  selectedItems = [],
  onItemSelectionChange,
  preferredUnit,
}: GearTableProps) {
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortDirection === 'asc' ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  const sortedItems = [...gearItems].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortField) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'category':
        aValue = a.category.name.toLowerCase();
        bValue = b.category.name.toLowerCase();
        break;
      case 'weight':
        aValue = a.weight;
        bValue = b.weight;
        break;
      case 'quantity':
        aValue = a.quantity;
        bValue = b.quantity;
        break;
      case 'totalWeight':
        aValue = a.weight * a.quantity;
        bValue = b.weight * b.quantity;
        break;
      case 'createdAt':
      case 'updatedAt':
        aValue = new Date(a[sortField]);
        bValue = new Date(b[sortField]);
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="w-full">
      {/* Mobile view - stacked cards */}
      <div className="block md:hidden space-y-4">
        {sortedItems.map(item => (
          <Card key={item.id} className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{item.name}</h3>
                  {item.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {item.description}
                    </p>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 ml-2">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(item)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    {item.retailerUrl && (
                      <DropdownMenuItem asChild>
                        <a
                          href={item.retailerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Product
                        </a>
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem
                        onClick={() => onDelete(item)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  style={{
                    backgroundColor: item.category.color,
                    color: 'white',
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

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Unit Weight:</span>
                  <WeightDisplay
                    grams={item.weight}
                    className="ml-2"
                    preferredUnit={preferredUnit}
                  />
                </div>
                <div>
                  <span className="text-muted-foreground">Quantity:</span>
                  <span className="ml-2">{item.quantity}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Weight:</span>
                  <WeightDisplay
                    grams={item.weight * item.quantity}
                    className="ml-2 font-medium"
                    preferredUnit={preferredUnit}
                  />
                </div>
                <div>
                  <span className="text-muted-foreground">Added:</span>
                  <span className="ml-2">{formatDate(item.createdAt)}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop view - table */}
      <div className="hidden md:block">
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {onItemSelectionChange && (
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={
                          selectedItems.length === gearItems.length &&
                          gearItems.length > 0
                        }
                        onCheckedChange={checked => {
                          gearItems.forEach(item => {
                            onItemSelectionChange(item.id, checked as boolean);
                          });
                        }}
                        aria-label="Select all items"
                      />
                    </TableHead>
                  )}
                  <TableHead className="min-w-[200px]">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('name')}
                      className="h-auto p-0 font-semibold justify-start w-full"
                    >
                      Name
                      {getSortIcon('name')}
                    </Button>
                  </TableHead>
                  <TableHead className="min-w-[120px]">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('category')}
                      className="h-auto p-0 font-semibold justify-start w-full"
                    >
                      Category
                      {getSortIcon('category')}
                    </Button>
                  </TableHead>
                  <TableHead className="min-w-[100px] text-right">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('weight')}
                      className="h-auto p-0 font-semibold justify-end w-full"
                    >
                      Unit Weight
                      {getSortIcon('weight')}
                    </Button>
                  </TableHead>
                  <TableHead className="min-w-[60px] text-center">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('quantity')}
                      className="h-auto p-0 font-semibold justify-center w-full"
                    >
                      Qty
                      {getSortIcon('quantity')}
                    </Button>
                  </TableHead>
                  <TableHead className="min-w-[120px] text-right">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('totalWeight')}
                      className="h-auto p-0 font-semibold justify-end w-full"
                    >
                      Total Weight
                      {getSortIcon('totalWeight')}
                    </Button>
                  </TableHead>
                  <TableHead className="min-w-[100px]">Type</TableHead>
                  <TableHead className="min-w-[80px] text-right">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('createdAt')}
                      className="h-auto p-0 font-semibold justify-end w-full"
                    >
                      Added
                      {getSortIcon('createdAt')}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedItems.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={onItemSelectionChange ? 9 : 8}
                      className="text-center text-muted-foreground py-8"
                    >
                      No gear items found
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedItems.map(item => (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      {onItemSelectionChange && (
                        <TableCell className="p-4">
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={checked => {
                              onItemSelectionChange(
                                item.id,
                                checked as boolean
                              );
                            }}
                            aria-label={`Select ${item.name}`}
                          />
                        </TableCell>
                      )}
                      <TableCell className="p-4">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          {item.description && (
                            <div className="text-sm text-muted-foreground line-clamp-1 mt-1">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="p-4">
                        <Badge
                          variant="secondary"
                          style={{
                            backgroundColor: item.category.color,
                            color: 'white',
                          }}
                        >
                          {item.category.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="p-4 text-right font-mono tabular-nums">
                        <WeightDisplay
                          grams={item.weight}
                          preferredUnit={preferredUnit}
                        />
                      </TableCell>
                      <TableCell className="p-4 text-center tabular-nums">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="p-4 text-right font-mono font-medium tabular-nums">
                        <WeightDisplay
                          grams={item.weight * item.quantity}
                          preferredUnit={preferredUnit}
                        />
                      </TableCell>
                      <TableCell className="p-4">
                        <div className="flex flex-wrap gap-1">
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
                          {!item.isWorn && !item.isConsumable && (
                            <Badge variant="outline" className="text-xs">
                              Base
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="p-4 text-right text-sm text-muted-foreground">
                        {formatDate(item.createdAt)}
                      </TableCell>
                      <TableCell className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {onEdit && (
                              <DropdownMenuItem onClick={() => onEdit(item)}>
                                <Edit2 className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            {item.retailerUrl && (
                              <DropdownMenuItem asChild>
                                <a
                                  href={item.retailerUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  View Product
                                </a>
                              </DropdownMenuItem>
                            )}
                            {onDelete && (
                              <DropdownMenuItem
                                onClick={() => onDelete(item)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {sortedItems.length > 0 && (
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {sortedItems.length} item{sortedItems.length !== 1 ? 's' : ''}
          • Total weight:{' '}
          <WeightDisplay
            grams={sortedItems.reduce(
              (sum, item) => sum + item.weight * item.quantity,
              0
            )}
            preferredUnit={preferredUnit}
          />
        </div>
      )}
    </div>
  );
}
