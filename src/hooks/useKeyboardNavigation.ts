import { useEffect } from 'react';

interface KeyboardNavigationOptions {
  onNext?: () => void;
  onPrevious?: () => void;
  onEscape?: () => void;
  enabled?: boolean;
}

/**
 * Hook for handling keyboard navigation in drawers and modals
 * - Left Arrow: Navigate to previous item
 * - Right Arrow: Navigate to next item
 * - Escape: Close drawer/modal
 * - Up/Down: Native scroll behavior (not intercepted)
 */
export function useKeyboardNavigation({
  onNext,
  onPrevious,
  onEscape,
  enabled = true
}: KeyboardNavigationOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't intercept if user is typing in an input/textarea
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      switch (event.key) {
        case 'ArrowRight':
          if (onNext) {
            event.preventDefault();
            onNext();
          }
          break;
        case 'ArrowLeft':
          if (onPrevious) {
            event.preventDefault();
            onPrevious();
          }
          break;
        case 'Escape':
          if (onEscape) {
            event.preventDefault();
            onEscape();
          }
          break;
        // Up/Down arrows are left to native scroll behavior
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrevious, onEscape, enabled]);
}
