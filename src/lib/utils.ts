import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatWeight(weightInGrams: number): string {
  if (weightInGrams >= 1000) {
    const kg = (weightInGrams / 1000).toFixed(2);
    return `${kg} kg`;
  }
  return `${weightInGrams} g`;
}
