"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BrandHeader } from "../molecules/BrandHeader"
import { UserMenu } from "../molecules/UserMenu"
import { MobileMenuToggle } from "../molecules/MobileMenuToggle"

interface AuthenticatedNavbarProps {
  user: {
    name: string
    role: string
    avatar?: string
  }
  onLogout?: () => void
  className?: string
}

export function AuthenticatedNavbar({
  user,
  onLogout,
  className = ""
}: AuthenticatedNavbarProps) {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_data')
    localStorage.removeItem('user_role')

    // Call custom logout handler if provided
    if (onLogout) {
      onLogout()
    }

    // Redirect to login
    router.push('/login')
  }

  return (
    <nav className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <BrandHeader isAuthenticated={true} />

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <UserMenu user={user} onLogout={handleLogout} />
          </div>

          {/* Mobile Menu Toggle */}
          <MobileMenuToggle
            isOpen={isMobileMenuOpen}
            onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex items-center space-x-3 px-4 py-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
            <div className="px-4">
              <UserMenu user={user} onLogout={handleLogout} />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}