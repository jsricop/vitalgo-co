"use client"

import { MessageCircle } from "lucide-react"

interface WhatsAppButtonProps {
  phoneNumber: string
  message?: string
  className?: string
  variant?: "text" | "button"
}

export function WhatsAppButton({
  phoneNumber,
  message = "Hola, necesito ayuda con VitalGo",
  className = "",
  variant = "text"
}: WhatsAppButtonProps) {
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`

  const baseClasses = variant === "button"
    ? "inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-lg hover:bg-[#20BD5A] transition-colors duration-200"
    : "inline-flex items-center gap-2 text-gray-600 hover:text-[#25D366] transition-colors duration-200"

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClasses} ${className}`}
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle size={16} />
      <span className="text-sm">Contactar por WhatsApp</span>
    </a>
  )
}