import { ReactNode } from 'react'

interface HomeLayoutProps {
  children: ReactNode
}

export function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div
      className="min-h-screen bg-white"
      data-testid="home-layout"
    >
      {children}
    </div>
  )
}