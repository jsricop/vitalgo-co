"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { UserAvatar } from "../atoms/UserAvatar"
import { LogoutButton } from "../atoms/LogoutButton"

interface UserMenuProps {
  user: {
    name: string
    role: string
    avatar?: string
  }
  onLogout: () => void
  className?: string
  'data-testid'?: string
}

export function UserMenu({ user, onLogout, className = "", 'data-testid': testId }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`relative ${className}`} data-testid={testId}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
        data-testid="user-menu-trigger"
      >
        <UserAvatar name={user.name} avatar={user.avatar} size="sm" />
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-500 capitalize">{user.role}</p>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-20" data-testid="user-menu-dropdown">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>

            <div className="border-t border-gray-100 pt-1">
              <LogoutButton
                onLogout={onLogout}
                variant="menu"
                data-testid="dashboard-logout-button"
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}