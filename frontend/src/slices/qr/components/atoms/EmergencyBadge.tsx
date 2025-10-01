/**
 * Emergency Badge Atom Component
 * Badge indicating emergency access functionality
 */

interface EmergencyBadgeProps {
  'data-testid'?: string;
}

export function EmergencyBadge({ 'data-testid': testId }: EmergencyBadgeProps) {
  return (
    <div
      className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium"
      data-testid={testId}
    >
      <svg
        className="w-3 h-3"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
          clipRule="evenodd"
        />
      </svg>
      Acceso de Emergencia
    </div>
  );
}