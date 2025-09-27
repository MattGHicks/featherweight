'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface DashboardStats {
  totalGearItems: number;
  totalPackLists: number;
  lightestBaseWeight: number | null;
  recentGear: Array<{
    id: string;
    name: string;
    weight: number;
    category: { name: string };
  }>;
  recentPackLists: Array<{
    id: string;
    name: string;
    stats: {
      totalWeight: number;
      baseWeight: number;
      itemCount: number;
    };
  }>;
}

export function useDashboardStats() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalGearItems: 0,
    totalPackLists: 0,
    lightestBaseWeight: null,
    recentGear: [],
    recentPackLists: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      setIsLoading(false);
      return;
    }

    async function fetchDashboardData() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch gear items and pack lists in parallel
        const [gearResponse, packListsResponse] = await Promise.all([
          fetch('/api/gear'),
          fetch('/api/pack-lists'),
        ]);

        if (!gearResponse.ok || !packListsResponse.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const gearItems = await gearResponse.json();
        const packLists = await packListsResponse.json();

        // Calculate lightest base weight from pack lists
        const baseWeights = packLists
          .map((list: any) => list.stats.baseWeight)
          .filter((weight: number) => weight > 0);

        const lightestBaseWeight = baseWeights.length > 0
          ? Math.min(...baseWeights)
          : null;

        // Get recent items (last 5)
        const recentGear = gearItems.slice(0, 5).map((item: any) => ({
          id: item.id,
          name: item.name,
          weight: item.weight,
          category: item.category,
        }));

        const recentPackLists = packLists.slice(0, 5).map((list: any) => ({
          id: list.id,
          name: list.name,
          stats: list.stats,
        }));

        setStats({
          totalGearItems: gearItems.length,
          totalPackLists: packLists.length,
          lightestBaseWeight,
          recentGear,
          recentPackLists,
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, [session]);

  return { stats, isLoading, error, refetch: () => setIsLoading(true) };
}