import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

interface IProps {
  onBackground: () => void;
  onActive: () => void;
}

export const useAppStateChange = ({ onActive, onBackground }: IProps) => {
  const movedToBackgroundRef = useRef(false);

  useEffect(() => {
    const listener = AppState.addEventListener('change', async state => {
      if (state === 'background') {
        movedToBackgroundRef.current = true;
        onBackground();
        return;
      }
      if (state === 'active') {
        if (!movedToBackgroundRef.current) return;
        movedToBackgroundRef.current = false;
        onActive();
      }
    });

    return () => {
      listener.remove();
    };
  }, []);
};
