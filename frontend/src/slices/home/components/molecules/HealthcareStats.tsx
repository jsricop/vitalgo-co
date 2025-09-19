import React from 'react'
import { StatCard } from '../atoms/StatCard'
import { Users, HeartHandshake, Clock, Activity } from 'lucide-react'

export function HealthcareStats() {
  const stats = [
    {
      number: "10K+",
      label: "Pacientes Activos",
      icon: <Users className="h-5 w-5 text-vitalgo-green" />
    },
    {
      number: "500+",
      label: "Centros de Salud",
      icon: <HeartHandshake className="h-5 w-5 text-vitalgo-green" />
    },
    {
      number: "70%",
      label: "Reducción Tiempos",
      icon: <Clock className="h-5 w-5 text-vitalgo-green" />
    },
    {
      number: "99.9%",
      label: "Disponibilidad",
      icon: <Activity className="h-5 w-5 text-vitalgo-green" />
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto" data-testid="home-healthcare-stats">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  )
}