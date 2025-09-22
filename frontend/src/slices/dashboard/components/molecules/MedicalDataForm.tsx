/**
 * Medical Data Form molecule component
 * Generic form for creating/editing medical data (medications, allergies, surgeries, illnesses)
 */
import React, { useState, useEffect } from 'react';
import { MedicalDataFormData, MedicalDataType } from '../../types';

interface MedicalDataFormProps {
  type: MedicalDataType;
  initialData?: MedicalDataFormData;
  onSubmit: (data: MedicalDataFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  'data-testid'?: string;
}

export const MedicalDataForm: React.FC<MedicalDataFormProps> = ({
  type,
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
  'data-testid': testId
}) => {
  const [formData, setFormData] = useState<MedicalDataFormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleInputChange = (field: keyof MedicalDataFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    switch (type) {
      case 'medications':
        if (!formData.medication_name?.trim()) {
          newErrors.medication_name = 'El nombre del medicamento es requerido';
        }
        if (!formData.dosage?.trim()) {
          newErrors.dosage = 'La dosis es requerida';
        }
        if (!formData.frequency?.trim()) {
          newErrors.frequency = 'La frecuencia es requerida';
        }
        if (!formData.start_date) {
          newErrors.start_date = 'La fecha de inicio es requerida';
        }
        break;

      case 'allergies':
        if (!formData.allergy_name?.trim()) {
          newErrors.allergy_name = 'El nombre de la alergia es requerido';
        }
        if (!formData.severity) {
          newErrors.severity = 'La severidad es requerida';
        }
        break;

      case 'surgeries':
        if (!formData.surgery_name?.trim()) {
          newErrors.surgery_name = 'El nombre de la cirugía es requerido';
        }
        if (!formData.surgery_date) {
          newErrors.surgery_date = 'La fecha de la cirugía es requerida';
        }
        break;

      case 'illnesses':
        if (!formData.illness_name?.trim()) {
          newErrors.illness_name = 'El nombre de la enfermedad es requerido';
        }
        if (!formData.diagnosis_date) {
          newErrors.diagnosis_date = 'La fecha de diagnóstico es requerida';
        }
        if (!formData.status) {
          newErrors.status = 'El estado es requerido';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const renderMedicationFields = () => (
    <>
      <div>
        <label htmlFor="medication_name" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del Medicamento <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="medication_name"
          value={formData.medication_name || ''}
          onChange={(e) => handleInputChange('medication_name', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.medication_name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="Ej: Paracetamol"
        />
        {errors.medication_name && (
          <p className="mt-1 text-sm text-red-600">{errors.medication_name}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-1">
            Dosis <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="dosage"
            value={formData.dosage || ''}
            onChange={(e) => handleInputChange('dosage', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.dosage ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Ej: 500mg"
          />
          {errors.dosage && (
            <p className="mt-1 text-sm text-red-600">{errors.dosage}</p>
          )}
        </div>

        <div>
          <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
            Frecuencia <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="frequency"
            value={formData.frequency || ''}
            onChange={(e) => handleInputChange('frequency', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.frequency ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Ej: Cada 8 horas"
          />
          {errors.frequency && (
            <p className="mt-1 text-sm text-red-600">{errors.frequency}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Inicio <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="start_date"
            value={formData.start_date || ''}
            onChange={(e) => handleInputChange('start_date', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.start_date ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.start_date && (
            <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
          )}
        </div>

        <div>
          <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Fin
          </label>
          <input
            type="date"
            id="end_date"
            value={formData.end_date || ''}
            onChange={(e) => handleInputChange('end_date', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="prescribing_doctor" className="block text-sm font-medium text-gray-700 mb-1">
          Doctor que Prescribe
        </label>
        <input
          type="text"
          id="prescribing_doctor"
          value={formData.prescribing_doctor || ''}
          onChange={(e) => handleInputChange('prescribing_doctor', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ej: Dr. Juan Pérez"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_active"
          checked={formData.is_active ?? true}
          onChange={(e) => handleInputChange('is_active', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
          Medicamento activo
        </label>
      </div>
    </>
  );

  const renderAllergyFields = () => (
    <>
      <div>
        <label htmlFor="allergy_name" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de la Alergia <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="allergy_name"
          value={formData.allergy_name || ''}
          onChange={(e) => handleInputChange('allergy_name', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.allergy_name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="Ej: Penicilina"
        />
        {errors.allergy_name && (
          <p className="mt-1 text-sm text-red-600">{errors.allergy_name}</p>
        )}
      </div>

      <div>
        <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
          Severidad <span className="text-red-500">*</span>
        </label>
        <select
          id="severity"
          value={formData.severity || ''}
          onChange={(e) => handleInputChange('severity', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.severity ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          }`}
        >
          <option value="">Seleccionar severidad</option>
          <option value="mild">Leve</option>
          <option value="moderate">Moderada</option>
          <option value="severe">Severa</option>
        </select>
        {errors.severity && (
          <p className="mt-1 text-sm text-red-600">{errors.severity}</p>
        )}
      </div>

      <div>
        <label htmlFor="reaction" className="block text-sm font-medium text-gray-700 mb-1">
          Reacción
        </label>
        <textarea
          id="reaction"
          value={formData.reaction || ''}
          onChange={(e) => handleInputChange('reaction', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe la reacción alérgica..."
        />
      </div>
    </>
  );

  const renderSurgeryFields = () => (
    <>
      <div>
        <label htmlFor="surgery_name" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de la Cirugía <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="surgery_name"
          value={formData.surgery_name || ''}
          onChange={(e) => handleInputChange('surgery_name', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.surgery_name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="Ej: Apendicectomía"
        />
        {errors.surgery_name && (
          <p className="mt-1 text-sm text-red-600">{errors.surgery_name}</p>
        )}
      </div>

      <div>
        <label htmlFor="surgery_date" className="block text-sm font-medium text-gray-700 mb-1">
          Fecha de la Cirugía <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          id="surgery_date"
          value={formData.surgery_date || ''}
          onChange={(e) => handleInputChange('surgery_date', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.surgery_date ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          }`}
        />
        {errors.surgery_date && (
          <p className="mt-1 text-sm text-red-600">{errors.surgery_date}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="hospital" className="block text-sm font-medium text-gray-700 mb-1">
            Hospital
          </label>
          <input
            type="text"
            id="hospital"
            value={formData.hospital || ''}
            onChange={(e) => handleInputChange('hospital', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Hospital Nacional"
          />
        </div>

        <div>
          <label htmlFor="surgeon" className="block text-sm font-medium text-gray-700 mb-1">
            Cirujano
          </label>
          <input
            type="text"
            id="surgeon"
            value={formData.surgeon || ''}
            onChange={(e) => handleInputChange('surgeon', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Dr. María González"
          />
        </div>
      </div>
    </>
  );

  const renderIllnessFields = () => (
    <>
      <div>
        <label htmlFor="illness_name" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de la Enfermedad <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="illness_name"
          value={formData.illness_name || ''}
          onChange={(e) => handleInputChange('illness_name', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.illness_name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="Ej: Diabetes Tipo 2"
        />
        {errors.illness_name && (
          <p className="mt-1 text-sm text-red-600">{errors.illness_name}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="diagnosis_date" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Diagnóstico <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="diagnosis_date"
            value={formData.diagnosis_date || ''}
            onChange={(e) => handleInputChange('diagnosis_date', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.diagnosis_date ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.diagnosis_date && (
            <p className="mt-1 text-sm text-red-600">{errors.diagnosis_date}</p>
          )}
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Estado <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            value={formData.status || ''}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.status ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
            }`}
          >
            <option value="">Seleccionar estado</option>
            <option value="active">Activa</option>
            <option value="resolved">Resuelta</option>
            <option value="managed">Controlada</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status}</p>
          )}
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_chronic"
          checked={formData.is_chronic ?? false}
          onChange={(e) => handleInputChange('is_chronic', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="is_chronic" className="ml-2 block text-sm text-gray-700">
          Enfermedad crónica
        </label>
      </div>
    </>
  );

  const getTitle = () => {
    const titles = {
      medications: 'Medicamento',
      allergies: 'Alergia',
      surgeries: 'Cirugía',
      illnesses: 'Enfermedad'
    };
    return titles[type];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" data-testid={testId}>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          {initialData && Object.keys(initialData).length > 1 ? 'Editar' : 'Agregar'} {getTitle()}
        </h3>

        <div className="space-y-4">
          {type === 'medications' && renderMedicationFields()}
          {type === 'allergies' && renderAllergyFields()}
          {type === 'surgeries' && renderSurgeryFields()}
          {type === 'illnesses' && renderIllnessFields()}

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notas Adicionales
            </label>
            <textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Información adicional..."
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-vitalgo-green rounded-lg hover:bg-vitalgo-green/90 focus:outline-none focus:ring-2 focus:ring-vitalgo-green disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Guardando...
              </div>
            ) : (
              'Guardar'
            )}
          </button>
        </div>
      </div>
    </form>
  );
};