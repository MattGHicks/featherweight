'use client';

import { forwardRef } from 'react';

import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const touchButtonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow hover:bg-primary/90 active:bg-primary/95',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:bg-destructive/95',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground active:bg-accent/90',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 active:bg-secondary/90',
        ghost:
          'hover:bg-accent hover:text-accent-foreground active:bg-accent/90',
        link: 'text-primary underline-offset-4 hover:underline active:text-primary/90',
      },
      size: {
        default: 'h-11 px-4 py-2 min-h-[44px]', // 44px minimum touch target
        sm: 'h-10 rounded-md px-3 min-h-[40px]',
        lg: 'h-12 rounded-md px-8 min-h-[48px]',
        icon: 'h-11 w-11 min-h-[44px] min-w-[44px]', // Square touch targets
        'icon-sm': 'h-10 w-10 min-h-[40px] min-w-[40px]',
        'icon-lg': 'h-12 w-12 min-h-[48px] min-w-[48px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface TouchButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof touchButtonVariants> {
  asChild?: boolean;
}

const TouchButton = forwardRef<HTMLButtonElement, TouchButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(touchButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
TouchButton.displayName = 'TouchButton';

export { TouchButton, touchButtonVariants };
