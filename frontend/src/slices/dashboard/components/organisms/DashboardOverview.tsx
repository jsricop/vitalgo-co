/**
 * Dashboard Overview organism component
 * Main dashboard layout with stats, recent activities and quick actions
 */
import React, { useState, useEffect } from 'react';
import { DashboardStats } from '../molecules/DashboardStats';
import { MedicalDataCard } from '../atoms/MedicalDataCard';
import { MedicalDataForm } from '../molecules/MedicalDataForm';
import { DashboardData, PatientMedication, MedicalDataType, MedicalDataFormData } from '../../types';
import { dashboardAPI } from '../../services/api';

interface DashboardOverviewProps {
  'data-testid'?: string;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  'data-testid': testId
}) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQuickForm, setShowQuickForm] = useState(false);
  const [quickFormType, setQuickFormType] = useState<MedicalDataType | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('📊 Fetching dashboard data...');
        const data = await dashboardAPI.getDashboardData();
        console.log('✅ Dashboard data loaded successfully:', data);
        setDashboardData(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error loading dashboard';
        console.error('❌ Dashboard data loading failed:', errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleQuickAction = (type: MedicalDataType) => {
    setQuickFormType(type);
    setShowQuickForm(true);
  };

  const handleQuickFormSubmit = async (formData: MedicalDataFormData) => {
    if (!quickFormType) return;

    try {
      setFormLoading(true);

      let newItem;
      switch (quickFormType) {
        case 'medications':
          newItem = await dashboardAPI.createMedication(formData);
          break;
        case 'allergies':
          newItem = await dashboardAPI.createAllergy(formData);
          break;
        case 'surgeries':
          newItem = await dashboardAPI.createSurgery(formData);
          break;
        case 'illnesses':
          newItem = await dashboardAPI.createIllness(formData);
          break;
        default:
          throw new Error(`Unknown data type: ${quickFormType}`);
      }

      setShowQuickForm(false);
      setQuickFormType(null);

      // Refresh dashboard data to show the new item
      const data = await dashboardAPI.getDashboardData();
      setDashboardData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating item');
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  const handleQuickFormCancel = () => {
    setShowQuickForm(false);
    setQuickFormType(null);
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6" data-testid={testId}>
        <div className="flex items-center">
          <svg className="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.866-.833-2.464 0L4.348 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-red-800 font-medium">Error al cargar el dashboard</h3>
        </div>
        <p className="text-red-600 mt-1">{error}</p>
        <div className="mt-4 flex space-x-3">
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Recargar página
          </button>
          <button
            onClick={() => {
              setError(null);
              // Refetch data
              const fetchData = async () => {
                try {
                  setLoading(true);
                  const data = await dashboardAPI.getDashboardData();
                  setDashboardData(data);
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Error loading dashboard');
                } finally {
                  setLoading(false);
                }
              };
              fetchData();
            }}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Reintentar carga
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8" data-testid={testId}>
      {/* Welcome Header */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Dashboard Médico
        </h1>
        <p className="text-gray-600">
          Gestiona tu información médica de forma segura y accesible
        </p>
      </div>

      {/* Stats Overview */}
      {dashboardData && (
        <DashboardStats
          stats={dashboardData.stats}
          loading={loading}
          data-testid="dashboard-stats"
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Medications */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Medicamentos Recientes
            </h2>
            <button
              onClick={() => window.location.href = '/dashboard/medications'}
              className="text-vitalgo-green hover:text-vitalgo-green/80 font-medium text-sm"
            >
              Ver todos
            </button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg animate-pulse">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="h-5 w-5 bg-gray-300 rounded"></div>
                    <div className="space-y-1 flex-1">
                      <div className="h-4 bg-gray-300 rounded w-32"></div>
                      <div className="h-3 bg-gray-300 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : dashboardData?.recent_medications?.length ? (
            <div className="space-y-4">
              {dashboardData.recent_medications.map((medication) => (
                <MedicalDataCard
                  key={medication.id}
                  data={medication}
                  type="medication"
                  data-testid={`recent-medication-${medication.id}`}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <svg className="h-12 w-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <p>No hay medicamentos registrados</p>
              <button
                onClick={() => handleQuickAction('medications')}
                className="mt-3 text-vitalgo-green hover:text-vitalgo-green/80 font-medium"
              >
                Agregar medicamento
              </button>
            </div>
          )}
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Actividad Reciente
          </h2>

          {loading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="flex items-center space-x-3 animate-pulse">
                  <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-4 bg-gray-300 rounded w-48"></div>
                    <div className="h-3 bg-gray-300 rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : dashboardData?.recent_activities?.length ? (
            <div className="space-y-4">
              {dashboardData.recent_activities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-vitalgo-green/10 rounded-full flex items-center justify-center">
                      <div className="h-3 w-3 bg-vitalgo-green rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.date).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <svg className="h-12 w-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No hay actividad reciente</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Acciones Rápidas
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => handleQuickAction('medications')}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="h-8 w-8 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <span className="text-sm font-medium text-gray-900">Agregar Medicamento</span>
          </button>

          <button
            onClick={() => handleQuickAction('allergies')}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="h-8 w-8 text-yellow-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.866-.833-2.464 0L4.348 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-sm font-medium text-gray-900">Registrar Alergia</span>
          </button>

          <button
            onClick={() => handleQuickAction('surgeries')}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="h-8 w-8 text-purple-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <span className="text-sm font-medium text-gray-900">Agregar Cirugía</span>
          </button>

          <button
            onClick={() => handleQuickAction('illnesses')}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="h-8 w-8 text-red-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm font-medium text-gray-900">Registrar Enfermedad</span>
          </button>
        </div>
      </div>

      {/* Quick Action Modal Form */}
      {showQuickForm && quickFormType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Agregar {quickFormType === 'medications' ? 'Medicamento' :
                           quickFormType === 'allergies' ? 'Alergia' :
                           quickFormType === 'surgeries' ? 'Cirugía' : 'Enfermedad'}
                </h3>
                <button
                  onClick={handleQuickFormCancel}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <MedicalDataForm
                type={quickFormType}
                initialData={{}}
                onSubmit={handleQuickFormSubmit}
                onCancel={handleQuickFormCancel}
                isLoading={formLoading}
                data-testid={`quick-${quickFormType}-form`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};