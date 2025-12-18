import { api } from '@/core/services/api';

const BASE_URL = '/usuarios';

export const usuariosService = {
  // Obtener todos los usuarios
  getAll: async (params = {}) => {
    const response = await api.get(BASE_URL, { params });
    return response.data;
  },

  // Obtener usuario por ID
  getById: async (id) => {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Crear usuario
  create: async (data) => {
    const response = await api.post(`${BASE_URL}/`, data);
    return response.data;
  },

  // Actualizar usuario
  update: async (id, data) => {
    const response = await api.put(`${BASE_URL}/${id}/`, data);
    return response.data;
  },

  // Actualizar parcialmente usuario
  patch: async (id, data) => {
    const response = await api.patch(`${BASE_URL}/${id}/`, data);
    return response.data;
  },

  // Eliminar usuario
  delete: async (id) => {
    const response = await api.delete(`${BASE_URL}/${id}/`);
    return response.data;
  },

  // Cambiar contraseña
  changePassword: async (id, data) => {
    const response = await api.post(`${BASE_URL}/${id}/cambiar_contrasena/`, data);
    return response.data;
  },

  // Activar usuario
  activar: async (id) => {
    const response = await api.post(`${BASE_URL}/${id}/activar/`);
    return response.data;
  },

  // Desactivar usuario
  desactivar: async (id) => {
    const response = await api.post(`${BASE_URL}/${id}/desactivar/`);
    return response.data;
  },

  // Asignar rol
  asignarRol: async (id, rol) => {
    const response = await api.post(`${BASE_URL}/${id}/asignar_rol/`, { rol });
    return response.data;
  },

  // Obtener usuarios por rol
  porRol: async (rol) => {
    const response = await api.get(`${BASE_URL}/por_rol/`, { params: { rol } });
    return response.data;
  },

  // Obtener mi perfil
  miPerfil: async () => {
    const response = await api.get(`${BASE_URL}/me/`);
    return response.data;
  },

  // Actualizar mi perfil
  actualizarPerfil: async (data) => {
    const response = await api.put(`${BASE_URL}/actualizar_perfil/`, data);
    return response.data;
  },
};
