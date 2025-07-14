import { ChevronDown } from 'lucide-react';

type FilterDropdownProps = {
  label: string;
  options: string[];
  selectedValue: string;
  onValueChange: (value: string) => void;
};

export function FilterDropdown({ label, options, selectedValue, onValueChange }: FilterDropdownProps) {
  return (
    <div className="relative">
      <label htmlFor={label} className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <select
        id={label}
        value={selectedValue}
        onChange={(e) => onValueChange(e.target.value)}
        className="w-full appearance-none bg-surface-main border border-gray-600 text-white py-2 px-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-gray-700 focus:border-blue-500"
      >
        <option value="">Todos</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 pt-6 text-gray-400">
        <ChevronDown className="h-4 w-4" />
      </div>
    </div>
  );
}