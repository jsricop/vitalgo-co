/**
 * Custom hook to get authenticated user data for UI display only
 * No longer handles authentication logic - uses AuthContext as source of truth
 */
"use client"

import { useAuth } from "../contexts/AuthContext"

interface AuthUser {
  name: string
  role: string
  avatar?: string
  id?: string
  email?: string
}

interface UseAuthUserResult {
  user: AuthUser | null
  isLoading: boolean
  logout: () => Promise<void>
  error: string | null
}

const translateRole = (role: string): string => {
  const roleTranslations: Record<string, string> = {
    'patient': 'Paciente',
    'doctor': 'Doctor',
    'admin': 'Administrador'
  }
  return roleTranslations[role] || role
}

export function useAuthUser(): UseAuthUserResult {
  const { user: authUser, isLoading, logout, error } = useAuth()

  // Transform AuthContext user data for UI display
  const user: AuthUser | null = authUser ? {
    name: authUser.firstName && authUser.lastName
      ? `${authUser.firstName} ${authUser.lastName}`.trim()
      : 'Usuario',
    role: translateRole(authUser.userType || 'patient'),
    avatar: undefined, // No avatar in current implementation
    id: authUser.id,
    email: authUser.email
  } : null

  console.log('🔍 useAuthUser: Transforming user data', {
    authUser,
    transformedUser: user,
    isLoading
  })

  return {
    user,
    isLoading,
    logout,
    error
  }
}