import { Navigate } from 'react-router-dom';
import { useAuth } from '../../modules/Usuarios';
import LoadingSpinner from './LoadingSpinner';

/**
 * Componente para proteger rutas que requieren autenticación
 */
export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, role, isAdmin } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  // Si no está autenticado, redirigir al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si hay roles permitidos específicos, verificar que el usuario tenga uno de ellos
  if (allowedRoles.length > 0) {
    // Los admins tienen acceso a todo
    if (isAdmin) {
      return children;
    }

    // Verificar si el rol del usuario está en los roles permitidos
    const hasPermission = allowedRoles.some(
      allowedRole => role?.toLowerCase() === allowedRole.toLowerCase()
    );

    if (!hasPermission) {
      // Redirigir al dashboard si no tiene permiso
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

/**
 * Componente para rutas que solo pueden acceder ciertos roles
 */
export const RoleBasedRoute = ({ children, allowedRoles = [], redirectTo = '/dashboard' }) => {
  const { user, loading, role, isAdmin } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Los admins tienen acceso a todo
  if (isAdmin) {
    return children;
  }

  // Verificar si el rol del usuario está permitido
  const hasPermission = allowedRoles.some(
    allowedRole => role?.toLowerCase() === allowedRole.toLowerCase()
  );

  if (!hasPermission) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

/**
 * Componente para mostrar contenido condicionalmente según el rol
 */
export const RoleGate = ({ allowedRoles = [], fallback = null, children }) => {
  const { role, isAdmin } = useAuth();

  // Los admins ven todo
  if (isAdmin) {
    return children;
  }

  const hasPermission = allowedRoles.some(
    allowedRole => role?.toLowerCase() === allowedRole.toLowerCase()
  );

  return hasPermission ? children : fallback;
};
