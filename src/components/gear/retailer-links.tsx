'use client';

import { useState } from 'react';

import { DollarSign, ExternalLink, Plus, ShoppingCart, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface RetailerLink {
  id: string;
  name: string;
  url: string;
  price?: number;
  lastChecked?: string;
}

interface RetailerLinksProps {
  gearItemId: string;
  initialLinks?: RetailerLink[];
  onLinksUpdated: () => void;
}

const popularRetailers = [
  { name: 'REI', domain: 'rei.com' },
  { name: 'Amazon', domain: 'amazon.com' },
  { name: 'Backcountry', domain: 'backcountry.com' },
  { name: 'Patagonia', domain: 'patagonia.com' },
  { name: 'Zpacks', domain: 'zpacks.com' },
  { name: 'Hyperlite Mountain Gear', domain: 'hyperlitemountaingear.com' },
  { name: 'Outdoor Research', domain: 'outdoorresearch.com' },
  { name: "Arc'teryx", domain: 'arcteryx.com' },
];

export function RetailerLinks({
  gearItemId,
  initialLinks = [],
  onLinksUpdated,
}: RetailerLinksProps) {
  const [links, setLinks] = useState<RetailerLink[]>(initialLinks);
  const [isAdding, setIsAdding] = useState(false);
  const [newLink, setNewLink] = useState({ name: '', url: '', price: '' });
  const [isLoading, setIsLoading] = useState(false);

  const detectRetailer = (url: string): string => {
    try {
      const domain = new URL(url).hostname.toLowerCase();
      const retailer = popularRetailers.find(r =>
        domain.includes(r.domain.split('.')[0])
      );
      return retailer?.name || 'Unknown Retailer';
    } catch {
      return 'Unknown Retailer';
    }
  };

  const handleAddLink = async () => {
    if (!newLink.url.trim()) return;

    setIsLoading(true);
    try {
      const linkData = {
        name: newLink.name.trim() || detectRetailer(newLink.url),
        url: newLink.url.trim(),
        price: newLink.price ? parseFloat(newLink.price) : undefined,
      };

      const response = await fetch(`/api/gear/${gearItemId}/retailers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(linkData),
      });

      if (response.ok) {
        const updatedLinks = await response.json();
        setLinks(updatedLinks);
        setNewLink({ name: '', url: '', price: '' });
        setIsAdding(false);
        onLinksUpdated();
      } else {
        throw new Error('Failed to add retailer link');
      }
    } catch (error) {
      console.error('Error adding retailer link:', error);
      alert('Failed to add retailer link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveLink = async (linkId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/gear/${gearItemId}/retailers/${linkId}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        const updatedLinks = await response.json();
        setLinks(updatedLinks);
        onLinksUpdated();
      } else {
        throw new Error('Failed to remove retailer link');
      }
    } catch (error) {
      console.error('Error removing retailer link:', error);
      alert('Failed to remove retailer link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePriceUpdate = async (linkId: string) => {
    // This would typically scrape the price or integrate with price tracking APIs
    alert(
      'Price tracking feature coming soon! For now, you can manually update prices.'
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Retailer Links
            </CardTitle>
            <CardDescription>
              Track where to buy this item and monitor price changes
            </CardDescription>
          </div>
          {!isAdding && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Link
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdding && (
          <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
            <div className="space-y-2">
              <Label htmlFor="retailer-url">Product URL *</Label>
              <Input
                id="retailer-url"
                type="url"
                placeholder="https://example.com/product-page"
                value={newLink.url}
                onChange={e => setNewLink({ ...newLink, url: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="retailer-name">Retailer Name</Label>
                <Input
                  id="retailer-name"
                  placeholder="Auto-detected from URL"
                  value={newLink.name}
                  onChange={e =>
                    setNewLink({ ...newLink, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="retailer-price">Price ($)</Label>
                <Input
                  id="retailer-price"
                  type="number"
                  step="0.01"
                  placeholder="Optional"
                  value={newLink.price}
                  onChange={e =>
                    setNewLink({ ...newLink, price: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAddLink}
                disabled={isLoading || !newLink.url.trim()}
              >
                {isLoading ? 'Adding...' : 'Add Link'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsAdding(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {links.length === 0 && !isAdding ? (
          <div className="text-center py-8">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">No retailer links yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add links to track where you can buy this item and monitor price
              changes
            </p>
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Link
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {links.map(link => (
              <div
                key={link.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium truncate">{link.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {new URL(link.url).hostname}
                    </Badge>
                  </div>
                  {link.price && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="h-3 w-3" />
                      <span>${link.price.toFixed(2)}</span>
                      {link.lastChecked && (
                        <span>
                          • Updated{' '}
                          {new Date(link.lastChecked).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {link.price && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePriceUpdate(link.id)}
                      disabled={isLoading}
                    >
                      <DollarSign className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(link.url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveLink(link.id)}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Popular Retailers Quick Add */}
        {isAdding && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Popular Retailers</Label>
            <div className="flex flex-wrap gap-2">
              {popularRetailers.slice(0, 6).map(retailer => (
                <Button
                  key={retailer.name}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() =>
                    setNewLink({ ...newLink, name: retailer.name })
                  }
                >
                  {retailer.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
