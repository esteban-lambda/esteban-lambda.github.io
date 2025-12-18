/**
 * Constantes de roles del sistema
 * Fuente única de verdad para roles en toda la aplicación
 */
export const ROLES = {
  ADMINISTRADOR: 'administrador',
  ADMIN: 'admin',
  DOCENTE: 'docente',
  PROFESOR: 'profesor',
  ESTUDIANTE: 'estudiante',
  SUPERUSER: 'superuser'
};

/**
 * Permisos del sistema organizados por categoría
 */
export const PERMISSIONS = {
  // Gestión de usuarios
  MANAGE_USERS: 'manage_users',
  VIEW_USERS: 'view_users',
  CREATE_USERS: 'create_users',
  EDIT_USERS: 'edit_users',
  DELETE_USERS: 'delete_users',
  
  // Gestión de asignaturas
  MANAGE_ASIGNATURAS: 'manage_asignaturas',
  CREATE_ASIGNATURAS: 'create_asignaturas',
  EDIT_ASIGNATURAS: 'edit_asignaturas',
  VIEW_ALL_ASIGNATURAS: 'view_all_asignaturas',
  
  // Gestión de tareas
  CREATE_TAREAS: 'create_tareas',
  EDIT_TAREAS: 'edit_tareas',
  DELETE_TAREAS: 'delete_tareas',
  VIEW_ALL_TAREAS: 'view_all_tareas',
  
  // Calificaciones
  GRADE_SUBMISSIONS: 'grade_submissions',
  VIEW_ALL_GRADES: 'view_all_grades',
  PUBLISH_GRADES: 'publish_grades',
  
  // Reportes
  GENERATE_REPORTS: 'generate_reports',
  VIEW_ANALYTICS: 'view_analytics',
  
  // Estudiantes
  SUBMIT_TASKS: 'submit_tasks',
  VIEW_OWN_GRADES: 'view_own_grades',
  VIEW_OWN_PROGRESS: 'view_own_progress',
};
