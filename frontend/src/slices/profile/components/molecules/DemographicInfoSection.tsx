/**
 * DemographicInfoSection Molecule Component
 * Handles biological sex, gender, and birth location information
 */
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('profile.forms');

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
          {t('sections.demographicInfo')}
        </h4>
        <div className="space-y-4">
          <RadioButtonField
            label={t('labels.biologicalSex')}
            name="biological_sex"
            value={data.biological_sex || ''}
            onChange={(value) => onChange('biological_sex', value)}
            options={BIOLOGICAL_SEX_OPTIONS}
            required
            error={errors.biological_sex}
            layout="columns"
          />
          <RadioButtonField
            label={t('labels.gender')}
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
          {t('sections.birthLocation')}
        </h4>
        <div className="space-y-4">
          <SearchableSelect
            label={t('labels.birthCountry')}
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
                label={t('labels.birthDepartment')}
                value={data.birth_department || ''}
                onChange={handleDepartmentChange}
                options={COLOMBIA_DEPARTMENTS}
                required
                error={errors.birth_department}
              />

              {data.birth_department && (
                <SelectField
                  label={t('labels.birthCity')}
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

      {/* Voluntad de la Persona - Organ Donor Preference */}
      <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          {t('sections.donorPreference')}
        </h4>
        <div className="space-y-4">
          <RadioButtonField
            label={t('labels.organDonorPreference')}
            name="organ_donor_preference"
            value={data.organ_donor_preference || ''}
            onChange={(value) => onChange('organ_donor_preference', value)}
            options={[
              { value: 'DONANTE', label: t('options.donorYes') },
              { value: 'NO_DONANTE', label: t('options.donorNo') },
              { value: 'PREFIERO_NO_RESPONDER', label: t('options.donorPreferNotToSay') }
            ]}
            required={false}
            error={errors.organ_donor_preference}
            layout="vertical"
          />
        </div>
      </div>

      {/* Physical Measurements - Peso y Talla */}
      <div className="bg-white px-4 py-3 rounded-lg border border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          {t('sections.physicalMeasurements')}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('labels.height')}
            </label>
            <input
              type="number"
              min="50"
              max="250"
              value={data.height || ''}
              onChange={(e) => onChange('height', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vitalgo-green focus:border-transparent"
              placeholder={t('placeholders.height')}
            />
            {errors.height && (
              <p className="mt-1 text-sm text-red-600">{errors.height}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('labels.weight')}
            </label>
            <input
              type="number"
              min="10"
              max="300"
              value={data.weight || ''}
              onChange={(e) => onChange('weight', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vitalgo-green focus:border-transparent"
              placeholder={t('placeholders.weight')}
            />
            {errors.weight && (
              <p className="mt-1 text-sm text-red-600">{errors.weight}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}