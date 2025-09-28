'use client';

import Image from 'next/image';

import { Edit2, ExternalLink, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { WeightDisplay } from '@/components/ui/weight-display';
import type { GearItemWithCategory } from '@/types';

interface GearItemCardProps {
  item: GearItemWithCategory;
  onEdit?: (item: GearItemWithCategory) => void;
  onDelete?: (item: GearItemWithCategory) => void;
}

export function GearItemCard({ item, onEdit, onDelete }: GearItemCardProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-md">
      <div className="relative aspect-square">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <span className="text-2xl text-muted-foreground">
              {item.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                <Edit2 className="h-4 w-4" />
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

        <div className="absolute bottom-2 left-2">
          <Badge
            variant="secondary"
            style={{ backgroundColor: item.category.color }}
            className="text-white"
          >
            {item.category.name}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold leading-none tracking-tight">
            {item.name}
          </h3>
          {item.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {item.description}
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold">
            <WeightDisplay grams={item.weight * item.quantity} />
          </span>
          {item.quantity > 1 && (
            <Badge variant="outline">×{item.quantity}</Badge>
          )}
        </div>

        <div className="flex space-x-1">
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
      </CardFooter>
    </Card>
  );
}
