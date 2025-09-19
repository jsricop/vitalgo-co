import React from 'react'
import { Badge } from './Badge'

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  badge?: string
  className?: string
}

export function FeatureCard({
  icon,
  title,
  description,
  badge,
  className = ''
}: FeatureCardProps) {
  return (
    <div
      className={`h-full hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-vitalgo-green/20 rounded-xl p-6 bg-white ${className}`}
      data-testid="home-feature-card"
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-vitalgo-green/10 rounded-xl flex items-center justify-center">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-vitalgo-dark" data-testid="home-feature-title">
              {title}
            </h3>
            {badge && (
              <Badge variant="success" className="text-xs" data-testid="home-feature-badge">
                {badge}
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600 leading-relaxed" data-testid="home-feature-description">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}