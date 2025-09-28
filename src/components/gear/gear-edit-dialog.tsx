'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { GearForm } from './gear-form';
import type { Category, GearItem, GearItemWithCategory } from '@/types';

interface GearEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  gearItem: GearItemWithCategory | null;
  categories: Category[];
  onSubmit: (data: any) => Promise<void>;
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

  const handleSubmit = async (data: any) => {
    await onSubmit({ ...data, id: gearItem.id });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Gear Item</DialogTitle>
          <DialogDescription>
            Update the details for "{gearItem.name}"
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