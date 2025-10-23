/**
 * SelectField Atom Component
 * Reusable select dropdown for forms
 */
import { useTranslations } from 'next-intl';
import { SelectFieldProps } from '../../types/personalInfo';

export function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  error,
  className = ""
}: SelectFieldProps) {
  const t = useTranslations('common');
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-vitalgo-green focus:border-vitalgo-green ${
          error
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300'
        }`}
      >
        <option value="">{placeholder || t('select')}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}