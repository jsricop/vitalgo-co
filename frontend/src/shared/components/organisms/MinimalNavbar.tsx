"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { BrandHeader } from "../molecules/BrandHeader"
import { LanguageSelectorCompact } from "../molecules/LanguageSelector"

interface MinimalNavbarProps {
  backText: string
  backUrl: string
  showLogo?: boolean
  showLanguageSwitcher?: boolean
  className?: string
}

export function MinimalNavbar({
  backText,
  backUrl,
  showLogo = true,
  showLanguageSwitcher = true,
  className = ""
}: MinimalNavbarProps) {
  return (
    <nav className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-center h-16">
          {/* Left side: Back button */}
          <div className="absolute left-0 flex items-center">
            <Link
              href={backUrl}
              className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-vitalgo-green transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">{backText}</span>
            </Link>
          </div>

          {/* Center: Logo */}
          {showLogo && (
            <div className="flex items-center justify-center">
              <Link href="/">
                <img
                  src="/assets/images/logos/logoh-blue-light-background.png"
                  alt="VitalGo"
                  className="h-10 w-auto"
                />
              </Link>
            </div>
          )}

          {/* Right side: Language Switcher */}
          {showLanguageSwitcher && (
            <div className="absolute right-0 flex items-center">
              <LanguageSelectorCompact />
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}