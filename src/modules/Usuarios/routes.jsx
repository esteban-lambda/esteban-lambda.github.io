import { Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ProtectedRoute, RoleBasedRoute, LoadingSpinner, ROLES } from '../../core';

// Lazy loading de páginas
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })));
const ChangePasswordPage = lazy(() => import('./pages/ChangePasswordPage').then(m => ({ default: m.ChangePasswordPage })));
const UsersManagementPage = lazy(() => import('./pages/UsersManagementPage').then(m => ({ default: m.UsersManagementPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const RolesPermissionsPage = lazy(() => import('./pages/RolesPermissionsPage').then(m => ({ default: m.RolesPermissionsPage })));

const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
);

export const UsuariosRoutes = () => {
  return (
    <>
      {/* Rutas públicas */}
      <Route path="/login" element={<SuspenseWrapper><LoginPage /></SuspenseWrapper>} />
      <Route path="/forgot-password" element={<SuspenseWrapper><ForgotPasswordPage /></SuspenseWrapper>} />
      <Route path="/reset-password" element={<SuspenseWrapper><ResetPasswordPage /></SuspenseWrapper>} />
      
      {/* Rutas protegidas - Solo Administradores */}
      <Route
        path="/usuarios"
        element={
          <ProtectedRoute>
            <SuspenseWrapper><UsersManagementPage /></SuspenseWrapper>
          </ProtectedRoute>
        }
      />
      
      {/* Gestión de Permisos y Roles - Solo Administradores con permiso específico */}
      <Route
        path="/usuarios/permisos"
        element={
          <ProtectedRoute>
            <SuspenseWrapper><RolesPermissionsPage /></SuspenseWrapper>
          </ProtectedRoute>
        }
      />
      
      {/* Rutas protegidas - Todos los usuarios autenticados */}
      <Route
        path="/perfil"
        element={
          <ProtectedRoute>
            <SuspenseWrapper><ProfilePage /></SuspenseWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <SuspenseWrapper><ChangePasswordPage /></SuspenseWrapper>
          </ProtectedRoute>
        }
      />
    </>
  );
};
