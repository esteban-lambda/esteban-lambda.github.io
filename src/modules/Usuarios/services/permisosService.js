import { api } from '../../../core';

export const permisosService = {
  // Listar todos los permisos disponibles
  getAll: async (params = {}) => {
    const { data } = await api.get('/permisos/', { params });
    return data;
  },

  // Obtener permisos de un usuario específico
  getUsuarioPermisos: async (usuarioId) => {
    const { data } = await api.get(`/usuarios/usuarios/${usuarioId}/permisos/`);
    return data;
  },

  // Asignar permisos a un usuario
  asignarPermisos: async (usuarioId, permisosIds) => {
    const { data } = await api.post(`/usuarios/usuarios/${usuarioId}/asignar-permisos/`, {
      permisos_ids: permisosIds
    });
    return data;
  },

  // Revocar permisos de un usuario
  revocarPermisos: async (usuarioId, permisosIds) => {
    const { data } = await api.post(`/usuarios/usuarios/${usuarioId}/revocar-permisos/`, {
      permisos_ids: permisosIds
    });
    return data;
  },

  // Listar todos los roles disponibles
  getRoles: async () => {
    const { data } = await api.get('/roles/');
    return data;
  },

  // Asignar roles a un usuario
  asignarRoles: async (usuarioId, rolesIds) => {
    const { data } = await api.post(`/usuarios/usuarios/${usuarioId}/asignar-roles/`, {
      roles_ids: rolesIds
    });
    return data;
  },

  // Revocar roles de un usuario
  revocarRoles: async (usuarioId, rolesIds) => {
    const { data } = await api.post(`/usuarios/usuarios/${usuarioId}/revocar-roles/`, {
      roles_ids: rolesIds
    });
    return data;
  }
};
