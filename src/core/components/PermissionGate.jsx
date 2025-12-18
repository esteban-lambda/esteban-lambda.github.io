import { useAuth } from '../../modules/Usuarios/hooks/useAuth';

/**
 * Componente para renderizar contenido condicionalmente según los permisos del usuario
 * 
 * @param {Array|string} requiredPermissions - Permiso(s) requerido(s)
 * @param {boolean} requireAll - Si es true, requiere todos los permisos. Si es false, requiere al menos uno
 * @param {ReactNode} children - Contenido a renderizar si el usuario tiene permiso(s)
 * @param {ReactNode} fallback - Contenido a renderizar si el usuario NO tiene permiso(s)
 * 
 * @example
 * // Requiere un solo permiso
 * <PermissionGate requiredPermissions="academicos.crear_asignatura">
 *   <Button>Crear Asignatura</Button>
 * </PermissionGate>
 * 
 * @example
 * // Requiere cualquiera de múltiples permisos
 * <PermissionGate requiredPermissions={['academicos.editar_tarea', 'academicos.eliminar_tarea']}>
 *   <Button>Gestionar Tareas</Button>
 * </PermissionGate>
 * 
 * @example
 * // Requiere TODOS los permisos
 * <PermissionGate 
 *   requiredPermissions={['academicos.crear_asignatura', 'academicos.asignar_docente']} 
 *   requireAll={true}
 * >
 *   <Button>Gestión Completa</Button>
 * </PermissionGate>
 */
export const PermissionGate = ({ 
  requiredPermissions, 
  requireAll = false, 
  children, 
  fallback = null 
}) => {
  const { user, permissions } = useAuth();

  if (!user) {
    return fallback;
  }

  // Staff y superuser siempre tienen acceso
  if (user.is_staff || user.is_superuser) {
    return children;
  }

  // Convertir a array si es string
  const permsArray = Array.isArray(requiredPermissions) 
    ? requiredPermissions 
    : [requiredPermissions];

  // Verificar permisos
  const hasAccess = requireAll
    ? permissions.hasAllPermissions(permsArray)
    : permissions.hasAnyPermission(permsArray);

  if (hasAccess) {
    return children;
  }

  return fallback;
};
