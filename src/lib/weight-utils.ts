export type WeightUnit = 'g' | 'kg' | 'oz' | 'lbs';

export interface WeightDisplayOptions {
  unit: WeightUnit;
  decimals?: number;
  showUnit?: boolean;
}

const GRAM_TO_CONVERSIONS = {
  g: 1,
  kg: 0.001,
  oz: 0.035274,
  lbs: 0.00220462,
} as const;

const UNIT_LABELS = {
  g: 'g',
  kg: 'kg',
  oz: 'oz',
  lbs: 'lbs',
} as const;

const DEFAULT_DECIMALS = {
  g: 0,
  kg: 2,
  oz: 2,
  lbs: 2,
} as const;

export function convertWeight(grams: number, targetUnit: WeightUnit): number {
  return grams * GRAM_TO_CONVERSIONS[targetUnit];
}

export function convertToGrams(value: number, sourceUnit: WeightUnit): number {
  return value / GRAM_TO_CONVERSIONS[sourceUnit];
}

export function formatWeight(
  grams: number,
  options: WeightDisplayOptions
): string {
  const { unit, decimals, showUnit = true } = options;
  const convertedValue = convertWeight(grams, unit);
  const decimalPlaces = decimals ?? DEFAULT_DECIMALS[unit];

  const formattedNumber = convertedValue.toFixed(decimalPlaces);

  if (showUnit) {
    return `${formattedNumber} ${UNIT_LABELS[unit]}`;
  }

  return formattedNumber;
}

export function parseWeightInput(
  input: string,
  unit: WeightUnit
): number | null {
  const numericValue = parseFloat(input.trim());

  if (isNaN(numericValue) || numericValue < 0) {
    return null;
  }

  return convertToGrams(numericValue, unit);
}

export function getUnitLabel(unit: WeightUnit): string {
  return UNIT_LABELS[unit];
}

export function getDefaultDecimals(unit: WeightUnit): number {
  return DEFAULT_DECIMALS[unit];
}

export const WEIGHT_UNITS: { value: WeightUnit; label: string }[] = [
  { value: 'lbs', label: 'Pounds (lbs)' },
  { value: 'oz', label: 'Ounces (oz)' },
  { value: 'kg', label: 'Kilograms (kg)' },
  { value: 'g', label: 'Grams (g)' },
];
