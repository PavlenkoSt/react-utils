import { useRef, useEffect, useCallback } from 'react';

function usePreventDuplicateCalls<T extends (...args: any[]) => any>(
  func: T,
  delay: number = 2000,
): (...args: Parameters<T>) => void {
  const lastCallRef = useRef<{ args: Parameters<T>; timestamp: number } | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const wrappedFunction = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      if (
        lastCallRef.current &&
        now - lastCallRef.current.timestamp < delay &&
        lastCallRef.current.args.every((arg, index) => arg === args[index])
      ) {
        return;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      lastCallRef.current = { args, timestamp: now };
      func(...args);

      timeoutRef.current = setTimeout(() => {
        lastCallRef.current = null;
      }, delay);
    },
    [func, delay],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return wrappedFunction;
}

export default usePreventDuplicateCalls;
