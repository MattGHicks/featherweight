'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { WeightUnit } from '@/lib/weight-utils';

export interface UserPreferences {
  preferredUnits: WeightUnit;
  baseWeightGoal: number | null;
  totalWeightGoal: number | null;
}

interface UserPreferencesContextType {
  preferences: UserPreferences | null;
  isLoading: boolean;
  error: string | null;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export function UserPreferencesProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchingRef = useRef(false);

  const fetchPreferences = useCallback(async () => {
    if (status !== 'authenticated' || !session || fetchingRef.current) return;

    fetchingRef.current = true;
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
      fetchingRef.current = false;
    }
  }, [status, session]);

  const updatePreferences = useCallback(async (updates: Partial<UserPreferences>) => {
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
  }, [preferences]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchPreferences();
    } else if (status === 'unauthenticated') {
      setPreferences(null);
    }
  }, [status, session?.user?.id, fetchPreferences]);

  const contextValue = useMemo(
    () => ({
      preferences,
      isLoading,
      error,
      updatePreferences,
    }),
    [preferences, isLoading, error, updatePreferences]
  );

  return (
    <UserPreferencesContext.Provider value={contextValue}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
}