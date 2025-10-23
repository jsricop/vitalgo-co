/**
 * TabNavigation Molecule Component
 * Navigation bar with tab buttons for profile sections
 */
import { useTranslations } from 'next-intl';
import { TabButton } from '../atoms/TabButton';
import { ProfileTab, TabConfig, TabNavigationProps } from '../../types';

export function TabNavigation({ activeTab, onTabChange, biologicalSex, 'data-testid': testId }: TabNavigationProps) {
  const t = useTranslations('profile.tabs');

  const TAB_CONFIGS: TabConfig[] = [
    { id: 'basic', label: t('basic'), testId: 'profile-tab-basic' },
    { id: 'personal', label: t('personal'), testId: 'profile-tab-personal' },
    { id: 'medical', label: t('medical'), testId: 'profile-tab-medical' },
    { id: 'gynecological', label: t('gynecological'), testId: 'profile-tab-gynecological' },
  ];
  // Filter out gynecological tab for non-female patients
  const availableTabs = TAB_CONFIGS.filter(tab =>
    tab.id !== 'gynecological' || biologicalSex === 'F'
  );
  return (
    <div
      className="bg-white rounded-t-xl border-x border-t border-gray-200"
      data-testid={testId}
    >
      <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200">
        {availableTabs.map((tab) => (
          <TabButton
            key={tab.id}
            label={tab.label}
            isActive={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
            variant={tab.id === 'gynecological' ? 'purple' : 'green'}
            data-testid={tab.testId}
          />
        ))}
      </div>
    </div>
  );
}