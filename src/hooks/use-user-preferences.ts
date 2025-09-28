'use client';

import { useCallback, useEffect, useState } from 'react';

import { useSession } from 'next-auth/react';

import { WeightUnit } from '@/lib/weight-utils';

export interface UserPreferences {
  preferredUnits: WeightUnit;
  baseWeightGoal: number | null;
  totalWeightGoal: number | null;
}

interface UseUserPreferencesReturn {
  preferences: UserPreferences | null;
  isLoading: boolean;
  error: string | null;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
}

export function useUserPreferences(): UseUserPreferencesReturn {
  const { data: session, status } = useSession();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPreferences = useCallback(async () => {
    if (status !== 'authenticated' || !session) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/preferences');

      if (!response.ok) {
        throw new Error('Failed to fetch preferences');
      }

      const data = await response.json();
      setPreferences(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [status, session]);

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!preferences) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/preferences', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...preferences, ...updates }),
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }

      const updatedPreferences = await response.json();
      setPreferences(updatedPreferences);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchPreferences();
    } else if (status === 'unauthenticated') {
      setPreferences(null);
    }
  }, [status, fetchPreferences]);

  return {
    preferences,
    isLoading,
    error,
    updatePreferences,
  };
}
