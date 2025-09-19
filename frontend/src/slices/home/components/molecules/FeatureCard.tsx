import { ReactNode } from 'react'
import { Card, CardContent } from '../atoms/Card'
import { Badge } from '../atoms/Badge'

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  badge?: string
}

export function FeatureCard({ icon, title, description, badge }: FeatureCardProps) {
  return (
    <Card
      className="h-full hover:shadow-lg transition-all duration-300 border-gray-100 hover:border-vitalgo-green/20"
      data-testid="home-feature-card"
    >
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-vitalgo-green/10 rounded-xl flex items-center justify-center">
            {icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3
                className="font-semibold text-gray-900"
                data-testid="home-feature-card-title"
              >
                {title}
              </h3>
              {badge && (
                <Badge
                  variant="secondary"
                  className="text-xs"
                  data-testid="home-feature-card-badge"
                >
                  {badge}
                </Badge>
              )}
            </div>
            <p
              className="text-sm text-gray-600 leading-relaxed"
              data-testid="home-feature-card-description"
            >
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}