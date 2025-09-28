'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SwipeCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
  swipeThreshold?: number;
  leftAction?: {
    icon: React.ReactNode;
    color: string;
    label: string;
  };
  rightAction?: {
    icon: React.ReactNode;
    color: string;
    label: string;
  };
}

export function SwipeCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  className,
  swipeThreshold = 100,
  leftAction,
  rightAction,
}: SwipeCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const x = e.touches[0].clientX;
    setCurrentX(x);
    const diff = x - startX;

    // Limit the swipe distance to prevent over-swiping
    const maxSwipe = cardRef.current?.offsetWidth || 300;
    const limitedDiff = Math.max(-maxSwipe * 0.3, Math.min(maxSwipe * 0.3, diff));
    setTranslateX(limitedDiff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    const diff = currentX - startX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (diff < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }

    setIsDragging(false);
    setTranslateX(0);
    setStartX(0);
    setCurrentX(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const x = e.clientX;
    setCurrentX(x);
    const diff = x - startX;

    const maxSwipe = cardRef.current?.offsetWidth || 300;
    const limitedDiff = Math.max(-maxSwipe * 0.3, Math.min(maxSwipe * 0.3, diff));
    setTranslateX(limitedDiff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    const diff = currentX - startX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (diff < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }

    setIsDragging(false);
    setTranslateX(0);
    setStartX(0);
    setCurrentX(0);
  };

  useEffect(() => {
    const handleMouseMoveGlobal = (e: MouseEvent) => {
      if (!isDragging) return;

      const x = e.clientX;
      setCurrentX(x);
      const diff = x - startX;

      const maxSwipe = cardRef.current?.offsetWidth || 300;
      const limitedDiff = Math.max(-maxSwipe * 0.3, Math.min(maxSwipe * 0.3, diff));
      setTranslateX(limitedDiff);
    };

    const handleMouseUpGlobal = () => {
      if (!isDragging) return;

      const diff = currentX - startX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (diff < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      }

      setIsDragging(false);
      setTranslateX(0);
      setStartX(0);
      setCurrentX(0);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMoveGlobal);
      document.addEventListener('mouseup', handleMouseUpGlobal);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMoveGlobal);
      document.removeEventListener('mouseup', handleMouseUpGlobal);
    };
  }, [isDragging, startX, currentX, swipeThreshold, onSwipeLeft, onSwipeRight]);

  const leftVisible = translateX > 20;
  const rightVisible = translateX < -20;

  return (
    <div className="relative overflow-hidden">
      {/* Left action background */}
      {leftAction && (
        <div className={cn(
          'absolute inset-y-0 left-0 flex items-center justify-start pl-4 transition-opacity',
          leftAction.color,
          leftVisible ? 'opacity-100' : 'opacity-0'
        )}>
          <div className="flex items-center gap-2 text-white">
            {leftAction.icon}
            <span className="text-sm font-medium">{leftAction.label}</span>
          </div>
        </div>
      )}

      {/* Right action background */}
      {rightAction && (
        <div className={cn(
          'absolute inset-y-0 right-0 flex items-center justify-end pr-4 transition-opacity',
          rightAction.color,
          rightVisible ? 'opacity-100' : 'opacity-0'
        )}>
          <div className="flex items-center gap-2 text-white">
            <span className="text-sm font-medium">{rightAction.label}</span>
            {rightAction.icon}
          </div>
        </div>
      )}

      {/* Main card content */}
      <div
        ref={cardRef}
        className={cn(
          'relative transition-transform duration-200 ease-out touch-pan-y',
          isDragging ? 'duration-0' : '',
          className
        )}
        style={{
          transform: `translateX(${translateX}px)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {children}
      </div>
    </div>
  );
}