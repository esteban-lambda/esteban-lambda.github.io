import { useAuth } from '../../modules/Usuarios/hooks/useAuth';

/**
 * Hook personalizado para verificar roles desde JavaScript
 * 
 * @param {Array} allowedRoles - Array de roles permitidos
 * @returns {boolean} - True si el usuario tiene uno de los roles permitidos
 * 
 * @example
 * const canAccess = useRoleGate([ROLES.ADMIN, ROLES.DOCENTE]);
 */
export const useRoleGate = (allowedRoles) => {
  const { role, user } = useAuth();

  if (!user || !role) {
    return false;
  }

  const normalizedRole = role.toLowerCase();
  const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());
  
  const hasAccess = normalizedAllowedRoles.includes(normalizedRole);
  const isStaff = user.is_staff || user.is_superuser;

  return hasAccess || isStaff;
};
