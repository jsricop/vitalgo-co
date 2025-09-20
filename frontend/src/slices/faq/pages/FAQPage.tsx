'use client';

import { PublicNavbar, PublicFooter } from '@/shared/components/organisms';

export default function FAQPage() {
  const faqs = [
    {
      question: "¿Qué es VitalGo?",
      answer: "VitalGo es una plataforma digital de salud que unifica tu historial médico y reduce los tiempos de espera en urgencias hasta en un 70% mediante inteligencia artificial."
    },
    {
      question: "¿Cómo registro mi información médica?",
      answer: "Puedes registrar tu información médica completando tu perfil después del registro. Incluye datos personales, antecedentes médicos, medicamentos y alergias."
    },
    {
      question: "¿Es segura mi información médica?",
      answer: "Sí, toda tu información está protegida con encriptación de grado bancario y cumple con estándares internacionales de seguridad médica."
    },
    {
      question: "¿Cómo funciona el QR de emergencia?",
      answer: "El QR de emergencia permite que el personal médico acceda instantáneamente a tu información crítica durante una emergencia médica."
    },
    {
      question: "¿Puedo usar VitalGo en cualquier centro de salud?",
      answer: "VitalGo está conectado con más de 500 centros de salud en Colombia. Consulta la lista de centros afiliados en nuestra plataforma."
    },
    {
      question: "¿VitalGo tiene costo?",
      answer: "VitalGo es gratuito para pacientes. Nuestro modelo se basa en mejorar la eficiencia de los centros de salud."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PublicNavbar />

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Preguntas Frecuentes
            </h1>
            <p className="text-xl text-gray-600">
              Encuentra respuestas a las preguntas más comunes sobre VitalGo
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                data-testid={`faq-item-${index}`}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="bg-vitalgo-green/10 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                ¿No encontraste lo que buscabas?
              </h3>
              <p className="text-gray-600 mb-6">
                Nuestro equipo de soporte está aquí para ayudarte
              </p>
              <a
                href="/centro-de-ayuda"
                className="inline-block bg-vitalgo-green text-white px-6 py-3 rounded-lg font-medium hover:bg-vitalgo-green/90 transition-colors"
                data-testid="faq-help-center-link"
              >
                Ir al Centro de Ayuda
              </a>
            </div>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}