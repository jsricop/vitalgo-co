"use client"

import Link from "next/link"

interface FooterLinkProps {
  href: string
  children: React.ReactNode
  external?: boolean
  className?: string
}

export function FooterLink({
  href,
  children,
  external = false,
  className = ""
}: FooterLinkProps) {
  const baseClasses = "text-gray-600 hover:text-vitalgo-green transition-colors duration-200 text-sm"
  const combinedClasses = `${baseClasses} ${className}`

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={combinedClasses}
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={combinedClasses}>
      {children}
    </Link>
  )
}