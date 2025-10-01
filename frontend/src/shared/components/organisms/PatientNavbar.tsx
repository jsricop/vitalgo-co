/**
 * PatientNavbar - Pure UI navigation component for authenticated patients
 * No authentication logic - only UI display and logout functionality
 */
"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { BrandHeader } from "../molecules/BrandHeader"
import { UserMenu } from "../molecules/UserMenu"
import { MobileMenuToggle } from "../molecules/MobileMenuToggle"
import { useAuthUser } from "../../hooks/useAuthUser"

interface NavigationItem {
  label: string
  href: string
  icon?: React.ReactNode
}

interface PatientNavbarProps {
  className?: string
  'data-testid'?: string
}

export function PatientNavbar({
  className = "",
  'data-testid': testId
}: PatientNavbarProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, isLoading, logout } = useAuthUser()

  const navigationItems: NavigationItem[] = [
    {
      label: "Mi Perfil",
      href: "/profile"
    },
    {
      label: "Dashboard",
      href: "/dashboard"
    },
    {
      label: "Mi QR",
      href: "/qr"
    }
  ]

  const isActiveRoute = (href: string) => {
    if (href === "/profile") {
      return pathname === "/profile"
    }
    if (href === "/dashboard") {
      return pathname === "/dashboard"
    }
    if (href === "/qr") {
      return pathname === "/qr"
    }
    return pathname?.startsWith(href)
  }

  console.log('🔍 PatientNavbar: Rendering with user data', {
    user,
    isLoading,
    hasUser: !!user
  })

  // Show loading state while user data is being loaded
  if (isLoading) {
    return (
      <nav className={`bg-white border-b border-gray-200 ${className}`} data-testid={testId}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <BrandHeader isAuthenticated={true} />
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-vitalgo-green"></div>
              <span className="text-sm text-gray-600">Cargando...</span>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  // If no user data, show minimal navbar (AuthGuard should handle redirects)
  if (!user) {
    return (
      <nav className={`bg-white border-b border-gray-200 ${className}`} data-testid={testId}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <BrandHeader isAuthenticated={true} />
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Cargando usuario...</span>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className={`bg-white border-b border-gray-200 ${className}`} data-testid={testId}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Brand Header */}
          <div className="flex-shrink-0">
            <BrandHeader isAuthenticated={true} />
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="flex-1 ml-8 md:ml-12 lg:ml-16">
            <div className="hidden md:flex space-x-8 justify-center">
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
                    }`}
                    data-testid={`patient-nav-${item.label.toLowerCase()}`}
                  >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            <UserMenu
              user={user}
              onLogout={logout}
              data-testid="patient-user-menu"
            />
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <MobileMenuToggle
              isOpen={isMobileMenuOpen}
              onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="mobile-menu-toggle"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4" data-testid="mobile-menu">
            {/* Mobile User Info */}
            <div className="flex items-center space-x-3 px-4 py-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="px-4 py-2">
              <nav className="flex flex-col space-y-2">
                {navigationItems.map((item) => {
                  const isActive = isActiveRoute(item.href)

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-3 py-2 rounded-md font-medium transition-colors block w-full text-left ${
                        isActive
                          ? "text-vitalgo-green bg-vitalgo-green/10"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                      data-testid={`mobile-patient-nav-${item.label.toLowerCase()}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.icon && <span className="mr-2">{item.icon}</span>}
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* Mobile User Menu */}
            <div className="px-4 mt-4">
              <UserMenu
                user={user}
                onLogout={logout}
                data-testid="mobile-patient-user-menu"
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}