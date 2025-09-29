'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ImageUpload } from '@/components/ui/image-upload';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Category, GearItem } from '@/types';

const gearFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  weight: z.number().min(0, 'Weight must be positive'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  categoryId: z.string().min(1, 'Category is required'),
  imageUrl: z.string().url().optional().or(z.literal('')),
  isWorn: z.boolean(),
  isConsumable: z.boolean(),
  retailerUrl: z.string().url().optional().or(z.literal('')),
});

type GearFormValues = z.infer<typeof gearFormSchema>;

interface GearFormProps {
  categories: Category[];
  initialData?: Partial<GearItem>;
  onSubmit: (data: GearFormValues) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function GearForm({
  categories,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = 'Save',
}: GearFormProps) {
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichmentFields, setEnrichmentFields] = useState<Set<string>>(
    new Set()
  );

  const form = useForm<GearFormValues>({
    resolver: zodResolver(gearFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      weight: initialData?.weight || 0,
      quantity: initialData?.quantity || 1,
      categoryId: initialData?.categoryId || '',
      imageUrl: initialData?.imageUrl || '',
      isWorn: initialData?.isWorn || false,
      isConsumable: initialData?.isConsumable || false,
      retailerUrl: initialData?.retailerUrl || '',
    },
  });

  const handleSubmit = async (data: GearFormValues) => {
    await onSubmit(data);
  };

  const handleAIEnrich = async () => {
    const itemName = form.getValues('name');
    if (!itemName || itemName.trim().length === 0) {
      return;
    }

    setIsEnriching(true);
    setEnrichmentFields(new Set());

    try {
      const response = await fetch('/api/gear/enrich', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: itemName,
          category: form.getValues('categoryId'),
          description: form.getValues('description'),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to enrich gear data');
      }

      const result = await response.json();
      const enrichmentData = result.data;

      // Track which fields were enriched
      const fieldsEnriched = new Set<string>();

      // Update fields with AI data, showing override behavior
      const currentValues = form.getValues();

      if (enrichmentData.description) {
        const hasExistingDescription =
          currentValues.description &&
          currentValues.description.trim().length > 0;
        if (
          !hasExistingDescription ||
          currentValues.description === 'Brand, model, notes...'
        ) {
          form.setValue('description', enrichmentData.description);
          fieldsEnriched.add('description');
        } else {
          // For existing descriptions, we could ask user or just skip
          // For now, let's override if it's clearly placeholder text
          if (
            currentValues.description.includes('Brand, model, notes') ||
            currentValues.description.length < 10
          ) {
            form.setValue('description', enrichmentData.description);
            fieldsEnriched.add('description');
          }
        }
      }

      if (enrichmentData.weight && enrichmentData.weight > 0) {
        // Always update weight if AI provides a reasonable value
        if (currentValues.weight === 0 || currentValues.weight === undefined) {
          form.setValue('weight', enrichmentData.weight);
          fieldsEnriched.add('weight');
        } else {
          // Override existing weight if it seems like a default/placeholder
          form.setValue('weight', enrichmentData.weight);
          fieldsEnriched.add('weight');
        }
      }

      // Find matching category by name
      if (enrichmentData.category && !currentValues.categoryId) {
        const matchingCategory = categories.find(
          cat =>
            cat.name.toLowerCase() === enrichmentData.category?.toLowerCase()
        );
        if (matchingCategory) {
          form.setValue('categoryId', matchingCategory.id);
          fieldsEnriched.add('categoryId');
        }
      }

      // Add retailer URL if provided by AI
      if (
        enrichmentData.retailerUrls &&
        enrichmentData.retailerUrls.length > 0
      ) {
        const bestRetailerUrl = enrichmentData.retailerUrls[0];
        if (
          !currentValues.retailerUrl ||
          currentValues.retailerUrl.trim().length === 0
        ) {
          form.setValue('retailerUrl', bestRetailerUrl);
          fieldsEnriched.add('retailerUrl');
        }
      }

      // Search for gear image using the actual product name (more accurate than AI search terms)
      if (!currentValues.imageUrl) {
        try {
          // Use the actual product name from the form for better image accuracy
          const gearName = currentValues.name || itemName;

          // Search for image via our API endpoint
          const imageResponse = await fetch('/api/gear/search-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ searchTerm: gearName }),
          });

          if (imageResponse.ok) {
            const imageResult = await imageResponse.json();
            if (imageResult.imageUrl) {
              form.setValue('imageUrl', imageResult.imageUrl);
              fieldsEnriched.add('imageUrl');
            }
          }
        } catch (error) {
          console.error('Failed to search for gear image:', error);
          // Continue without image - not a critical failure
        }
      }

      setEnrichmentFields(fieldsEnriched);

      // Show success message (could be a toast notification)
      console.log(
        `AI enriched ${fieldsEnriched.size} fields with ${enrichmentData.confidence * 100}% confidence`
      );
    } catch (error) {
      console.error('AI enrichment failed:', error);
      // In a full implementation, show an error toast
    } finally {
      setIsEnriching(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input placeholder="Tent, sleeping bag, etc." {...field} />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAIEnrich}
                  disabled={isEnriching || isLoading || !field.value?.trim()}
                  className="shrink-0"
                >
                  {isEnriching ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  {isEnriching ? 'Enriching...' : 'AI Assist'}
                </Button>
              </div>
              <FormMessage />
              {enrichmentFields.size > 0 && (
                <FormDescription className="text-blue-600">
                  ✨ AI filled {enrichmentFields.size} field
                  {enrichmentFields.size !== 1 ? 's' : ''} for you
                </FormDescription>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                Category
                {enrichmentFields.has('categoryId') && (
                  <span className="text-xs text-blue-600">✨</span>
                )}
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center space-x-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  Weight (grams)
                  {enrichmentFields.has('weight') && (
                    <span className="text-xs text-blue-600">✨</span>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="0"
                    {...field}
                    onChange={e =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="1"
                    {...field}
                    onChange={e =>
                      field.onChange(parseInt(e.target.value) || 1)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                Description
                {enrichmentFields.has('description') && (
                  <span className="text-xs text-blue-600">✨</span>
                )}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brand, model, notes..."
                  className="resize-none h-20"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Optional details about the gear item
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                Image
                {enrichmentFields.has('imageUrl') && (
                  <span className="text-xs text-blue-600">✨</span>
                )}
              </FormLabel>
              <div className="space-y-3">
                <div>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="Enter image URL or upload below"
                      {...field}
                    />
                  </FormControl>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or
                    </span>
                  </div>
                </div>
                <div>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    onRemove={() => field.onChange('')}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="retailerUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product URL</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://..." {...field} />
              </FormControl>
              <FormDescription>
                Optional link to where this item can be purchased
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="isWorn"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Worn Weight</FormLabel>
                  <FormDescription>
                    Item is worn and not carried in pack
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isConsumable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Consumable</FormLabel>
                  <FormDescription>
                    Item will be consumed during trip
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="sm:w-auto"
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading} className="sm:w-auto">
            {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
