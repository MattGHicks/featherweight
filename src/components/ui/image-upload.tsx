'use client';

import { useCallback, useState } from 'react';

import { Upload, X } from 'lucide-react';

import { Button } from './button';
import { LoadingSpinner } from './loading-spinner';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled = false,
}: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = useCallback(
    async (file: File) => {
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/gear/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to upload image');
        }

        const { imageUrl } = await response.json();
        onChange(imageUrl);
      } catch (error) {
        console.error('Upload error:', error);
        alert(error instanceof Error ? error.message : 'Failed to upload image');
      } finally {
        setIsLoading(false);
      }
    },
    [onChange]
  );

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        handleUpload(file);
      }
    },
    [handleUpload]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const file = event.dataTransfer.files?.[0];
      if (file && file.type.startsWith('image/')) {
        handleUpload(file);
      }
    },
    [handleUpload]
  );

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  if (value) {
    return (
      <div className="relative">
        <div className="relative aspect-square w-32 overflow-hidden rounded-lg border">
          <img
            src={value}
            alt="Uploaded image"
            className="h-full w-full object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute right-1 top-1 h-6 w-6 p-0"
            onClick={onRemove}
            disabled={disabled}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative cursor-pointer rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 transition-colors hover:border-muted-foreground/50"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="absolute inset-0 cursor-pointer opacity-0"
        disabled={disabled || isLoading}
      />
      <div className="flex flex-col items-center justify-center text-center">
        {isLoading ? (
          <>
            <LoadingSpinner size="sm" className="mb-2" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </>
        ) : (
          <>
            <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">Click to upload or drag and drop</p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, GIF up to 5MB
            </p>
          </>
        )}
      </div>
    </div>
  );
}