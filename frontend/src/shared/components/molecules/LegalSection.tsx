"use client"

import { FooterLink } from "../atoms/FooterLink"

interface LegalSectionProps {
  className?: string
}

export function LegalSection({ className = "" }: LegalSectionProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-gray-900 font-medium text-sm mb-3">Legal</h3>
      <div className="space-y-2">
        <FooterLink href="/politica-de-privacidad">
          Política de Privacidad
        </FooterLink>
        <FooterLink href="/terminos-y-condiciones">
          Términos y Condiciones
        </FooterLink>
      </div>
    </div>
  )
}