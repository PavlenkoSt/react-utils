import { useCallback, useRef } from 'react';

type DebouncedFunction<T extends (...args: any[]) => void> = (...args: Parameters<T>) => void;

export const useDebounceFunction = <T extends (...args: any[]) => void>(
  func: T,
  wait: number,
): [DebouncedFunction<T>, () => void] => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedFunction = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        func(...args);
      }, wait);
    },
    [func, wait],
  );

  const cleanup = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  return [debouncedFunction, cleanup];
};
