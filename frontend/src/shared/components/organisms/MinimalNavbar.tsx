"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { BrandHeader } from "../molecules/BrandHeader"

interface MinimalNavbarProps {
  backText: string
  backUrl: string
  showLogo?: boolean
  className?: string
}

export function MinimalNavbar({
  backText,
  backUrl,
  showLogo = true,
  className = ""
}: MinimalNavbarProps) {
  return (
    <nav className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {showLogo ? (
            <BrandHeader
              isAuthenticated={false}
              showBackButton={true}
              backUrl={backUrl}
              backText={backText}
            />
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                href={backUrl}
                className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-vitalgo-green transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{backText}</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}