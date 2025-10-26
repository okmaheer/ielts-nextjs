import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  name?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  value = '',
  placeholder = 'Select an option',
  onChange,
  className = '',
  disabled = false,
  name,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <select
      name={name}
      value={value}
      onChange={handleChange}
      disabled={disabled}
      className={`w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition-all duration-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 dark:border-white/[0.05] dark:bg-white/[0.03] dark:text-white/90 dark:focus:border-brand-500 dark:disabled:bg-white/[0.02] ${className}`}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
