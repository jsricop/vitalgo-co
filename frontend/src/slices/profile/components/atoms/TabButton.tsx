/**
 * TabButton Atom Component
 * Individual tab button for profile page navigation
 */

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  'data-testid'?: string;
}

export function TabButton({ label, isActive, onClick, 'data-testid': testId }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      data-testid={testId}
      className={`
        px-6 py-3 font-medium transition-colors duration-150 min-h-[44px]
        border-b-2 relative
        ${
          isActive
            ? 'bg-vitalgo-green text-white border-vitalgo-green'
            : 'bg-gray-50 text-gray-600 border-transparent hover:bg-gray-100 hover:text-gray-800'
        }
        first:rounded-tl-xl last:rounded-tr-xl
      `}
    >
      {label}
    </button>
  );
}