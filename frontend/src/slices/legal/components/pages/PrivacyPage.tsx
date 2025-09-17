/**
 * Privacy Policy Page
 * URL: /politica-de-privacidad
 */
import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Política de Privacidad
            </h1>
            <p className="text-gray-600">
              Última actualización: {new Date().toLocaleDateString('es-CO')}
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Información que Recopilamos
              </h2>
              <p className="text-gray-700 mb-4">
                En VitalGo recopilamos la siguiente información:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Información personal:</strong> Nombre, documento de identidad, fecha de nacimiento, teléfono</li>
                <li><strong>Información de contacto:</strong> Dirección de correo electrónico</li>
                <li><strong>Información médica:</strong> Datos de salud proporcionados por usted o profesionales autorizados</li>
                <li><strong>Información técnica:</strong> Dirección IP, tipo de navegador, sistema operativo</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Cómo Utilizamos su Información
              </h2>
              <p className="text-gray-700 mb-4">
                Utilizamos su información para:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Proporcionar y mantener nuestros servicios médicos digitales</li>
                <li>Permitir el acceso seguro a su expediente médico</li>
                <li>Facilitar la comunicación con profesionales de la salud</li>
                <li>Mejorar la seguridad y funcionalidad de la plataforma</li>
                <li>Cumplir con obligaciones legales y regulatorias</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Protección de Datos Médicos
              </h2>
              <p className="text-gray-700 mb-4">
                Sus datos médicos reciben protección especial:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Encriptación de extremo a extremo para toda la información médica</li>
                <li>Acceso restringido solo a profesionales autorizados</li>
                <li>Cumplimiento con normativas de protección de datos de salud</li>
                <li>Auditorías regulares de seguridad</li>
                <li>Códigos QR únicos que no exponen información personal</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Compartir Información
              </h2>
              <p className="text-gray-700 mb-4">
                No vendemos ni compartimos su información personal, excepto:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Con profesionales de la salud autorizados por usted</li>
                <li>Para cumplir con requerimientos legales</li>
                <li>En emergencias médicas donde su vida esté en riesgo</li>
                <li>Con su consentimiento explícito</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Sus Derechos
              </h2>
              <p className="text-gray-700 mb-4">
                Usted tiene derecho a:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Acceder a su información personal</li>
                <li>Corregir datos inexactos</li>
                <li>Solicitar la eliminación de sus datos</li>
                <li>Restringir el procesamiento de su información</li>
                <li>Portabilidad de sus datos médicos</li>
                <li>Retirar su consentimiento en cualquier momento</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Seguridad de la Información
              </h2>
              <p className="text-gray-700 mb-4">
                Implementamos medidas técnicas y organizativas apropiadas para proteger
                su información contra acceso no autorizado, alteración, divulgación o
                destrucción, incluyendo:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Encriptación de datos en tránsito y en reposo</li>
                <li>Autenticación multifactor</li>
                <li>Monitoreo continuo de seguridad</li>
                <li>Capacitación regular del personal en privacidad</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Retención de Datos
              </h2>
              <p className="text-gray-700 mb-4">
                Conservamos su información personal mientras mantenga una cuenta activa
                o según sea necesario para proporcionar servicios. Los datos médicos se
                conservan de acuerdo con las regulaciones de salud aplicables.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Menores de Edad
              </h2>
              <p className="text-gray-700 mb-4">
                VitalGo requiere que los usuarios sean mayores de 18 años. Para menores,
                los tutores legales deben crear y gestionar las cuentas correspondientes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Cambios en esta Política
              </h2>
              <p className="text-gray-700 mb-4">
                Podemos actualizar esta política periódicamente. Le notificaremos sobre
                cambios significativos a través de la plataforma o por correo electrónico.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Contacto
              </h2>
              <p className="text-gray-700 mb-4">
                Para preguntas sobre esta política de privacidad o para ejercer sus
                derechos, puede contactarnos a través de los canales oficiales de VitalGo.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <button
                onClick={() => window.history.back()}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Volver
              </button>

              <p className="text-sm text-gray-500">
                VitalGo - Expedientes Médicos Digitales
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}