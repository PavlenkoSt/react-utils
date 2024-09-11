import { useCallback, useRef } from 'react';

type DebouncedFunction<T extends (...args: any[]) => void> = (...args: Parameters<T>) => void;

export const useDebounceFunction = <T extends (...args: any[]) => void>(
  func: T,
  wait: number,
): DebouncedFunction<T> => {
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

  return debouncedFunction;
};
