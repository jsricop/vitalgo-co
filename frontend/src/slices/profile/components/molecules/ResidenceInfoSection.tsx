/**
 * ResidenceInfoSection Molecule Component
 * Handles residence address and location information
 */
import { SelectField } from '../atoms/SelectField';
import { TextAreaField } from '../atoms/TextAreaField';
import { COLOMBIA_DEPARTMENTS, getCitiesForDepartment } from '../../../../shared/data/locations';
import { PersonalInfoFormData } from '../../types/personalInfo';

interface ResidenceInfoSectionProps {
  data: PersonalInfoFormData;
  onChange: (field: keyof PersonalInfoFormData, value: string) => void;
  errors?: Record<string, string>;
}

export function ResidenceInfoSection({
  data,
  onChange,
  errors = {}
}: ResidenceInfoSectionProps) {
  const handleDepartmentChange = (department: string) => {
    onChange('residence_department', department);
    // Reset city when department changes
    onChange('residence_city', '');
  };

  const departmentCities = data.residence_department
    ? getCitiesForDepartment(data.residence_department)
    : [];

  return (
    <div className="bg-gray-50 px-4 py-3 rounded-lg">
      <h4 className="text-sm font-medium text-gray-900 mb-3">
        Información de Residencia
      </h4>
      <div className="space-y-4">
        <TextAreaField
          label="Dirección de Residencia Completa"
          value={data.residence_address || ''}
          onChange={(value) => onChange('residence_address', value)}
          placeholder="Ej: Carrera 15 # 93-47, Apto 502, Bogotá"
          required
          rows={2}
          error={errors.residence_address}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Departamento de Residencia"
            value={data.residence_department || ''}
            onChange={handleDepartmentChange}
            options={COLOMBIA_DEPARTMENTS}
            required
            error={errors.residence_department}
          />

          {data.residence_department && (
            <SelectField
              label="Ciudad de Residencia"
              value={data.residence_city || ''}
              onChange={(value) => onChange('residence_city', value)}
              options={departmentCities}
              required
              error={errors.residence_city}
            />
          )}
        </div>
      </div>
    </div>
  );
}