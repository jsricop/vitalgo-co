import { ReactNode } from 'react'
import { TransparentNavbar } from '../organisms/TransparentNavbar'

interface HomeLayoutProps {
  children: ReactNode
}

export function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <div
      className="min-h-screen bg-white"
      data-testid="home-layout"
    >
      <TransparentNavbar />
      <div className="pt-20">
        {children}
      </div>
    </div>
  )
}