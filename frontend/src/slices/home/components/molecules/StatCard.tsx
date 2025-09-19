import { ReactNode } from 'react'

interface StatCardProps {
  number: string
  label: string
  icon: ReactNode
}

export function StatCard({ number, label, icon }: StatCardProps) {
  return (
    <div className="text-center" data-testid="home-stat-card">
      <div className="flex justify-center mb-2">
        <div className="w-10 h-10 bg-vitalgo-green/10 rounded-lg flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div
        className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1"
        data-testid="home-stat-card-number"
      >
        {number}
      </div>
      <div
        className="text-sm text-gray-600"
        data-testid="home-stat-card-label"
      >
        {label}
      </div>
    </div>
  )
}