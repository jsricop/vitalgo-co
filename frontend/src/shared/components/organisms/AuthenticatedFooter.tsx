"use client"

import { useState, useEffect } from "react"
import { Logo } from "../atoms/Logo"
import { FooterLink } from "../atoms/FooterLink"
import { WhatsAppButton } from "../atoms/WhatsAppButton"
import { LanguageSelector } from "../atoms/LanguageSelector"
import { CopyrightText } from "../atoms/CopyrightText"
import { LocalStorageService } from "../../services/local-storage-service"

interface AuthenticatedFooterProps {
  whatsappNumber?: string
  className?: string
}

export function AuthenticatedFooter({
  whatsappNumber = "+573001234567",
  className = ""
}: AuthenticatedFooterProps) {
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
  }

  return (
    <footer className={`bg-white border-t border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left: Logo + Copyright */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Logo
              isAuthenticated={true}
              className="h-6 w-auto"
            />
            <CopyrightText className="hidden sm:block" />
          </div>

          {/* Center: Quick Links */}
          <div className="flex flex-wrap gap-4 sm:gap-6">
            <FooterLink href="/politica-de-privacidad">
              Política de Privacidad
            </FooterLink>
            <FooterLink href="/terminos-y-condiciones">
              Términos y Condiciones
            </FooterLink>
            <WhatsAppButton phoneNumber={whatsappNumber} />
          </div>

          {/* Right: Language Selector */}
          <div className="flex items-center gap-4">
            <LanguageSelector
              currentLanguage={currentLanguage}
              onLanguageChange={handleLanguageChange}
            />
          </div>
        </div>

        {/* Mobile copyright */}
        <div className="sm:hidden mt-4">
          <CopyrightText />
        </div>
      </div>
    </footer>
  )
}