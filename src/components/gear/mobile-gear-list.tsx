'use client';

import { useState } from 'react';

import { Edit, ExternalLink, Package, Trash2, Weight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { SwipeCard } from '@/components/ui/swipe-card';
import { TouchButton } from '@/components/ui/touch-friendly-button';
import { WeightDisplay } from '@/components/ui/weight-display';
import { WeightUnit } from '@/lib/weight-utils';

interface GearItem {
  id: string;
  name: string;
  description?: string;
  weight: number;
  quantity: number;
  categoryId: string;
  isWorn: boolean;
  isConsumable: boolean;
  category: {
    name: string;
    color: string;
  };
  retailerUrl?: string;
}

interface MobileGearListProps {
  items: GearItem[];
  onEdit: (item: GearItem) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
  preferredUnit?: WeightUnit;
}

export function MobileGearList({
  items,
  onEdit,
  onDelete,
  isLoading,
  preferredUnit,
}: MobileGearListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="animate-pulse">
            <div className="bg-muted h-20 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-medium mb-2">No gear items yet</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Start building your gear collection by adding your first item
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map(item => (
        <SwipeCard
          key={item.id}
          onSwipeLeft={() => handleDelete(item.id)}
          onSwipeRight={() => onEdit(item)}
          leftAction={{
            icon: <Trash2 className="h-5 w-5" />,
            color: 'bg-destructive',
            label: 'Delete',
          }}
          rightAction={{
            icon: <Edit className="h-5 w-5" />,
            color: 'bg-primary',
            label: 'Edit',
          }}
          className="bg-card border rounded-lg"
        >
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{item.name}</h3>
                {item.description && (
                  <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                    {item.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 ml-3">
                <TouchButton
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onEdit(item)}
                  disabled={deletingId === item.id}
                >
                  <Edit className="h-4 w-4" />
                </TouchButton>
                <TouchButton
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                >
                  <Trash2 className="h-4 w-4" />
                </TouchButton>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-sm">
                  <Weight className="h-3 w-3" />
                  <span className="font-medium">
                    <WeightDisplay
                      grams={item.weight * item.quantity}
                      preferredUnit={preferredUnit}
                    />
                  </span>
                </div>
                {item.quantity > 1 && (
                  <div className="text-sm text-muted-foreground">
                    {item.quantity}x <WeightDisplay
                      grams={item.weight}
                      preferredUnit={preferredUnit}
                    /> each
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  style={{
                    borderColor: item.category.color,
                    color: item.category.color,
                  }}
                  className="text-xs"
                >
                  {item.category.name}
                </Badge>

                {item.isWorn && (
                  <Badge variant="secondary" className="text-xs">
                    Worn
                  </Badge>
                )}

                {item.isConsumable && (
                  <Badge variant="secondary" className="text-xs">
                    Consumable
                  </Badge>
                )}

                {item.retailerUrl && (
                  <TouchButton
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => window.open(item.retailerUrl, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </TouchButton>
                )}
              </div>
            </div>
          </div>
        </SwipeCard>
      ))}

      <div className="text-center text-xs text-muted-foreground py-2">
        Swipe right to edit • Swipe left to delete
      </div>
    </div>
  );
}
