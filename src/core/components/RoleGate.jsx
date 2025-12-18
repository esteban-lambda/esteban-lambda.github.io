import { useAuth } from '../../modules/Usuarios/hooks/useAuth';
import { ROLES } from '../constants/roles';

/**
 * Componente para renderizar contenido condicionalmente según el rol del usuario
 * 
 * @param {Array} allowedRoles - Array de roles permitidos (de ROLES constant)
 * @param {ReactNode} children - Contenido a renderizar si el usuario tiene el rol
 * @param {ReactNode} fallback - Contenido a renderizar si el usuario NO tiene el rol
 * 
 * @example
 * <RoleGate allowedRoles={[ROLES.ADMIN, ROLES.DOCENTE]}>
 *   <Button>Solo admins y docentes</Button>
 * </RoleGate>
 */
export const RoleGate = ({ allowedRoles, children, fallback = null }) => {
  const { role, user } = useAuth();

  if (!user || !role) {
    return fallback;
  }

  // Normalizar roles a minúsculas para comparación
  const normalizedRole = role.toLowerCase();
  const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());

  // Verificar si el rol del usuario está en la lista de roles permitidos
  const hasAccess = normalizedAllowedRoles.includes(normalizedRole);

  // También verificar si es staff/superuser (bypass para admins)
  const isStaff = user.is_staff || user.is_superuser;
  
  if (hasAccess || isStaff) {
    return children;
  }

  return fallback;
};
