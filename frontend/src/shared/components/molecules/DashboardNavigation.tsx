/**
 * Dashboard Navigation Molecule
 * Navigation items specific to dashboard with active state management
 */
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavigationItem {
  label: string
  href: string
  icon?: React.ReactNode
}

interface DashboardNavigationProps {
  className?: string
  'data-testid'?: string
}

export function DashboardNavigation({
  className = "",
  'data-testid': testId
}: DashboardNavigationProps) {
  const pathname = usePathname()

  const navigationItems: NavigationItem[] = [
    {
      label: "Dashboard",
      href: "/dashboard"
    }
  ]

  const isActiveRoute = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard"
    }
    return pathname?.startsWith(href)
  }

  // Determine if this is mobile layout based on className
  const isMobileLayout = className.includes('flex-col')

  return (
    <nav className={className || "hidden md:flex space-x-8"} data-testid={testId}>
      {navigationItems.map((item) => {
        const isActive = isActiveRoute(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-2 rounded-md font-medium transition-colors ${
              isActive
                ? "text-vitalgo-green bg-vitalgo-green/10"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            } ${isMobileLayout ? 'block w-full text-left' : ''}`}
            data-testid={`dashboard-nav-${item.label.toLowerCase()}`}
          >
            {item.icon && <span className="mr-2">{item.icon}</span>}
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}