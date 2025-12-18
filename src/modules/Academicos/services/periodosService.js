import { api } from '../../../core';

export const periodosService = {
  // Listar períodos académicos
  getPeriodos: async (params = {}) => {
    const { data } = await api.get('/academicos/periodos/', { params });
    return data;
  },

  // Obtener período actual
  getActual: async () => {
    const { data } = await api.get('/academicos/periodos/actual/');
    return data;
  },

  // Obtener detalle de período
  getById: async (id) => {
    const { data } = await api.get(`/academicos/periodos/${id}/`);
    return data;
  },

  // Crear período
  create: async (periodoData) => {
    const { data } = await api.post('/academicos/periodos/', periodoData);
    return data;
  },

  // Actualizar período
  update: async (id, periodoData) => {
    const { data } = await api.put(`/academicos/periodos/${id}/`, periodoData);
    return data;
  },

  // Marcar como período actual
  marcarActual: async (id) => {
    const { data } = await api.post(`/academicos/periodos/${id}/marcar-actual/`);
    return data;
  },

  // Eliminar período
  delete: async (id) => {
    await api.delete(`/academicos/periodos/${id}/`);
  },
};
