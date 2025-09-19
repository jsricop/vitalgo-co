"use client"

import { Menu, X } from "lucide-react"

interface MobileMenuToggleProps {
  isOpen: boolean
  onToggle: () => void
  className?: string
}

export function MobileMenuToggle({ isOpen, onToggle, className = "" }: MobileMenuToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-vitalgo-green hover:bg-gray-50 transition-colors ${className}`}
      aria-expanded={isOpen}
      aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
    >
      {isOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <Menu className="h-6 w-6" />
      )}
    </button>
  )
}