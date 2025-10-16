"use client"

import { useTranslations } from 'next-intl'
import { FooterLink } from "../atoms/FooterLink"
import { CopyrightText } from "../atoms/CopyrightText"

interface MinimalFooterProps {
  className?: string
}

export function MinimalFooter({ className = "" }: MinimalFooterProps) {
  const t = useTranslations('common')

  return (
    <footer className={`bg-white border-t border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left: Copyright */}
          <CopyrightText />

          {/* Right: Essential Legal Links */}
          <div className="flex gap-4">
            <FooterLink href="/politica-de-privacidad">
              {t('privacyPolicy')}
            </FooterLink>
            <FooterLink href="/terminos-y-condiciones">
              {t('termsAndConditions')}
            </FooterLink>
          </div>
        </div>
      </div>
    </footer>
  )
}