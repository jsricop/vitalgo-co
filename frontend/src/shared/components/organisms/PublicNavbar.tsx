"use client"

import { BrandHeader } from "../molecules/BrandHeader"

interface PublicNavbarProps {
  showBackButton?: boolean
  backUrl?: string
  backText?: string
  className?: string
  onBackClick?: () => void
  useHistoryBack?: boolean
}

export function PublicNavbar({
  showBackButton = false,
  backUrl = "/",
  backText = "Regresar",
  className = "",
  onBackClick,
  useHistoryBack = false
}: PublicNavbarProps) {
  return (
    <nav className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <BrandHeader
            isAuthenticated={false}
            showBackButton={showBackButton}
            backUrl={backUrl}
            backText={backText}
            onBackClick={onBackClick}
            useHistoryBack={useHistoryBack}
          />
        </div>
      </div>
    </nav>
  )
}