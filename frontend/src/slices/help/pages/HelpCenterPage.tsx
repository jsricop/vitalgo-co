'use client';

import { PublicNavbar, PublicFooter } from '@/shared/components/organisms';
import { Mail, Phone, MessageCircle, Clock } from 'lucide-react';

export default function HelpCenterPage() {
  const supportOptions = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email de Soporte",
      description: "Envíanos tu consulta y te responderemos en 24 horas",
      contact: "soporte@vitalgo.co",
      action: "Enviar Email"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Línea de Atención",
      description: "Llámanos de lunes a viernes de 8:00 AM a 6:00 PM",
      contact: "+57 (1) 800-VITALGO",
      action: "Llamar Ahora"
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Chat en Vivo",
      description: "Próximamente disponible para soporte inmediato",
      contact: "Chat disponible próximamente",
      action: "Próximamente"
    }
  ];

  const helpCategories = [
    {
      title: "Primeros Pasos",
      items: [
        "Cómo crear mi cuenta en VitalGo",
        "Completar mi perfil médico",
        "Configurar mi QR de emergencia",
        "Verificar mi identidad"
      ]
    },
    {
      title: "Gestión de Datos",
      items: [
        "Actualizar mi información médica",
        "Añadir medicamentos y alergias",
        "Subir documentos médicos",
        "Compartir información con médicos"
      ]
    },
    {
      title: "Emergencias",
      items: [
        "Usar mi QR en emergencias",
        "Información de contacto de emergencia",
        "Acceso rápido a mi historial",
        "Protocolos de emergencia"
      ]
    },
    {
      title: "Privacidad y Seguridad",
      items: [
        "Cómo protegemos tu información",
        "Controlar quién ve mis datos",
        "Reportar problemas de seguridad",
        "Políticas de privacidad"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PublicNavbar />

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Centro de Ayuda
            </h1>
            <p className="text-xl text-gray-600">
              Estamos aquí para ayudarte a aprovechar al máximo VitalGo
            </p>
          </div>

          {/* Support Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {supportOptions.map((option, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center"
                data-testid={`help-support-option-${index}`}
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-vitalgo-green/10 rounded-full text-vitalgo-green">
                    {option.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {option.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {option.description}
                </p>
                <p className="text-sm font-medium text-gray-900 mb-4">
                  {option.contact}
                </p>
                <button
                  className="w-full bg-vitalgo-green text-white px-4 py-2 rounded-lg font-medium hover:bg-vitalgo-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={option.action === "Próximamente"}
                  data-testid={`help-support-action-${index}`}
                >
                  {option.action}
                </button>
              </div>
            ))}
          </div>

          {/* Help Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {helpCategories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                data-testid={`help-category-${index}`}
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {category.title}
                </h3>
                <ul className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-start"
                      data-testid={`help-category-${index}-item-${itemIndex}`}
                    >
                      <div className="w-2 h-2 bg-vitalgo-green rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Operating Hours */}
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Horarios de Atención
            </h3>
            <p className="text-gray-600 mb-2">
              Lunes a Viernes: 8:00 AM - 6:00 PM
            </p>
            <p className="text-gray-600 mb-4">
              Sábados: 9:00 AM - 2:00 PM
            </p>
            <p className="text-sm text-gray-500">
              Para emergencias médicas, dirígete al centro de salud más cercano
            </p>
          </div>

          {/* Quick Links */}
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Enlaces Rápidos
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/preguntas-frecuentes"
                className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                data-testid="help-faq-link"
              >
                Preguntas Frecuentes
              </a>
              <a
                href="/legal/privacy"
                className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                data-testid="help-privacy-link"
              >
                Política de Privacidad
              </a>
              <a
                href="/legal/terms"
                className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                data-testid="help-terms-link"
              >
                Términos de Servicio
              </a>
            </div>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}