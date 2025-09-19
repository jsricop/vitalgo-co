"use client"

import { LanguageSelector } from "../atoms/LanguageSelector"
import { LinkedInIcon } from "../atoms/LinkedInIcon"

interface LanguageSupportProps {
  currentLanguage?: string
  onLanguageChange?: (language: string) => void
  className?: string
}

export function LanguageSupport({
  currentLanguage = "es",
  onLanguageChange,
  className = ""
}: LanguageSupportProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-gray-900 font-medium text-sm mb-3">Conectar</h3>
      <div className="space-y-3">
        <LinkedInIcon />
        <LanguageSelector
          currentLanguage={currentLanguage}
          onLanguageChange={onLanguageChange}
        />
      </div>
    </div>
  )
}