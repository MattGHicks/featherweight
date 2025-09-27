'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { usePackLists } from '@/hooks/use-pack-lists';

const packListFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  isPublic: z.boolean(),
});

type PackListFormData = z.infer<typeof packListFormSchema>;

interface PackListFormProps {
  initialData?: Partial<PackListFormData> & { id?: string };
  onSuccess?: () => void;
}

export function PackListForm({ initialData, onSuccess }: PackListFormProps) {
  const router = useRouter();
  const { createPackList, updatePackList } = usePackLists();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PackListFormData>({
    resolver: zodResolver(packListFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      isPublic: initialData?.isPublic || false,
    },
  });

  const isEditing = !!initialData?.id;
  const watchedValues = watch();

  const onSubmit = async (data: PackListFormData) => {
    try {
      setIsSubmitting(true);

      if (isEditing && initialData?.id) {
        await updatePackList(initialData.id, data);
      } else {
        await createPackList(data);
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/lists');
      }
    } catch (error) {
      console.error('Error saving pack list:', error);
      alert('Failed to save pack list. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="e.g., Weekend Backpacking, Day Hike"
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Optional description of this pack list..."
          rows={3}
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isPublic"
          checked={watchedValues.isPublic}
          onCheckedChange={(checked) => setValue('isPublic', !!checked)}
        />
        <Label htmlFor="isPublic">
          Make this pack list public (others can view and copy it)
        </Label>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isEditing
              ? 'Updating...'
              : 'Creating...'
            : isEditing
              ? 'Update Pack List'
              : 'Create Pack List'
          }
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/lists')}>
          Cancel
        </Button>
      </div>
    </form>
  );
}