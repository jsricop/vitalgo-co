"use client"

interface CopyrightTextProps {
  className?: string
  companyName?: string
}

export function CopyrightText({
  className = "",
  companyName = "VitalGo"
}: CopyrightTextProps) {
  const currentYear = new Date().getFullYear()

  return (
    <p className={`text-gray-500 text-sm ${className}`}>
      © {currentYear} {companyName}. Todos los derechos reservados.
    </p>
  )
}