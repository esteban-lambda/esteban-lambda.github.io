import { useAuth } from '../../modules/Usuarios/hooks/useAuth';

/**
 * Hook personalizado para verificar permisos
 */
export const usePermissions = () => {
  const { user } = useAuth();

  const hasRole = (roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.rol);
    }
    return user.rol === roles;
  };

  const isAdmin = hasRole('administrador');
  const isDocente = hasRole(['docente', 'administrador']);
  const isEstudiante = hasRole('estudiante');

  const can = (permission) => {
    const permissions = {
      // Gestión de usuarios
      'manage_users': isAdmin,
      'view_users': isAdmin,
      'create_users': isAdmin,
      'edit_users': isAdmin,
      'delete_users': isAdmin,
      
      // Gestión de asignaturas
      'manage_asignaturas': isAdmin || isDocente,
      'create_asignaturas': isAdmin,
      'edit_asignaturas': isAdmin || isDocente,
      'view_all_asignaturas': isAdmin || isDocente,
      
      // Gestión de tareas
      'create_tareas': isDocente,
      'edit_tareas': isDocente,
      'delete_tareas': isDocente,
      'view_all_tareas': isDocente,
      
      // Calificaciones
      'grade_submissions': isDocente,
      'view_all_grades': isDocente,
      'publish_grades': isDocente,
      
      // Reportes
      'generate_reports': isAdmin || isDocente,
      'view_analytics': isAdmin || isDocente,
      
      // Estudiantes
      'submit_tasks': isEstudiante,
      'view_own_grades': true,
      'view_own_progress': true,
    };

    return permissions[permission] || false;
  };

  return {
    user,
    hasRole,
    isAdmin,
    isDocente,
    isEstudiante,
    can,
  };
};
