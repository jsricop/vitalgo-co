"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Logo } from "../atoms/Logo"

interface BrandHeaderProps {
  isAuthenticated?: boolean
  showBackButton?: boolean
  backUrl?: string
  backText?: string
  className?: string
}

export function BrandHeader({
  isAuthenticated = false,
  showBackButton = false,
  backUrl = "/",
  backText = "Volver",
  className = ""
}: BrandHeaderProps) {
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {showBackButton && (
        <Link
          href={backUrl}
          className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-vitalgo-green transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{backText}</span>
        </Link>
      )}
      <Logo isAuthenticated={isAuthenticated} />
    </div>
  )
}