import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'VitalGo - Tu Salud Unificada, La Medicina Simplificada',
  description: 'Plataforma líder en salud digital de Colombia. Unifica tu historial médico, reduce tiempos de urgencias 70% con IA, y optimiza la gestión clínica.',
  keywords: [
    'VitalGo',
    'salud digital Colombia',
    'historial médico unificado',
    'urgencias inteligentes',
    'IA médica',
    'QR emergencia médica',
    'expediente médico digital',
    'telemedicina Colombia',
    'gestión hospitalaria'
  ],
  authors: [{ name: 'VitalGo' }],
  creator: 'VitalGo',
  publisher: 'VitalGo',
  category: 'Healthcare Technology',
  classification: 'Medical Records Management',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: 'https://vitalgo.co',
    title: 'VitalGo - Revolución en Salud Digital Colombia',
    description: 'Reduce tiempos de emergencia 70% con IA médica avanzada. Historial médico unificado y QR de emergencia.',
    siteName: 'VitalGo',
    images: [
      {
        url: '/assets/images/logos/vitalgo-logo-official.svg',
        width: 1200,
        height: 630,
        alt: 'VitalGo - Plataforma de Salud Digital',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VitalGo - Tu Salud Unificada',
    description: 'Historial médico digital que reduce 70% los tiempos de emergencia con IA avanzada.',
    images: ['/assets/images/logos/vitalgo-logo-official.svg'],
    creator: '@VitalGoColombia',
  },
  verification: {
    google: 'verification-code-here',
    yandex: 'verification-code-here',
    yahoo: 'verification-code-here',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  themeColor: '#01EF7F',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es-CO">
      <body className="antialiased">
        {/* App Router layout - actual layouts should be in slice templates */}
        {children}
      </body>
    </html>
  )
}