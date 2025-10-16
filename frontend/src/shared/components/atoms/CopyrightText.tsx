"use client"

import { useTranslations } from 'next-intl'

interface CopyrightTextProps {
  className?: string
  companyName?: string
}

export function CopyrightText({
  className = "",
  companyName = "VitalGo"
}: CopyrightTextProps) {
  const t = useTranslations('common')
  const currentYear = new Date().getFullYear()

  return (
    <p className={`text-gray-500 text-sm ${className}`}>
      © {currentYear} {companyName}. {t('allRightsReserved')}
    </p>
  )
}