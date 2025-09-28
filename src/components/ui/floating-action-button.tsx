'use client';

import { forwardRef, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FABAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'secondary';
}

interface FloatingActionButtonProps {
  actions?: FABAction[];
  mainAction?: () => void;
  className?: string;
  size?: 'default' | 'lg';
}

const FloatingActionButton = forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
  ({ actions = [], mainAction, className, size = 'default', ...props }, ref) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleMainClick = () => {
      if (actions.length > 0) {
        setIsExpanded(!isExpanded);
      } else if (mainAction) {
        mainAction();
      }
    };

    const handleActionClick = (action: FABAction) => {
      action.onClick();
      setIsExpanded(false);
    };

    const sizeClasses = {
      default: 'h-14 w-14',
      lg: 'h-16 w-16',
    };

    const actionSizeClasses = {
      default: 'h-12 w-12',
      lg: 'h-14 w-14',
    };

    return (
      <div className={cn('fixed bottom-6 right-6 z-50', className)}>
        {/* Action items */}
        {isExpanded && actions.length > 0 && (
          <div className="absolute bottom-16 right-0 space-y-3 mb-2">
            {actions.map((action, index) => (
              <div
                key={index}
                className="flex items-center justify-end animate-in slide-in-from-bottom-2 fade-in-0"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="mr-3 bg-black/80 text-white px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap">
                  {action.label}
                </div>
                <button
                  onClick={() => handleActionClick(action)}
                  className={cn(
                    actionSizeClasses[size],
                    'rounded-full shadow-lg transition-all duration-200 hover:scale-105 active:scale-95',
                    action.variant === 'destructive'
                      ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                      : action.variant === 'secondary'
                      ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  )}
                >
                  {action.icon}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Main FAB */}
        <button
          ref={ref}
          onClick={handleMainClick}
          className={cn(
            sizeClasses[size],
            'bg-primary text-primary-foreground rounded-full shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 hover:bg-primary/90',
            'flex items-center justify-center',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
          )}
          {...props}
        >
          {actions.length > 0 ? (
            isExpanded ? (
              <X className="h-6 w-6 transition-transform duration-200" />
            ) : (
              <Plus className="h-6 w-6 transition-transform duration-200" />
            )
          ) : (
            <Plus className="h-6 w-6" />
          )}
        </button>

        {/* Backdrop for closing expanded state */}
        {isExpanded && (
          <div
            className="fixed inset-0 -z-10"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </div>
    );
  }
);

FloatingActionButton.displayName = 'FloatingActionButton';

export { FloatingActionButton, type FABAction };