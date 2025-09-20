'use client';
/**
 * Terms and Conditions Page
 * URL: /terminos-y-condiciones
 */
import React from 'react';
import { PublicNavbar } from '@/shared/components/organisms/PublicNavbar';
import { PublicFooter } from '@/shared/components/organisms/PublicFooter';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PublicNavbar
        showBackButton={true}
        useHistoryBack={true}
      />

      <div className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Términos y Condiciones
            </h1>
            <p className="text-gray-600">
              Última actualización: {new Date().toLocaleDateString('es-CO')}
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Aceptación de los Términos
              </h2>
              <p className="text-gray-700 mb-4">
                Al acceder y utilizar VitalGo, usted acepta cumplir y estar sujeto a estos
                términos y condiciones de uso. Si no está de acuerdo con alguna parte de
                estos términos, no debe utilizar nuestro servicio.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Descripción del Servicio
              </h2>
              <p className="text-gray-700 mb-4">
                VitalGo es una plataforma de expedientes médicos digitales que permite a
                pacientes y profesionales de la salud acceder de forma segura a información
                médica completa.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Registro de Usuario
              </h2>
              <p className="text-gray-700 mb-4">
                Para utilizar ciertos servicios, debe registrarse y crear una cuenta.
                Usted es responsable de:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Proporcionar información precisa y actualizada</li>
                <li>Mantener la seguridad de su contraseña</li>
                <li>Notificar inmediatamente cualquier uso no autorizado</li>
                <li>Ser mayor de 18 años o contar con autorización de tutor legal</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Privacidad y Protección de Datos
              </h2>
              <p className="text-gray-700 mb-4">
                El manejo de sus datos personales y médicos se rige por nuestra Política de
                Privacidad. Al utilizar VitalGo, usted consiente el procesamiento de sus
                datos conforme a dicha política.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Uso Aceptable
              </h2>
              <p className="text-gray-700 mb-4">
                Usted se compromete a no utilizar VitalGo para:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Actividades ilegales o no autorizadas</li>
                <li>Compartir información médica de terceros sin autorización</li>
                <li>Interferir con la operación del sistema</li>
                <li>Intentar acceder a cuentas de otros usuarios</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Limitación de Responsabilidad
              </h2>
              <p className="text-gray-700 mb-4">
                VitalGo no será responsable por daños indirectos, incidentales o
                consecuenciales que resulten del uso de la plataforma. El servicio se
                proporciona "tal como está" sin garantías de ningún tipo.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Modificaciones
              </h2>
              <p className="text-gray-700 mb-4">
                Nos reservamos el derecho de modificar estos términos en cualquier momento.
                Los cambios serán notificados a través de la plataforma y entrarán en
                vigencia inmediatamente.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Contacto
              </h2>
              <p className="text-gray-700 mb-4">
                Para preguntas sobre estos términos, puede contactarnos a través de los
                canales oficiales de VitalGo.
              </p>
            </section>
          </div>

        </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}