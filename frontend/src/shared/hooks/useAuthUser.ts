/**
 * Custom hook to get authenticated user data
 * Handles user data extraction from localStorage and provides logout functionality
 */
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { authApiClient } from "../../slices/auth/services/authApiClient"

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
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Try to get user data from localStorage first
        const storedUser = localStorage.getItem('user')
        const accessToken = localStorage.getItem('accessToken')

        if (!accessToken) {
          // No token, redirect to login
          router.push('/login')
          return
        }

        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser({
            name: userData.first_name && userData.last_name
              ? `${userData.first_name} ${userData.last_name}`.trim()
              : 'Usuario',
            role: translateRole(userData.user_type || 'patient'),
            avatar: userData.avatar,
            id: userData.id,
            email: userData.email
          })
        } else {
          // Try to fetch user data from API
          try {
            const response = await authApiClient.getCurrentUser()
            if (response.success && response.user) {
              const userData = response.user
              setUser({
                name: userData.firstName && userData.lastName
                  ? `${userData.firstName} ${userData.lastName}`.trim()
                  : 'Usuario',
                role: translateRole(userData.userType || 'patient'),
                avatar: undefined, // No avatar in current implementation
                id: userData.id,
                email: userData.email
              })

              // Store user data for future use
              localStorage.setItem('user', JSON.stringify(userData))
            }
          } catch (apiError) {
            console.error('Failed to fetch user data:', apiError)
            // If API fails, redirect to login
            router.push('/login')
            return
          }
        }
      } catch (err) {
        console.error('Error loading user data:', err)
        setError('Error loading user data')
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [router])

  const logout = async () => {
    try {
      // Call API logout
      await authApiClient.logout(false)
    } catch (error) {
      console.error('Logout API error (continuing anyway):', error)
    } finally {
      // Always clear local storage and redirect
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')

      // Redirect to login
      router.push('/login')
    }
  }

  return {
    user,
    isLoading,
    logout,
    error
  }
}