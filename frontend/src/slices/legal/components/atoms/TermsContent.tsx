/**
 * Terms and Conditions content for modal display
 */
import React from 'react';

export const TermsContent: React.FC = () => {
  return (
    <div className="prose prose-sm max-w-none text-gray-700">
      <section className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">
          1. Aceptación de los Términos
        </h4>
        <p className="mb-3">
          Al acceder y utilizar VitalGo, usted acepta cumplir y estar sujeto a estos
          términos y condiciones de uso. Si no está de acuerdo con alguna parte de
          estos términos, no debe utilizar nuestro servicio.
        </p>
      </section>

      <section className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">
          2. Descripción del Servicio
        </h4>
        <p className="mb-3">
          VitalGo es una plataforma de expedientes médicos digitales que permite a
          pacientes y profesionales de la salud acceder de forma segura a información
          médica completa.
        </p>
      </section>

      <section className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">
          3. Registro de Usuario
        </h4>
        <p className="mb-3">
          Para utilizar ciertos servicios, debe registrarse y crear una cuenta.
          Usted es responsable de:
        </p>
        <ul className="list-disc pl-5 mb-3 space-y-1">
          <li>Proporcionar información precisa y actualizada</li>
          <li>Mantener la seguridad de su contraseña</li>
          <li>Notificar inmediatamente cualquier uso no autorizado</li>
          <li>Ser mayor de 18 años o contar con autorización de tutor legal</li>
        </ul>
      </section>

      <section className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">
          4. Privacidad y Protección de Datos
        </h4>
        <p className="mb-3">
          El manejo de sus datos personales y médicos se rige por nuestra Política de
          Privacidad. Al utilizar VitalGo, usted consiente el procesamiento de sus
          datos conforme a dicha política.
        </p>
      </section>

      <section className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">
          5. Uso Aceptable
        </h4>
        <p className="mb-3">
          Usted se compromete a no utilizar VitalGo para:
        </p>
        <ul className="list-disc pl-5 mb-3 space-y-1">
          <li>Actividades ilegales o no autorizadas</li>
          <li>Compartir información médica de terceros sin autorización</li>
          <li>Interferir con la operación del sistema</li>
          <li>Intentar acceder a cuentas de otros usuarios</li>
        </ul>
      </section>

      <section className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">
          6. Limitación de Responsabilidad
        </h4>
        <p className="mb-3">
          VitalGo no será responsable por daños indirectos, incidentales o
          consecuenciales que resulten del uso de la plataforma. El servicio se
          proporciona "tal como está" sin garantías de ningún tipo.
        </p>
      </section>

      <section className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">
          7. Modificaciones
        </h4>
        <p className="mb-3">
          Nos reservamos el derecho de modificar estos términos en cualquier momento.
          Los cambios serán notificados a través de la plataforma y entrarán en
          vigencia inmediatamente.
        </p>
      </section>

      <section className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">
          8. Contacto
        </h4>
        <p className="mb-3">
          Para preguntas sobre estos términos, puede contactarnos a través de los
          canales oficiales de VitalGo.
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