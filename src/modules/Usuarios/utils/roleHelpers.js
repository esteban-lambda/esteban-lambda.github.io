/**
 * Utilidades para manejo de roles de usuario
 * NOTA: ROLES se importa desde core/constants para evitar duplicación
 */
import { ROLES } from '../../../core';

export { ROLES };

/**
 * Obtiene el texto descriptivo del rol para mostrar en UI
 * @param {string} role - Rol del usuario
 * @returns {string}
 */
export const getRoleDisplayName = (role) => {
  const roleMap = {
    [ROLES.ADMINISTRADOR]: 'Administrador',
    [ROLES.ADMIN]: 'Administrador',
    [ROLES.DOCENTE]: 'Docente',
    [ROLES.PROFESOR]: 'Profesor',
    [ROLES.ESTUDIANTE]: 'Estudiante',
    [ROLES.SUPERUSER]: 'Super Administrador'
  };
  
  return roleMap[role?.toLowerCase()] || 'Usuario';
};

/**
 * Obtiene el rol principal del usuario desde el token decodificado
 * @param {Object} user - Usuario decodificado del JWT
 * @returns {string} - Rol del usuario
 */
export const getUserRole = (user) => {
  if (!user) return null;
  
  // Si es superuser, retornar administrador directamente (español e inglés)
  if (user.is_superuser || user.isSuperuser || user.es_superusuario) {
    return ROLES.ADMINISTRADOR;
  }
  
  let role = null;
  
  // Prioridad 1: Campo 'roles' del JWT (puede ser array de objetos o strings)
  if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
    // Si es array de objetos, extraer el nombre del rol
    role = typeof user.roles[0] === 'object' 
      ? user.roles[0].nombre || user.roles[0].name || user.roles[0].rol
      : user.roles[0];
  }
  // Prioridad 2: Campos simples
  else if (user.rol || user.role || user.grupo) {
    role = user.rol || user.role || user.grupo;
  }
  // Prioridad 3: Campo 'groups' (puede ser array de objetos o strings)
  else if (Array.isArray(user.groups) && user.groups.length > 0) {
    // Si es array de objetos con 'nombre' o 'name'
    role = typeof user.groups[0] === 'object' 
      ? user.groups[0].nombre || user.groups[0].name 
      : user.groups[0];
  }
  // Prioridad 4: Si groups es un string
  else if (user.groups) {
    role = user.groups;
  }
  
  if (!role) {
    // Si es staff, retornar administrador (español e inglés)
    if (user.is_staff || user.isStaff || user.es_staff) {
      return ROLES.ADMINISTRADOR;
    }
    // Por defecto, estudiante
    return ROLES.ESTUDIANTE;
  }
  
  // Normalizar el nombre del rol
  const roleLower = role.toLowerCase();
  
  // Mapear variaciones de nombres
  if (roleLower.includes('admin')) {
    return ROLES.ADMINISTRADOR;
  }
  if (roleLower.includes('docente') || roleLower.includes('profesor')) {
    return ROLES.DOCENTE;
  }
  if (roleLower.includes('estudiante')) {
    return ROLES.ESTUDIANTE;
  }
  
  return roleLower;
};

/**
 * Verifica si el usuario tiene un rol específico
 * @param {Object} user - Usuario decodificado del JWT
 * @param {string} role - Rol a verificar
 * @returns {boolean}
 */
export const hasRole = (user, role) => {
  const userRole = getUserRole(user);
  return userRole === role.toLowerCase();
};

/**
 * Verifica si el usuario es administrador (admin o superuser)
 * @param {Object} user - Usuario decodificado del JWT
 * @returns {boolean}
 */
export const isAdmin = (user) => {
  if (!user) return false;
  const role = getUserRole(user);
  return (
    role === ROLES.ADMINISTRADOR ||
    role === ROLES.ADMIN ||
    user.is_superuser ||
    user.isSuperuser ||
    user.es_superusuario ||
    user.is_staff ||
    user.isStaff ||
    user.es_staff
  );
};

/**
 * Verifica si el usuario es docente
 * @param {Object} user - Usuario decodificado del JWT
 * @returns {boolean}
 */
export const isDocente = (user) => {
  if (!user) return false;
  const role = getUserRole(user);
  return role === ROLES.DOCENTE || role === ROLES.PROFESOR;
};

/**
 * Verifica si el usuario es estudiante
 * @param {Object} user - Usuario decodificado del JWT
 * @returns {boolean}
 */
export const isEstudiante = (user) => {
  if (!user) return false;
  const role = getUserRole(user);
  return role === ROLES.ESTUDIANTE;
};

/**
 * Obtiene el nombre para mostrar del usuario
 * @param {Object} user - Usuario decodificado del JWT
 * @returns {string}
 */
export const getDisplayName = (user) => {
  if (!user) return 'Usuario';
  return user.nombre || user.name || user.username || 'Usuario';
};
