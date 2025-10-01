/**
 * Unauthorized Access Page
 * Shown when users try to access pages they don't have permission for
 */
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/shared/contexts/AuthContext';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white border-2 border-red-500 rounded-lg p-8 text-center shadow-lg">
          <div className="text-6xl mb-4">⛔</div>
          <h1 className="text-3xl font-bold text-red-600 mb-2">Acceso Denegado</h1>
          <p className="text-gray-700 mb-4">
            No tienes los permisos necesarios para acceder a esta página.
          </p>
          {user && (
            <p className="text-sm text-gray-600 mb-6">
              Tipo de usuario actual: <strong className="text-gray-800">{user.userType}</strong>
            </p>
          )}
          <div className="space-y-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-vitalgo-green text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
            >
              Ir al Dashboard
            </button>
            <button
              onClick={async () => {
                await logout();
                router.push('/login');
              }}
              className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              Cerrar Sesión
            </button>
            <button
              onClick={() => router.back()}
              className="w-full text-gray-600 px-6 py-2 hover:text-gray-800 transition"
            >
              ← Volver atrás
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
