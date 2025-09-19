"use client"

import { Logo } from "../atoms/Logo"

interface CompanyInfoProps {
  className?: string
}

export function CompanyInfo({ className = "" }: CompanyInfoProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <Logo
        isAuthenticated={false}
        className="h-8 w-auto"
      />
      <div className="space-y-2">
        <p className="text-vitalgo-green font-medium text-sm">
          Diagnóstico rápido y atención prioritaria
        </p>
        <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
          Plataforma médica que conecta pacientes con información crítica de salud para emergencias y atención médica prioritaria.
        </p>
      </div>
    </div>
  )
}