import { useCallback, useState } from 'react';
import { useDebounceFunction } from './useDebounceFunction';

export type ValidationRule<T> = (value: T) => string | null;

interface UseFormOptions<T> {
  initialValues: T;
  validationRules?: Partial<Record<keyof T, ValidationRule<T[keyof T]>>>;
}

interface UseFormResult<T> {
  values: T;
  errors: Partial<Record<keyof T, string | null>>;
  onChange: (key: keyof T, value: T[keyof T]) => void;
  onBlur: (key: keyof T) => void;
  resetForm: () => void;
  isValid: boolean;
}

export function useForm<T extends Record<string, any>>(
  options: UseFormOptions<T>,
): UseFormResult<T> {
  const { initialValues, validationRules = {} as any } = options;

  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string | null>>>({});

  const [validateField, cleanup] = useDebounceFunction((key: keyof T, value: T[keyof T]) => {
    const rule = validationRules[key];
    const error = rule ? rule(value) : null;
    setErrors(prev => ({ ...prev, [key]: error }));
  }, 300);

  const onChange = useCallback(
    (key: keyof T, value: T[keyof T]) => {
      setValues(prev => ({ ...prev, [key]: value }));
      if (errors[key]) {
        validateField(key, value);
      }
    },
    [errors],
  );

  const onBlur = useCallback(
    (key: keyof T) => {
      cleanup();
      validateField(key, values[key]);
    },
    [values],
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, []);

  const isValid = Object.values(errors).every(error => !error);

  return {
    values,
    errors,
    onChange,
    onBlur,
    resetForm,
    isValid,
  };
}
