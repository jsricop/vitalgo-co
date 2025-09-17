/**
 * Privacy Policy content for modal display
 */
import React from 'react';

export const PrivacyContent: React.FC = () => {
  return (
    <div className="prose prose-sm max-w-none text-gray-700">
      <section className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">
          1. Información que Recopilamos
        </h4>
        <p className="mb-3">
          En VitalGo recopilamos la siguiente información:
        </p>
        <ul className="list-disc pl-5 mb-3 space-y-1">
          <li><strong>Información personal:</strong> Nombre, documento de identidad, fecha de nacimiento, teléfono</li>
          <li><strong>Información de contacto:</strong> Dirección de correo electrónico</li>
          <li><strong>Información médica:</strong> Datos de salud proporcionados por usted o profesionales autorizados</li>
          <li><strong>Información técnica:</strong> Dirección IP, tipo de navegador, sistema operativo</li>
        </ul>
      </section>

      <section className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">
          2. Cómo Utilizamos su Información
        </h4>
        <p className="mb-3">
          Utilizamos su información para:
        </p>
        <ul className="list-disc pl-5 mb-3 space-y-1">
          <li>Proporcionar y mantener nuestros servicios médicos digitales</li>
          <li>Permitir el acceso seguro a su expediente médico</li>
          <li>Facilitar la comunicación con profesionales de la salud</li>
          <li>Mejorar la seguridad y funcionalidad de la plataforma</li>
          <li>Cumplir con obligaciones legales y regulatorias</li>
        </ul>
      </section>

      <section className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">
          3. Protección de Datos Médicos
        </h4>
        <p className="mb-3">
          Sus datos médicos reciben protección especial:
        </p>
        <ul className="list-disc pl-5 mb-3 space-y-1">
          <li>Encriptación de extremo a extremo para toda la información médica</li>
          <li>Acceso restringido solo a profesionales autorizados</li>
          <li>Cumplimiento con normativas de protección de datos de salud</li>
          <li>Auditorías regulares de seguridad</li>
          <li>Códigos QR únicos que no exponen información personal</li>
        </ul>
      </section>

      <section className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">
          4. Compartir Información
        </h4>
        <p className="mb-3">
          No vendemos ni compartimos su información personal, excepto:
        </p>
        <ul className="list-disc pl-5 mb-3 space-y-1">
          <li>Con profesionales de la salud autorizados por usted</li>
          <li>Para cumplir con requerimientos legales</li>
          <li>En emergencias médicas donde su vida esté en riesgo</li>
          <li>Con su consentimiento explícito</li>
        </ul>
      </section>

      <section className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">
          5. Sus Derechos
        </h4>
        <p className="mb-3">
          Usted tiene derecho a:
        </p>
        <ul className="list-disc pl-5 mb-3 space-y-1">
          <li>Acceder a su información personal</li>
          <li>Corregir datos inexactos</li>
          <li>Solicitar la eliminación de sus datos</li>
          <li>Restringir el procesamiento de su información</li>
          <li>Portabilidad de sus datos médicos</li>
          <li>Retirar su consentimiento en cualquier momento</li>
        </ul>
      </section>

      <section className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">
          6. Seguridad de la Información
        </h4>
        <p className="mb-3">
          Implementamos medidas técnicas y organizativas apropiadas para proteger
          su información contra acceso no autorizado, alteración, divulgación o
          destrucción, incluyendo:
        </p>
        <ul className="list-disc pl-5 mb-3 space-y-1">
          <li>Encriptación de datos en tránsito y en reposo</li>
          <li>Autenticación multifactor</li>
          <li>Monitoreo continuo de seguridad</li>
          <li>Capacitación regular del personal en privacidad</li>
        </ul>
      </section>

      <section className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">
          7. Retención de Datos
        </h4>
        <p className="mb-3">
          Conservamos su información personal mientras mantenga una cuenta activa
          o según sea necesario para proporcionar servicios. Los datos médicos se
          conservan de acuerdo con las regulaciones de salud aplicables.
        </p>
      </section>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Última actualización: {new Date().toLocaleDateString('es-CO')}
        </p>
      </div>
    </div>
  );
};