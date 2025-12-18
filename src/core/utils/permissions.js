/**
 * Sistema de permisos basado en permisos específicos del backend
 * Los permisos se obtienen del usuario autenticado desde el token JWT
 */

/**
 * Verifica si el usuario tiene un permiso específico
 * @param {Object} user - Usuario autenticado con permisos
 * @param {string} permission - Código del permiso (ej: '?.crear_asignatura')
 * @returns {boolean}
 */
export const hasPermission = (user, permission) => {
  if (!user) return false;
  
  // Superusuarios y staff tienen todos los permisos (soportar español e inglés)
  if (user.is_superuser || user.is_staff || user.es_superusuario || user.es_staff) return true;
  
  // Verificar en el array de permisos del usuario
  const userPermissions = user.permissions || user.permisos || [];
  
  return userPermissions.includes(permission);
};

/**
 * Verifica si el usuario tiene al menos uno de los permisos especificados
 * @param {Object} user - Usuario autenticado
 * @param {Array<string>} permissions - Array de permisos a verificar
 * @returns {boolean}
 */
export const hasAnyPermission = (user, permissions) => {
  if (!user) return false;
  if (user.is_superuser || user.is_staff || user.es_superusuario || user.es_staff) return true;
  
  return permissions.some(permission => hasPermission(user, permission));
};

/**
 * Verifica si el usuario tiene todos los permisos especificados
 * @param {Object} user - Usuario autenticado
 * @param {Array<string>} permissions - Array de permisos a verificar
 * @returns {boolean}
 */
export const hasAllPermissions = (user, permissions) => {
  if (!user) return false;
  if (user.is_superuser || user.is_staff || user.es_superusuario || user.es_staff) return true;
  
  return permissions.every(permission => hasPermission(user, permission));
};

// ============================================================================
// PERMISOS DE ASIGNATURAS
// ============================================================================

export const canCreateAsignatura = (user) => {
  return hasPermission(user, 'academicos.crear_asignatura');
};

export const canEditAsignatura = (user, asignatura) => {
  if (!user) return false;
  
  // Verificar permiso global
  if (hasPermission(user, 'academicos.editar_asignatura')) {
    return true;
  }
  
  // Docente puede editar solo sus asignaturas
  if (asignatura) {
    return asignatura.docente_responsable?.id === user.user_id || 
           asignatura.docente_responsable_id === user.user_id;
  }
  
  return false;
};

export const canDeleteAsignatura = (user) => {
  return hasPermission(user, 'academicos.eliminar_asignatura');
};

export const canViewAsignaturas = (user) => {
  return hasPermission(user, 'academicos.ver_asignaturas');
};

export const canAssignTeacher = (user) => {
  return hasPermission(user, 'academicos.asignar_docente');
};

export const canChangeAsignaturaStatus = (user) => {
  return hasPermission(user, 'academicos.cambiar_estado_asignatura');
};

// ============================================================================
// PERMISOS DE TAREAS
// ============================================================================

export const canCreateTarea = (user, asignatura) => {
  if (!user) return false;
  
  // Verificar permiso global
  if (hasPermission(user, 'academicos.crear_tarea')) {
    return true;
  }
  
  // Docente puede crear en sus asignaturas
  if (asignatura) {
    return asignatura.docente_responsable?.id === user.user_id ||
           asignatura.docente_responsable_id === user.user_id;
  }
  
  return false;
};

export const canEditTarea = (user, tarea) => {
  if (!user) return false;
  
  if (hasPermission(user, 'academicos.editar_tarea')) {
    return true;
  }
  
  // Docente puede editar tareas de sus asignaturas
  if (tarea && tarea.asignatura_data) {
    return tarea.asignatura_data.docente_responsable?.id === user.user_id ||
           tarea.asignatura_data.docente_responsable_id === user.user_id;
  }
  
  return false;
};

export const canDeleteTarea = (user) => {
  return hasPermission(user, 'academicos.eliminar_tarea');
};

export const canViewTareas = (user) => {
  return hasPermission(user, 'academicos.ver_tareas');
};

export const canPublishTarea = (user) => {
  return hasPermission(user, 'academicos.publicar_tarea');
};

// ============================================================================
// PERMISOS DE CALIFICACIONES
// ============================================================================

export const canGrade = (user, asignatura) => {
  if (!user) return false;
  
  if (hasPermission(user, 'academicos.calificar_entregas')) {
    return true;
  }
  
  // Docente puede calificar en sus asignaturas
  if (asignatura) {
    return asignatura.docente_responsable?.id === user.user_id ||
           asignatura.docente_responsable_id === user.user_id;
  }
  
  return false;
};

export const canViewCalificaciones = (user) => {
  return hasPermission(user, 'academicos.ver_calificaciones');
};

export const canEditCalificacion = (user) => {
  return hasPermission(user, 'academicos.editar_calificacion');
};

// ============================================================================
// PERMISOS DE ENTREGAS
// ============================================================================

export const canViewEntregas = (user) => {
  return hasPermission(user, 'academicos.ver_entregas');
};

export const canReviewEntregas = (user) => {
  return hasPermission(user, 'academicos.revisar_entregas');
};

// ============================================================================
// PERMISOS DE REPORTES Y ESTADÍSTICAS
// ============================================================================

export const canViewAnalytics = (user) => {
  return hasPermission(user, 'academicos.ver_estadisticas');
};

export const canViewReports = (user) => {
  return hasAnyPermission(user, [
    'academicos.ver_estadisticas',
    'reportes.ver_reportes',
    'reportes.generar_reportes'
  ]);
};

export const canGenerateReports = (user) => {
  return hasPermission(user, 'reportes.generar_reportes');
};

export const canExportReports = (user) => {
  return hasPermission(user, 'reportes.exportar_reportes');
};

// ============================================================================
// PERMISOS DE PERÍODOS ACADÉMICOS
// ============================================================================

export const canManagePeriods = (user) => {
  return hasPermission(user, 'academicos.gestionar_periodos');
};

// ============================================================================
// PERMISOS DE USUARIOS
// ============================================================================

export const canManageUsers = (user) => {
  return hasPermission(user, 'usuarios.gestionar_usuarios');
};

export const canAssignRoles = (user) => {
  return hasPermission(user, 'usuarios.asignar_roles');
};

export const canViewUserReports = (user) => {
  return hasPermission(user, 'usuarios.ver_reportes_usuarios');
};

// ============================================================================
// UTILIDADES
// ============================================================================

/**
 * Filtra elementos según los permisos del usuario
 * @param {Array} items - Array de elementos
 * @param {Object} user - Usuario autenticado
 * @param {Function} permissionCheck - Función que verifica permisos
 * @returns {Array}
 */
export const filterByPermissions = (items, user, permissionCheck) => {
  if (!user || !items) return [];
  
  // Staff y superuser ven todo
  if (user.is_staff || user.is_superuser) {
    return items;
  }
  
  return items.filter(item => permissionCheck(user, item));
};

/**
 * Obtiene lista de permisos del usuario
 * @param {Object} user - Usuario autenticado
 * @returns {Array<string>}
 */
export const getUserPermissions = (user) => {
  if (!user) return [];
  if (user.is_superuser) return ['*']; // Superuser tiene todos
  
  return user.permissions || user.permisos || [];
};
