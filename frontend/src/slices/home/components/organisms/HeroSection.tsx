import { ArrowRight, Globe, Stethoscope } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../atoms/Button'
import { Badge } from '../atoms/Badge'
import { StatCard } from '../molecules/StatCard'

const stats = [
  { number: "10K+", label: "Pacientes Confían en Nosotros", icon: <ArrowRight className="h-5 w-5 text-green-500" /> },
  { number: "500+", label: "Centros de Salud Conectados", icon: <Stethoscope className="h-5 w-5 text-green-500" /> },
  { number: "70%", label: "Menos Tiempo de Espera", icon: <Globe className="h-5 w-5 text-green-500" /> },
  { number: "24/7", label: "Siempre Disponible", icon: <ArrowRight className="h-5 w-5 text-green-500" /> }
]

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-white via-green-500/5 to-white py-16 lg:py-24"
      data-testid="home-hero-section"
    >
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo principal */}
          <div className="flex justify-center mb-8">
            <img
              src="/assets/images/logos/logoh-blue-light-background.png"
              alt="VitalGo Logo"
              className="h-16 w-auto"
              data-testid="home-hero-logo"
            />
          </div>

          <Badge
            className="mb-6 bg-green-500/10 text-green-500 hover:bg-green-500/20"
            data-testid="home-hero-badge"
          >
            <Globe className="w-3 h-3 mr-1" />
            Líder en Salud Digital Colombia
          </Badge>

          <h2
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight text-gray-900 mb-6"
            data-testid="home-hero-title"
          >
            Tu salud.
            <br />
            <span className="text-green-500 font-normal">Simplificada.</span>
          </h2>

          <p
            className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8"
            data-testid="home-hero-description"
          >
            Tu expediente médico digital completo y seguro. Acceso inmediato a tu historial clínico,
            exámenes, diagnósticos y tratamientos desde cualquier centro de salud autorizado.
            Consultas más rápidas que te ahorran hasta <strong className="text-green-500">70%</strong> del tiempo de espera.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/signup/paciente">
              <Button
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg"
                data-testid="home-hero-patient-button"
              >
                Soy Paciente
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/signup/paramedico">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
                data-testid="home-hero-professional-button"
              >
                Soy Profesional de Salud
                <Stethoscope className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="flex justify-center mb-12">
            <Link href="/login">
              <Button
                variant="outline"
                size="lg"
                className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 px-8 py-4 text-lg"
                data-testid="home-hero-login-button"
              >
                Ya tengo cuenta - Iniciar sesión
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}