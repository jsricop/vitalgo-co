/**
 * TabNavigation Molecule Component
 * Navigation bar with tab buttons for profile sections
 */
import { TabButton } from '../atoms/TabButton';
import { ProfileTab, TabConfig, TabNavigationProps } from '../../types';

const TAB_CONFIGS: TabConfig[] = [
  { id: 'basic', label: 'Información básica', testId: 'profile-tab-basic' },
  { id: 'personal', label: 'Información personal', testId: 'profile-tab-personal' },
  { id: 'medical', label: 'Información médica', testId: 'profile-tab-medical' },
  { id: 'gynecological', label: 'Información ginecológica', testId: 'profile-tab-gynecological' },
];

export function TabNavigation({ activeTab, onTabChange, 'data-testid': testId }: TabNavigationProps) {
  return (
    <div
      className="bg-white rounded-t-xl border-x border-t border-gray-200"
      data-testid={testId}
    >
      <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200">
        {TAB_CONFIGS.map((tab) => (
          <TabButton
            key={tab.id}
            label={tab.label}
            isActive={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
            data-testid={tab.testId}
          />
        ))}
      </div>
    </div>
  );
}