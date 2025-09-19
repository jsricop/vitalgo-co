"use client"

import { Linkedin } from "lucide-react"

interface LinkedInIconProps {
  size?: number
  className?: string
}

export function LinkedInIcon({ size = 20, className = "" }: LinkedInIconProps) {
  return (
    <a
      href="https://www.linkedin.com/company/myvitalgo/"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 text-gray-600 hover:text-[#0077B5] transition-colors duration-200 ${className}`}
      aria-label="Síguenos en LinkedIn"
    >
      <Linkedin size={size} />
      <span className="text-sm">Síguenos en LinkedIn</span>
    </a>
  )
}