"use client"

import { WhatsAppButton } from "../atoms/WhatsAppButton"
import { FooterLink } from "../atoms/FooterLink"

interface SupportSectionProps {
  whatsappNumber?: string
  className?: string
}

export function SupportSection({
  whatsappNumber = "+573001234567", // Default Colombian number format
  className = ""
}: SupportSectionProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-gray-900 font-medium text-sm mb-3">Soporte</h3>
      <div className="space-y-2">
        <WhatsAppButton phoneNumber={whatsappNumber} />
        <FooterLink href="/centro-de-ayuda">
          Centro de Ayuda
        </FooterLink>
        <FooterLink href="/preguntas-frecuentes">
          Preguntas Frecuentes
        </FooterLink>
      </div>
    </div>
  )
}