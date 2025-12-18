import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getUserRole, isAdmin, isDocente, isEstudiante } from '../utils/roleHelpers';
import * as permissions from '../../../core/utils/permissions';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('userData');
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        
        if (decoded.exp * 1000 > Date.now()) {
          // Si hay datos de usuario guardados, usarlos (incluyen roles completos)
          if (savedUser) {
            try {
              const userData = JSON.parse(savedUser);
              setUser(userData);
            } catch {
              // Si falla el parse, usar solo el token decodificado
              setUser(decoded);
            }
          } else {
            setUser(decoded);
          }
        } else {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userData');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
      }
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    // El backend devuelve 'acceso', 'refresco' y 'usuario'
    localStorage.setItem('accessToken', data.acceso);
    localStorage.setItem('refreshToken', data.refresco);
    const decoded = jwtDecode(data.acceso);
    
    // Combinar datos del JWT con datos del usuario del backend
    const userWithRoles = {
      ...decoded,
      ...data.usuario, // Datos completos del usuario desde UsuarioSerializer
      // Asegurar campos en inglés para compatibilidad
      is_staff: data.usuario?.es_staff ?? decoded.is_staff,
      is_superuser: data.usuario?.es_superusuario ?? decoded.is_superuser,
      roles: data.usuario?.roles ?? decoded.roles, // Array de objetos con 'nombre'
    };
    
    // Guardar datos completos del usuario en localStorage para persistencia
    localStorage.setItem('userData', JSON.stringify(userWithRoles));
    
    setUser(userWithRoles);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    setUser(null);
  };

  // Funciones de utilidad para roles (mantener para compatibilidad)
  const userRole = user ? getUserRole(user) : null;

  // Sistema de permisos basado en permisos específicos del backend
  const permissionHelpers = {
    // Verificación de permisos genéricos
    hasPermission: (permission) => permissions.hasPermission(user, permission),
    hasAnyPermission: (perms) => permissions.hasAnyPermission(user, perms),
    hasAllPermissions: (perms) => permissions.hasAllPermissions(user, perms),
    getUserPermissions: () => permissions.getUserPermissions(user),
    
    // Asignaturas
    canCreateAsignatura: () => permissions.canCreateAsignatura(user),
    canEditAsignatura: (asignatura) => permissions.canEditAsignatura(user, asignatura),
    canDeleteAsignatura: () => permissions.canDeleteAsignatura(user),
    canViewAsignaturas: () => permissions.canViewAsignaturas(user),
    canAssignTeacher: () => permissions.canAssignTeacher(user),
    canChangeAsignaturaStatus: () => permissions.canChangeAsignaturaStatus(user),
    
    // Tareas
    canCreateTarea: (asignatura) => permissions.canCreateTarea(user, asignatura),
    canEditTarea: (tarea) => permissions.canEditTarea(user, tarea),
    canDeleteTarea: () => permissions.canDeleteTarea(user),
    canViewTareas: () => permissions.canViewTareas(user),
    canPublishTarea: () => permissions.canPublishTarea(user),
    
    // Calificaciones
    canGrade: (asignatura) => permissions.canGrade(user, asignatura),
    canViewCalificaciones: () => permissions.canViewCalificaciones(user),
    canEditCalificacion: () => permissions.canEditCalificacion(user),
    
    // Entregas
    canViewEntregas: () => permissions.canViewEntregas(user),
    canReviewEntregas: () => permissions.canReviewEntregas(user),
    
    // Reportes y estadísticas
    canViewAnalytics: () => permissions.canViewAnalytics(user),
    canViewReports: () => permissions.canViewReports(user),
    canGenerateReports: () => permissions.canGenerateReports(user),
    canExportReports: () => permissions.canExportReports(user),
    
    // Períodos académicos
    canManagePeriods: () => permissions.canManagePeriods(user),
    
    // Usuarios
    canManageUsers: () => permissions.canManageUsers(user),
    canAssignRoles: () => permissions.canAssignRoles(user),
    canViewUserReports: () => permissions.canViewUserReports(user),
    
    // Utilidades
    filterByPermissions: (items, permissionCheck) => permissions.filterByPermissions(items, user, permissionCheck)
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading,
      role: userRole,
      // Mantener helpers de rol para compatibilidad
      isAdmin: isAdmin(user),
      isDocente: isDocente(user),
      isEstudiante: isEstudiante(user),
      // Nuevo sistema de permisos
      permissions: permissionHelpers,
      can: permissionHelpers // Alias más corto
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
