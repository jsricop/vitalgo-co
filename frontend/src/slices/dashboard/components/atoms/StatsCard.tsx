/**
 * Stats Card atom component
 * Displays dashboard statistics with icon and value
 */
import React from 'react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info';
  suffix?: string;
  'data-testid'?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  variant = 'default',
  suffix = '',
  'data-testid': testId
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'border-vitalgo-green bg-green-50';
      case 'warning':
        return 'border-yellow-300 bg-yellow-50';
      case 'info':
        return 'border-blue-300 bg-blue-50';
      default:
        return 'border-gray-300 bg-white';
    }
  };

  const getIconClasses = () => {
    switch (variant) {
      case 'success':
        return 'text-vitalgo-green';
      case 'warning':
        return 'text-yellow-600';
      case 'info':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div
      className={`p-6 rounded-lg border-2 ${getVariantClasses()}`}
      data-testid={testId}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900">
            {value}{suffix}
          </p>
        </div>
        <div className={`flex-shrink-0 ${getIconClasses()}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};