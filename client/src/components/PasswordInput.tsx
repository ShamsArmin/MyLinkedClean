import React from 'react';

interface PasswordInputProps {
  id: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  placeholder,
  value,
  onChange,
  required = false
}) => {
  return (
    <input
      id={id}
      name={id}
      type="password"
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      autoComplete="new-password"
    />
  );
};

export default PasswordInput;