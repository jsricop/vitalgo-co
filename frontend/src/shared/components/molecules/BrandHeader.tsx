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
  onBackClick?: () => void
  useHistoryBack?: boolean
}

export function BrandHeader({
  isAuthenticated = false,
  showBackButton = false,
  backUrl = "/",
  backText = "Regresar",
  className = "",
  onBackClick,
  useHistoryBack = false
}: BrandHeaderProps) {
  const shouldUseHistoryBack = useHistoryBack && !onBackClick
  const handleBackClick = onBackClick || (shouldUseHistoryBack ? () => window.history.back() : undefined)

  return (
    <div className={`flex items-center justify-between w-full ${className}`}>
      {showBackButton && (
        shouldUseHistoryBack || onBackClick ? (
          <button
            onClick={handleBackClick}
            className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-vitalgo-green transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{backText}</span>
          </button>
        ) : (
          <Link
            href={backUrl}
            className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-vitalgo-green transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{backText}</span>
          </Link>
        )
      )}
      <Logo isAuthenticated={isAuthenticated} />
    </div>
  )
}