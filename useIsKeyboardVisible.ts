import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

interface IProps {
  type?: 'Did' | 'Will';
  enabled?: boolean;
}

// react native

export const useIsKeyboardVisible = ({ type = 'Did', enabled = true }: IProps) => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const keyboardDidShowListener = Keyboard.addListener(`keyboard${type}Show`, () => {
      setIsKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener(`keyboard${type}Hide`, () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [enabled]);

  return {
    isKeyboardVisible,
  };
};
