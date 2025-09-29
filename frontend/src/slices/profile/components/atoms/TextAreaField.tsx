/**
 * TextAreaField Atom Component
 * Reusable textarea for forms
 */
import { TextAreaFieldProps } from '../../types/personalInfo';

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder = "",
  required = false,
  error,
  rows = 3,
  className = ""
}: TextAreaFieldProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-vitalgo-green focus:border-vitalgo-green resize-vertical ${
          error
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300'
        }`}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}