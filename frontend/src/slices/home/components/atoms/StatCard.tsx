import React from 'react'

interface StatCardProps {
  number: string
  label: string
  icon: React.ReactNode
  className?: string
}

export function StatCard({ number, label, icon, className = '' }: StatCardProps) {
  return (
    <div className={`text-center ${className}`} data-testid="home-stat-card">
      <div className="flex justify-center mb-2">
        <div className="w-10 h-10 bg-vitalgo-green/10 rounded-lg flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-vitalgo-dark mb-1" data-testid="home-stat-number">
        {number}
      </div>
      <div className="text-sm text-gray-600" data-testid="home-stat-label">
        {label}
      </div>
    </div>
  )
}