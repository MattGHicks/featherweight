'use client';

import { useUserPreferences } from '@/hooks/use-user-preferences';
import { cn } from '@/lib/utils';
import {
  WeightDisplayOptions,
  WeightUnit,
  formatWeight,
} from '@/lib/weight-utils';

interface WeightDisplayProps {
  grams: number;
  className?: string;
  decimals?: number;
  showUnit?: boolean;
  fallbackUnit?: WeightUnit;
}

export function WeightDisplay({
  grams,
  className,
  decimals,
  showUnit = true,
  fallbackUnit = 'lbs',
}: WeightDisplayProps) {
  const { preferences } = useUserPreferences();

  const unit = preferences?.preferredUnits || fallbackUnit;

  const displayOptions: WeightDisplayOptions = {
    unit,
    decimals,
    showUnit,
  };

  return (
    <span className={cn('font-mono', className)}>
      {formatWeight(grams, displayOptions)}
    </span>
  );
}
