'use client';

import React from 'react';
import { useUserPreferences } from '@/contexts/user-preferences-context';
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
  preferredUnit?: WeightUnit;
}

function WeightDisplayWithContext({
  grams,
  className,
  decimals,
  showUnit = true,
  fallbackUnit = 'lbs',
  preferredUnit,
}: WeightDisplayProps) {
  const { preferences } = useUserPreferences();

  // Use prop if provided, otherwise fall back to context, then fallback
  const unit = preferredUnit || preferences?.preferredUnits || fallbackUnit;

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

function WeightDisplayWithoutContext({
  grams,
  className,
  decimals,
  showUnit = true,
  fallbackUnit = 'lbs',
  preferredUnit,
}: WeightDisplayProps) {
  const unit = preferredUnit || fallbackUnit;

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

export const WeightDisplay = React.memo(function WeightDisplay(props: WeightDisplayProps) {
  // If preferredUnit is provided (even if undefined), skip context entirely
  if (props.hasOwnProperty('preferredUnit')) {
    return <WeightDisplayWithoutContext {...props} />;
  }

  return <WeightDisplayWithContext {...props} />;
});
