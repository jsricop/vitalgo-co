/**
 * ResidenceInfoSection Molecule Component
 * Handles residence address and location information
 */
import { SelectField } from '../atoms/SelectField';
import { TextAreaField } from '../atoms/TextAreaField';
import { SearchableSelect } from '../atoms/SearchableSelect';
import { COLOMBIA_DEPARTMENTS, getCitiesForDepartment } from '../../../../shared/data/locations';
import { residenceCountries } from '../../data/countries';
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
  const handleCountryChange = (country: string) => {
    onChange('residence_country', country);
    // Reset department and city when country changes
    if (country !== 'CO') {
      onChange('residence_department', '');
      onChange('residence_city', '');
    }
    // Reset other field when not OTHER
    if (country !== 'OTHER') {
      onChange('residence_country_other', '');
    }
  };

  const handleDepartmentChange = (department: string) => {
    onChange('residence_department', department);
    // Reset city when department changes
    onChange('residence_city', '');
  };

  const departmentCities = data.residence_department
    ? getCitiesForDepartment(data.residence_department)
    : [];

  // Only show department and city fields if residence country is Colombia
  const showColombianResidenceFields = data.residence_country === 'CO';

  return (
    <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
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

        <SearchableSelect
          label="País de Residencia"
          value={data.residence_country || ''}
          onChange={handleCountryChange}
          options={residenceCountries}
          required
          error={errors.residence_country}
          hasOtherOption={true}
          otherValue={data.residence_country_other || ''}
          onOtherChange={(value) => onChange('residence_country_other', value)}
        />

        {showColombianResidenceFields && (
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
        )}
      </div>
    </div>
  );
}