import { api } from '../../../core';

export const asignaturasService = {
  // Listar todas las asignaturas
  getAsignaturas: async (params = {}) => {
    const { data } = await api.get('/academicos/asignaturas/', { params });
    return data;
  },

  // Obtener mis asignaturas (estudiante o docente)
  getMisAsignaturas: async (params = {}) => {
    const { data } = await api.get('/academicos/asignaturas/mis-asignaturas/', { params });
    return data;
  },

  // Obtener detalle de asignatura
  getById: async (id) => {
    const { data } = await api.get(`/academicos/asignaturas/${id}/`);
    return data;
  },

  // Crear asignatura
  create: async (asignaturaData) => {
    const { data } = await api.post('/academicos/asignaturas/', asignaturaData);
    return data;
  },

  // Actualizar asignatura
  update: async (id, asignaturaData) => {
    const { data } = await api.put(`/academicos/asignaturas/${id}/`, asignaturaData);
    return data;
  },

  // Asignar docente
  asignarDocente: async (id, data) => {
    const { data: response } = await api.post(`/academicos/asignaturas/${id}/asignar-docente/`, data);
    return response;
  },

  // Activar asignatura
  activar: async (id) => {
    const { data } = await api.post(`/academicos/asignaturas/${id}/activar/`);
    return data;
  },

  // Desactivar asignatura
  desactivar: async (id) => {
    const { data } = await api.post(`/academicos/asignaturas/${id}/desactivar/`);
    return data;
  },

  // Cambiar estado
  cambiarEstado: async (id, estado) => {
    const { data } = await api.post(`/academicos/asignaturas/${id}/cambiar-estado/`, {
      estado,
    });
    return data;
  },

  // Eliminar asignatura
  delete: async (id) => {
    await api.delete(`/academicos/asignaturas/${id}/`);
  },
};
