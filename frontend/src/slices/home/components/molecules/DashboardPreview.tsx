import React from 'react'
import { QrCode } from 'lucide-react'
import { Badge } from '../atoms/Badge'

export function DashboardPreview() {
  return (
    <div
      className="relative bg-gradient-to-br from-vitalgo-green/5 to-blue-50/30 rounded-xl p-6 shadow-xl border-0"
      data-testid="home-dashboard-preview"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="/assets/images/logos/vitalgo-icon-official.png"
              alt="VitalGo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="font-bold text-vitalgo-dark">Dashboard Médico</span>
          </div>
          <Badge variant="success" className="bg-vitalgo-green text-white">
            En vivo
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-vitalgo-green" data-testid="home-dashboard-active-patients">
              1,247
            </div>
            <div className="text-sm text-gray-600">Pacientes Activos</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-vitalgo-green" data-testid="home-dashboard-satisfaction">
              98.7%
            </div>
            <div className="text-sm text-gray-600">Satisfacción</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <QrCode className="h-5 w-5 text-vitalgo-green" />
            <span className="font-medium">Últimos Escaneos QR</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Emergencia - Hospital Central</span>
              <span className="text-vitalgo-green font-medium">Activo</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Consulta - Clínica Norte</span>
              <span className="text-gray-500">2 min ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}