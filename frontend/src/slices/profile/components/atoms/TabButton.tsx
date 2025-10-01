/**
 * TabButton Atom Component
 * Individual tab button for profile page navigation
 */

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  variant?: 'green' | 'purple';
  'data-testid'?: string;
}

export function TabButton({ label, isActive, onClick, variant = 'green', 'data-testid': testId }: TabButtonProps) {
  const activeStyles = variant === 'purple'
    ? 'bg-purple-500 text-white border-purple-500'
    : 'bg-vitalgo-green text-white border-vitalgo-green';

  return (
    <button
      onClick={onClick}
      data-testid={testId}
      className={`
        px-6 py-3 font-medium transition-colors duration-150 min-h-[44px]
        border-b-2 relative
        ${
          isActive
            ? activeStyles
            : 'bg-gray-50 text-gray-600 border-transparent hover:bg-gray-100 hover:text-gray-800'
        }
        first:rounded-tl-xl last:rounded-tr-xl
      `}
    >
      {label}
    </button>
  );
}