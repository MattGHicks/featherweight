'use client';

import { useEffect, useState } from 'react';

import { useSession } from 'next-auth/react';

interface PackListStats {
  totalWeight: number;
  baseWeight: number;
  itemCount: number;
}

interface PackList {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  shareSlug?: string;
  stats: PackListStats;
  createdAt: string;
  updatedAt: string;
}

interface CreatePackList {
  name: string;
  description?: string;
  isPublic: boolean;
}

export function usePackLists() {
  const { data: session } = useSession();
  const [packLists, setPackLists] = useState<PackList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      setIsLoading(false);
      return;
    }

    async function fetchPackLists() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/pack-lists');

        if (!response.ok) {
          throw new Error('Failed to fetch pack lists');
        }

        const data = await response.json();
        setPackLists(data);
      } catch (err) {
        console.error('Error fetching pack lists:', err);
        setError('Failed to load pack lists');
      } finally {
        setIsLoading(false);
      }
    }

    fetchPackLists();
  }, [session]);

  const createPackList = async (data: CreatePackList): Promise<PackList> => {
    const response = await fetch('/api/pack-lists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create pack list');
    }

    const newPackList = await response.json();
    setPackLists(prev => [newPackList, ...prev]);
    return newPackList;
  };

  const updatePackList = async (
    id: string,
    data: Partial<CreatePackList>
  ): Promise<PackList> => {
    const response = await fetch(`/api/pack-lists/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update pack list');
    }

    const updatedPackList = await response.json();
    setPackLists(prev =>
      prev.map(list => (list.id === id ? updatedPackList : list))
    );
    return updatedPackList;
  };

  const deletePackList = async (id: string): Promise<void> => {
    const response = await fetch(`/api/pack-lists/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete pack list');
    }

    setPackLists(prev => prev.filter(list => list.id !== id));
  };

  return {
    packLists,
    isLoading,
    error,
    createPackList,
    updatePackList,
    deletePackList,
    refetch: () => setIsLoading(true),
  };
}
