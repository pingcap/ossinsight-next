import * as React from 'react';

export function LimitInput({
  id,
  value,
  onValueChange,
}: {
  id: string;
  value: number;
  onValueChange: (newValue: number | undefined) => void;
}) {
  const handleInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(event.target.value);
      onValueChange(newValue);
    },
    [onValueChange]
  );

  return (
    <input
      className='TextInput'
      id={id}
      value={value}
      onChange={handleInputChange}
    />
  );
}
