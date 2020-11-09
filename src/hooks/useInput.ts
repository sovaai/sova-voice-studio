import { ChangeEvent, useState } from 'react';

export const useInput = (initialValue: string | number) => {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    setValue,
    reset: (value?: string) => setValue(value ? value : ''),
    bind: {
      value: value || '',
      onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setValue(event.target.value);
      },
    },
    discard: () => setValue(initialValue),
  };
};
