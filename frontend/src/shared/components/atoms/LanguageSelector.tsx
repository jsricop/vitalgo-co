"use client"

import { useState } from "react"
import { ChevronDown, Globe } from "lucide-react"

interface Language {
  code: string
  name: string
  flag: string
}

interface LanguageSelectorProps {
  currentLanguage?: string
  onLanguageChange?: (language: string) => void
  className?: string
}

const languages: Language[] = [
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "en", name: "English", flag: "🇺🇸" }
]

export function LanguageSelector({
  currentLanguage = "es",
  onLanguageChange,
  className = ""
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0]

  const handleLanguageChange = (languageCode: string) => {
    setIsOpen(false)
    if (onLanguageChange) {
      onLanguageChange(languageCode)
    }
    // Store preference in localStorage
    localStorage.setItem('preferred-language', languageCode)
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-vitalgo-green transition-colors duration-200 text-sm"
        aria-label="Seleccionar idioma"
      >
        <Globe size={16} />
        <span className="hidden sm:inline">{currentLang.flag} {currentLang.name}</span>
        <span className="sm:hidden">{currentLang.flag}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute bottom-full right-0 mb-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-20">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`flex items-center gap-2 w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                  language.code === currentLanguage ? 'text-vitalgo-green bg-gray-50' : 'text-gray-700'
                }`}
              >
                <span>{language.flag}</span>
                <span>{language.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}