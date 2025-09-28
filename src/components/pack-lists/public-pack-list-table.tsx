'use client';

import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatWeight } from '@/lib/utils';

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

interface PublicPackListTableProps {
  items: PackListItem[];
}

export function PublicPackListTable({ items }: PublicPackListTableProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">This pack list is empty</p>
      </div>
    );
  }

  // Calculate totals
  const totals = items.reduce(
    (acc, item) => {
      if (item.isIncluded) {
        const itemWeight = item.gearItem.weight * item.quantity;
        acc.totalWeight += itemWeight;

        if (!item.gearItem.isWorn && !item.gearItem.isConsumable) {
          acc.baseWeight += itemWeight;
        }
        acc.includedCount += 1;
      }
      return acc;
    },
    { totalWeight: 0, baseWeight: 0, includedCount: 0 }
  );

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Unit Weight</TableHead>
            <TableHead className="w-[80px]">Qty</TableHead>
            <TableHead>Total Weight</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="w-[80px]">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map(item => {
            const totalWeight = item.gearItem.weight * item.quantity;

            return (
              <TableRow
                key={item.id}
                className={!item.isIncluded ? 'opacity-50' : ''}
              >
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
                    {formatWeight(item.gearItem.weight)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-mono">{item.quantity}</span>
                </TableCell>
                <TableCell>
                  <span className="font-mono font-semibold">
                    {formatWeight(totalWeight)}
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
                    {!item.gearItem.isWorn && !item.gearItem.isConsumable && (
                      <Badge variant="outline" className="text-xs">
                        Base
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={item.isIncluded ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {item.isIncluded ? 'Included' : 'Excluded'}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Totals Footer */}
      <div className="border-t bg-muted/50 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="font-semibold text-lg">{items.length}</div>
            <div className="text-sm text-muted-foreground">Total Items</div>
          </div>
          <div>
            <div className="font-semibold text-lg">{totals.includedCount}</div>
            <div className="text-sm text-muted-foreground">Included Items</div>
          </div>
          <div>
            <div className="font-semibold text-lg text-green-600">
              {formatWeight(totals.baseWeight)}
            </div>
            <div className="text-sm text-muted-foreground">Base Weight</div>
          </div>
          <div>
            <div className="font-semibold text-lg text-blue-600">
              {formatWeight(totals.totalWeight)}
            </div>
            <div className="text-sm text-muted-foreground">Total Weight</div>
          </div>
        </div>
      </div>
    </div>
  );
}
