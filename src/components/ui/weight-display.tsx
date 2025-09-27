import { cn } from '@/lib/utils';

interface WeightDisplayProps {
  grams: number;
  units?: 'metric' | 'imperial';
  className?: string;
  showUnit?: boolean;
  precision?: number;
}

export function WeightDisplay({
  grams,
  units = 'imperial',
  className,
  showUnit = true,
  precision = 1,
}: WeightDisplayProps) {
  const formatWeight = (grams: number) => {
    if (units === 'metric') {
      if (grams >= 1000) {
        const kg = (grams / 1000).toFixed(precision);
        return showUnit ? `${kg} kg` : kg;
      }
      const g = grams.toFixed(0);
      return showUnit ? `${g} g` : g;
    } else {
      const ounces = grams * 0.035274;
      if (ounces >= 16) {
        const pounds = Math.floor(ounces / 16);
        const remainingOunces = (ounces % 16).toFixed(precision);
        return showUnit
          ? `${pounds} lb ${remainingOunces} oz`
          : `${pounds}.${remainingOunces}`;
      }
      const oz = ounces.toFixed(precision);
      return showUnit ? `${oz} oz` : oz;
    }
  };

  return (
    <span className={cn('font-mono', className)}>{formatWeight(grams)}</span>
  );
}
