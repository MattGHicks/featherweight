'use client';

import Link from 'next/link';

import { Edit2, Globe, Lock, MoreHorizontal, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { WeightDisplay } from '@/components/ui/weight-display';

interface PackListStats {
  totalWeight: number;
  baseWeight: number;
  itemCount: number;
}

interface PackListCardProps {
  packList: {
    id: string;
    name: string;
    description?: string;
    isPublic: boolean;
    stats: PackListStats;
    updatedAt: string;
  };
  onEdit?: (packList: any) => void;
  onDelete?: (packList: any) => void;
}

export function PackListCard({
  packList,
  onEdit,
  onDelete,
}: PackListCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1 min-w-0">
            <Link
              href={`/lists/${packList.id}`}
              className="block hover:text-primary transition-colors"
            >
              <h3 className="font-semibold leading-none tracking-tight truncate">
                {packList.name}
              </h3>
            </Link>
            {packList.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {packList.description}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2 ml-2">
            <Badge
              variant={packList.isPublic ? 'default' : 'secondary'}
              className="text-xs"
            >
              {packList.isPublic ? (
                <>
                  <Globe className="w-3 h-3 mr-1" />
                  Public
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3 mr-1" />
                  Private
                </>
              )}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(packList)}>
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem
                    onClick={() => onDelete(packList)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold">{packList.stats.itemCount}</div>
            <div className="text-xs text-muted-foreground">
              Item{packList.stats.itemCount !== 1 ? 's' : ''}
            </div>
          </div>
          <div>
            <div className="text-lg font-bold">
              {packList.stats.baseWeight > 0 ? (
                <WeightDisplay grams={packList.stats.baseWeight} />
              ) : (
                '--'
              )}
            </div>
            <div className="text-xs text-muted-foreground">Base Weight</div>
          </div>
          <div>
            <div className="text-lg font-bold">
              {packList.stats.totalWeight > 0 ? (
                <WeightDisplay grams={packList.stats.totalWeight} />
              ) : (
                '--'
              )}
            </div>
            <div className="text-xs text-muted-foreground">Total Weight</div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
          <span>Updated {formatDate(packList.updatedAt)}</span>
          <Button asChild variant="outline" size="sm">
            <Link href={`/lists/${packList.id}`}>View Details</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
