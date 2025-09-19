"use client"

import { CopyrightText } from "../atoms/CopyrightText"
import { LanguageSelector } from "../atoms/LanguageSelector"

interface BottomBarProps {
  showLanguageSelector?: boolean
  currentLanguage?: string
  onLanguageChange?: (language: string) => void
  className?: string
}

export function BottomBar({
  showLanguageSelector = true,
  currentLanguage = "es",
  onLanguageChange,
  className = ""
}: BottomBarProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-gray-200 ${className}`}>
      <CopyrightText />
      {showLanguageSelector && (
        <LanguageSelector
          currentLanguage={currentLanguage}
          onLanguageChange={onLanguageChange}
        />
      )}
    </div>
  )
}