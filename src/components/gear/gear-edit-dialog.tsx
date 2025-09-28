'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Category, GearItemWithCategory } from '@/types';

import { GearForm } from './gear-form';

interface GearEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  gearItem: GearItemWithCategory | null;
  categories: Category[];
  onSubmit: (data: GearItemWithCategory) => Promise<void>;
  isLoading?: boolean;
}

export function GearEditDialog({
  isOpen,
  onClose,
  gearItem,
  categories,
  onSubmit,
  isLoading = false,
}: GearEditDialogProps) {
  if (!gearItem) return null;

  const handleSubmit = async (data: GearItemWithCategory) => {
    await onSubmit({ ...data, id: gearItem.id });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Gear Item</DialogTitle>
          <DialogDescription>
            Update the details for &quot;{gearItem.name}&quot;
          </DialogDescription>
        </DialogHeader>

        <GearForm
          categories={categories}
          initialData={{
            name: gearItem.name,
            description: gearItem.description,
            weight: gearItem.weight,
            quantity: gearItem.quantity,
            categoryId: gearItem.category.id,
            imageUrl: gearItem.imageUrl,
            isWorn: gearItem.isWorn,
            isConsumable: gearItem.isConsumable,
            retailerUrl: gearItem.retailerUrl,
          }}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isLoading={isLoading}
          submitLabel="Update Gear Item"
        />
      </DialogContent>
    </Dialog>
  );
}
