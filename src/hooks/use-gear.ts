'use client';

import { useEffect, useState } from 'react';

import { useSession } from 'next-auth/react';

interface Category {
  id: string;
  name: string;
  order: number;
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

interface CreateGearItem {
  name: string;
  description?: string;
  weight: number;
  quantity: number;
  categoryId: string;
  isWorn: boolean;
  isConsumable: boolean;
  imageUrl?: string;
  retailerUrl?: string;
}

export function useGear() {
  const { data: session } = useSession();
  const [gearItems, setGearItems] = useState<GearItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      setIsLoading(false);
      return;
    }

    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        const [gearResponse, categoriesResponse] = await Promise.all([
          fetch('/api/gear'),
          fetch('/api/categories'),
        ]);

        if (!gearResponse.ok || !categoriesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const gear = await gearResponse.json();
        const cats = await categoriesResponse.json();

        setGearItems(gear);
        setCategories(cats);
      } catch (err) {
        console.error('Error fetching gear data:', err);
        setError('Failed to load gear data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [session]);

  const createGearItem = async (data: CreateGearItem): Promise<GearItem> => {
    const response = await fetch('/api/gear', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create gear item');
    }

    const newItem = await response.json();
    setGearItems(prev => [newItem, ...prev]);
    return newItem;
  };

  const updateGearItem = async (
    id: string,
    data: Partial<CreateGearItem>
  ): Promise<GearItem> => {
    const response = await fetch(`/api/gear/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update gear item');
    }

    const updatedItem = await response.json();
    setGearItems(prev =>
      prev.map(item => (item.id === id ? updatedItem : item))
    );
    return updatedItem;
  };

  const deleteGearItem = async (id: string): Promise<void> => {
    const response = await fetch(`/api/gear/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete gear item');
    }

    setGearItems(prev => prev.filter(item => item.id !== id));
  };

  return {
    gearItems,
    categories,
    isLoading,
    error,
    createGearItem,
    updateGearItem,
    deleteGearItem,
    refetch: () => setIsLoading(true),
  };
}
