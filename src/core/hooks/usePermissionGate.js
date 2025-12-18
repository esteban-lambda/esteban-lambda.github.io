import { useAuth } from '../../modules/Usuarios/hooks/useAuth';

/**
 * Hook personalizado para verificar permisos desde JavaScript
 * 
 * @param {Array|string} requiredPermissions - Permiso(s) requerido(s)
 * @param {boolean} requireAll - Si es true, requiere todos los permisos
 * @returns {boolean}
 * 
 * @example
 * const canEdit = usePermissionGate('academicos.editar_asignatura');
 * const canManage = usePermissionGate(['crear', 'editar', 'eliminar'], true);
 */
export const usePermissionGate = (requiredPermissions, requireAll = false) => {
  const { user, permissions } = useAuth();

  if (!user) return false;
  if (user.is_staff || user.is_superuser) return true;

  const permsArray = Array.isArray(requiredPermissions) 
    ? requiredPermissions 
    : [requiredPermissions];

  return requireAll
    ? permissions.hasAllPermissions(permsArray)
    : permissions.hasAnyPermission(permsArray);
};
