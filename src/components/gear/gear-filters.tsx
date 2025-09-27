'use client';

import { Search, Filter, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface Category {
  id: string;
  name: string;
  color?: string;
}

interface GearFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  selectedType: string | null;
  onTypeChange: (type: string | null) => void;
  categories: Category[];
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function GearFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedType,
  onTypeChange,
  categories,
  hasActiveFilters,
  onClearFilters,
}: GearFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        {/* Search - full width on mobile */}
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search gear by name or description..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Filters row */}
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Category Filter */}
          <Select
            value={selectedCategory || 'all'}
            onValueChange={(value) => onCategoryChange(value === 'all' ? null : value)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Type Filter */}
          <Select
            value={selectedType || 'all'}
            onValueChange={(value) => onTypeChange(value === 'all' ? null : value)}
          >
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="base">Base Weight</SelectItem>
              <SelectItem value="worn">Worn Weight</SelectItem>
              <SelectItem value="consumable">Consumable</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="gap-2 w-full sm:w-auto"
              size="default"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="gap-1">
              Search: "{searchTerm}"
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onSearchChange('')}
              />
            </Badge>
          )}
          {selectedCategory && (
            <Badge variant="secondary" className="gap-1">
              Category: {categories.find(c => c.id === selectedCategory)?.name}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onCategoryChange(null)}
              />
            </Badge>
          )}
          {selectedType && (
            <Badge variant="secondary" className="gap-1">
              Type: {selectedType === 'base' ? 'Base Weight' : selectedType === 'worn' ? 'Worn Weight' : 'Consumable'}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onTypeChange(null)}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}