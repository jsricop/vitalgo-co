"use client"

import Link from "next/link"

interface LogoProps {
  isAuthenticated?: boolean
  className?: string
}

export function Logo({ isAuthenticated = false, className = "" }: LogoProps) {
  const targetUrl = isAuthenticated ? '/dashboard' : '/'

  return (
    <Link
      href={targetUrl}
      className={`inline-block transition-opacity hover:opacity-80 ${className}`}
    >
      <img
        src="/assets/images/logos/logoh-blue-light-background.png"
        alt="VitalGo - Diagnóstico rápido y atención prioritaria"
        className="h-8 w-auto md:h-10"
      />
    </Link>
  )
}