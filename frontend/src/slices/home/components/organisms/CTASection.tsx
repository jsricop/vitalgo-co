import { ArrowRight, Stethoscope } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../atoms/Button'

export function CTASection() {
  return (
    <section
      className="py-16 lg:py-24 bg-gradient-to-r from-green-500 to-green-600"
      data-testid="home-cta-section"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2
            className="text-3xl lg:text-4xl font-light text-white mb-6"
            data-testid="home-cta-title"
          >
            Tu salud merece estar en buenas manos
          </h2>
          <p
            className="text-xl text-white/90 mb-8"
            data-testid="home-cta-description"
          >
            Únete a miles de personas que ya tienen su expediente médico digital seguro y siempre accesible.
            Registro rápido con verificación de identidad médica.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup/paciente">
              <Button
                size="lg"
                className="bg-white text-green-500 hover:bg-gray-100 px-8 py-4 text-lg"
                data-testid="home-cta-patient-button"
              >
                Registrarse como Paciente
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/signup/paramedico">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white border-2 border-white px-8 py-4 text-lg"
                data-testid="home-cta-professional-button"
              >
                Registrarse como Profesional
                <Stethoscope className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <p
            className="text-sm text-white/80 mt-6"
            data-testid="home-cta-note"
          >
            Protección de datos médicos • Verificación de identidad • Acceso autorizado únicamente
          </p>
        </div>
      </div>
    </section>
  )
}