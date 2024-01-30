import { useEffect, useRef } from "react";

type CBType<T> = (props: T) => void;

export const useThrottle = <T>(callback: CBType<T>, delay: number) => {
  const lastTimeout = useRef<NodeJS.Timeout | null>(null);

  const throttledCallback = (props: T) => {
    if (!lastTimeout.current) {
      callback(props);
      lastTimeout.current = setTimeout(() => {
        lastTimeout.current = null;
      }, delay);
    }
  };

  useEffect(() => {
    return () => {
      if (lastTimeout.current) {
        clearTimeout(lastTimeout.current);
      }
    };
  }, []);

  return throttledCallback;
};
