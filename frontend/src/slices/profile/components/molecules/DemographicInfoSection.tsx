/**
 * DemographicInfoSection Molecule Component
 * Handles biological sex, gender, and birth location information
 */
import { SelectField } from '../atoms/SelectField';
import { BIOLOGICAL_SEX_OPTIONS, GENDER_OPTIONS } from '../../../../shared/data/demographics';
import { COUNTRIES, COLOMBIA_DEPARTMENTS, getCitiesForDepartment } from '../../../../shared/data/locations';
import { PersonalInfoFormData } from '../../types/personalInfo';

interface DemographicInfoSectionProps {
  data: PersonalInfoFormData;
  onChange: (field: keyof PersonalInfoFormData, value: string) => void;
  errors?: Record<string, string>;
}

export function DemographicInfoSection({
  data,
  onChange,
  errors = {}
}: DemographicInfoSectionProps) {
  const handleCountryChange = (country: string) => {
    onChange('birth_country', country);
    // Reset department and city when country changes
    if (country !== 'Colombia') {
      onChange('birth_department', '');
      onChange('birth_city', '');
    }
  };

  const handleDepartmentChange = (department: string) => {
    onChange('birth_department', department);
    // Reset city when department changes
    onChange('birth_city', '');
  };

  const showColombianFields = data.birth_country === 'Colombia';
  const departmentCities = data.birth_department
    ? getCitiesForDepartment(data.birth_department)
    : [];

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 px-4 py-3 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          Información Demográfica
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Sexo Biológico"
            value={data.biological_sex || ''}
            onChange={(value) => onChange('biological_sex', value)}
            options={BIOLOGICAL_SEX_OPTIONS}
            required
            error={errors.biological_sex}
          />
          <SelectField
            label="Género"
            value={data.gender || ''}
            onChange={(value) => onChange('gender', value)}
            options={GENDER_OPTIONS}
            required
            error={errors.gender}
          />
        </div>
      </div>

      <div className="bg-gray-50 px-4 py-3 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          Lugar de Nacimiento
        </h4>
        <div className="space-y-4">
          <SelectField
            label="País de Nacimiento"
            value={data.birth_country || ''}
            onChange={handleCountryChange}
            options={COUNTRIES}
            required
            error={errors.birth_country}
          />

          {showColombianFields && (
            <>
              <SelectField
                label="Departamento de Nacimiento"
                value={data.birth_department || ''}
                onChange={handleDepartmentChange}
                options={COLOMBIA_DEPARTMENTS}
                required
                error={errors.birth_department}
              />

              {data.birth_department && (
                <SelectField
                  label="Ciudad de Nacimiento"
                  value={data.birth_city || ''}
                  onChange={(value) => onChange('birth_city', value)}
                  options={departmentCities}
                  required
                  error={errors.birth_city}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}