'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Package, List, Target, Filter } from 'lucide-react';

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatWeight } from '@/lib/utils';

interface SearchResult {
  id: string;
  type: 'gear' | 'pack-list';
  title: string;
  description?: string;
  metadata?: {
    weight?: number;
    category?: string;
    itemCount?: number;
    totalWeight?: number;
  };
}

interface GlobalSearchProps {
  trigger?: React.ReactNode;
}

export function GlobalSearch({ trigger }: GlobalSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data.results || []);
        }
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    setQuery('');

    if (result.type === 'gear') {
      router.push(`/gear?search=${encodeURIComponent(result.title)}`);
    } else if (result.type === 'pack-list') {
      router.push(`/lists/${result.id}`);
    }
  };

  const defaultTrigger = (
    <Button
      variant="outline"
      className="relative w-full justify-start text-sm text-muted-foreground"
    >
      <Search className="mr-2 h-4 w-4" />
      Search gear and pack lists...
      <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  );

  return (
    <>
      <div onClick={() => setOpen(true)}>
        {trigger || defaultTrigger}
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search gear items and pack lists..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {isLoading && (
            <div className="py-6 text-center text-sm">Searching...</div>
          )}

          {!isLoading && query.length >= 2 && results.length === 0 && (
            <CommandEmpty>No results found for "{query}"</CommandEmpty>
          )}

          {results.length > 0 && (
            <>
              {/* Gear Items */}
              {results.filter(r => r.type === 'gear').length > 0 && (
                <CommandGroup heading="Gear Items">
                  {results
                    .filter(r => r.type === 'gear')
                    .map((result) => (
                      <CommandItem
                        key={`gear-${result.id}`}
                        onSelect={() => handleSelect(result)}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{result.title}</div>
                            {result.description && (
                              <div className="text-xs text-muted-foreground line-clamp-1">
                                {result.description}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {result.metadata?.category && (
                            <Badge variant="outline" className="text-xs">
                              {result.metadata.category}
                            </Badge>
                          )}
                          {result.metadata?.weight && (
                            <span className="text-xs font-mono">
                              {formatWeight(result.metadata.weight)}
                            </span>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}

              {/* Pack Lists */}
              {results.filter(r => r.type === 'pack-list').length > 0 && (
                <CommandGroup heading="Pack Lists">
                  {results
                    .filter(r => r.type === 'pack-list')
                    .map((result) => (
                      <CommandItem
                        key={`pack-list-${result.id}`}
                        onSelect={() => handleSelect(result)}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <List className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{result.title}</div>
                            {result.description && (
                              <div className="text-xs text-muted-foreground line-clamp-1">
                                {result.description}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-xs">
                          {result.metadata?.itemCount && (
                            <span>{result.metadata.itemCount} items</span>
                          )}
                          {result.metadata?.totalWeight && (
                            <span className="font-mono">
                              {formatWeight(result.metadata.totalWeight)}
                            </span>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}