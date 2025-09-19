import { Badge } from '../atoms/Badge'
import { TestimonialCard } from '../molecules/TestimonialCard'

const testimonials = [
  {
    name: "Dr. María González",
    role: "Médica Internista - Hospital San Ignacio",
    content: "VitalGo cambió mi forma de atender urgencias. Ahora tengo la información del paciente al instante, sin esperas ni papeles.",
    rating: 5
  },
  {
    name: "Carlos Rodríguez",
    role: "Paciente Diabético",
    content: "Llevaba años cargando carpetas con mis exámenes. Ahora todo está en mi teléfono y mi familia puede acceder si me pasa algo.",
    rating: 5
  },
  {
    name: "Ana Patricia Silva",
    role: "Paramédica - Cruz Roja Colombia",
    content: "En emergencias cada segundo cuenta. Con VitalGo veo las alergias y condiciones del paciente antes de llegar al hospital.",
    rating: 5
  }
]

export function TestimonialsSection() {
  return (
    <section
      className="py-16 lg:py-24 bg-gray-50/50"
      data-testid="home-testimonials-section"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge
            className="mb-4 bg-vitalgo-green/10 text-vitalgo-green"
            data-testid="home-testimonials-badge"
          >
            Testimonios
          </Badge>
          <h2
            className="text-3xl lg:text-4xl font-light text-gray-900 mb-4"
            data-testid="home-testimonials-title"
          >
            Historias reales de personas como tú
          </h2>
          <p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            data-testid="home-testimonials-description"
          >
            Descubre cómo VitalGo está mejorando la vida de pacientes y profesionales de la salud en Colombia
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}