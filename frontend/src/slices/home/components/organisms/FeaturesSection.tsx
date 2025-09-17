import { FileText, QrCode, Clock, Shield, Stethoscope, Smartphone } from 'lucide-react'
import { Badge } from '../atoms/Badge'
import { FeatureCard } from '../molecules/FeatureCard'

const features = [
  {
    icon: <FileText className="h-6 w-6 text-green-500" />,
    title: "Tu Historial Siempre Contigo",
    description: "Toda tu información médica organizada en un solo lugar. Consulta tus datos desde cualquier dispositivo cuando los necesites.",
    badge: "Popular"
  },
  {
    icon: <QrCode className="h-6 w-6 text-green-500" />,
    title: "QR para Emergencias",
    description: "Un código QR que puede salvarte la vida. Los paramédicos acceden al instante a tus alergias y condiciones médicas críticas.",
    badge: "Vital"
  },
  {
    icon: <Clock className="h-6 w-6 text-green-500" />,
    title: "Consultas Más Rápidas",
    description: "El médico ya tiene tu historial antes de verte. Consultas más eficientes que te ahorran hasta 70% del tiempo de espera."
  },
  {
    icon: <Shield className="h-6 w-6 text-green-500" />,
    title: "Máxima Seguridad",
    description: "Tus datos médicos protegidos con los más altos estándares de seguridad. Solo tú decides quién puede verlos."
  },
  {
    icon: <Stethoscope className="h-6 w-6 text-green-500" />,
    title: "Ideal para Profesionales",
    description: "Si eres médico o paramédico, accede rápidamente a la información de tus pacientes para brindar mejor atención."
  },
  {
    icon: <Smartphone className="h-6 w-6 text-green-500" />,
    title: "Acceso Multiplataforma",
    description: "Disponible desde computadores, tablets y móviles. Tu expediente médico seguro desde cualquier dispositivo autorizado."
  }
]

export function FeaturesSection() {
  return (
    <section
      className="py-16 lg:py-24 bg-gray-50/50"
      data-testid="home-features-section"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge
            className="mb-4 bg-green-500/10 text-green-500"
            data-testid="home-features-badge"
          >
            Funcionalidades
          </Badge>
          <h2
            className="text-3xl lg:text-4xl font-light text-gray-900 mb-4"
            data-testid="home-features-title"
          >
            Todo lo que necesitas para cuidar tu salud
          </h2>
          <p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            data-testid="home-features-description"
          >
            Herramientas simples y poderosas para que tengas el control total de tu información médica
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}