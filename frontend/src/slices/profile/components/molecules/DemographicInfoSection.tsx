/**
 * DemographicInfoSection Molecule Component
 * Handles biological sex, gender, and birth location information
 */
import { SelectField } from '../atoms/SelectField';
import { RadioButtonField } from '../atoms/RadioButtonField';
import { SearchableSelect } from '../atoms/SearchableSelect';
import { BIOLOGICAL_SEX_OPTIONS, GENDER_OPTIONS } from '../../../../shared/data/demographics';
import { COLOMBIA_DEPARTMENTS, getCitiesForDepartment } from '../../../../shared/data/locations';
import { birthplaceCountries } from '../../data/countries';
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
    if (country !== 'CO') {
      onChange('birth_department', '');
      onChange('birth_city', '');
    }
    // Reset other field when not OTHER
    if (country !== 'OTHER') {
      onChange('birth_country_other', '');
    }
  };

  const handleGenderChange = (gender: string) => {
    onChange('gender', gender);
    // Reset other field when not OTRO
    if (gender !== 'OTRO') {
      onChange('gender_other', '');
    }
  };

  const handleDepartmentChange = (department: string) => {
    onChange('birth_department', department);
    // Reset city when department changes
    onChange('birth_city', '');
  };

  const showColombianFields = data.birth_country === 'CO';
  const departmentCities = data.birth_department
    ? getCitiesForDepartment(data.birth_department)
    : [];

  return (
    <div className="space-y-6">
      <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          Información Demográfica
        </h4>
        <div className="space-y-4">
          <RadioButtonField
            label="Sexo Biológico"
            name="biological_sex"
            value={data.biological_sex || ''}
            onChange={(value) => onChange('biological_sex', value)}
            options={BIOLOGICAL_SEX_OPTIONS}
            required
            error={errors.biological_sex}
            layout="columns"
          />
          <RadioButtonField
            label="Género"
            name="gender"
            value={data.gender || ''}
            onChange={handleGenderChange}
            options={GENDER_OPTIONS}
            required
            error={errors.gender}
            otherOption={true}
            otherValue={data.gender_other || ''}
            onOtherChange={(value) => onChange('gender_other', value)}
            layout="columns"
          />
        </div>
      </div>

      <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          Lugar de Nacimiento
        </h4>
        <div className="space-y-4">
          <SearchableSelect
            label="País de Nacimiento"
            value={data.birth_country || ''}
            onChange={handleCountryChange}
            options={birthplaceCountries}
            required
            error={errors.birth_country}
            hasOtherOption={true}
            otherValue={data.birth_country_other || ''}
            onOtherChange={(value) => onChange('birth_country_other', value)}
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