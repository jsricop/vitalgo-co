"use client"

import { useState, useEffect } from "react"
import { CompanyInfo } from "../molecules/CompanyInfo"
import { LegalSection } from "../molecules/LegalSection"
import { SupportSection } from "../molecules/SupportSection"
import { LanguageSupport } from "../molecules/LanguageSupport"
import { BottomBar } from "../molecules/BottomBar"
import { LocalStorageService } from "../../services/local-storage-service"

interface PublicFooterProps {
  whatsappNumber?: string
  className?: string
}

export function PublicFooter({
  whatsappNumber = "+573001234567",
  className = ""
}: PublicFooterProps) {
  const [currentLanguage, setCurrentLanguage] = useState("es")

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = LocalStorageService.getPreferredLanguage()
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language)
    // Here you would typically trigger app-wide language change
    // For now, we just store the preference
  }

  return (
    <footer className={`bg-white border-t border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <CompanyInfo />
          </div>

          {/* Legal Links */}
          <div>
            <LegalSection />
          </div>

          {/* Support & Connect */}
          <div className="space-y-8">
            <SupportSection whatsappNumber={whatsappNumber} />
            <LanguageSupport
              currentLanguage={currentLanguage}
              onLanguageChange={handleLanguageChange}
            />
          </div>
        </div>

        {/* Bottom bar */}
        <BottomBar
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
          showLanguageSelector={false} // Already shown in LanguageSupport
        />
      </div>
    </footer>
  )
}