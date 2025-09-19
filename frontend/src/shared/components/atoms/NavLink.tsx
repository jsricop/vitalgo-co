"use client"

import Link from "next/link"

interface NavLinkProps {
  href: string
  children: React.ReactNode
  active?: boolean
  className?: string
}

export function NavLink({ href, children, active = false, className = "" }: NavLinkProps) {
  const baseClasses = "text-sm font-medium transition-colors hover:text-vitalgo-green"
  const activeClasses = active
    ? "text-vitalgo-green"
    : "text-gray-600"

  return (
    <Link
      href={href}
      className={`${baseClasses} ${activeClasses} ${className}`}
    >
      {children}
    </Link>
  )
}