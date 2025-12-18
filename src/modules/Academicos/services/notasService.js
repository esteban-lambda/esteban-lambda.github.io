import { api } from '../../../core';

export const notasService = {
  // Obtener mi progreso (estudiante)
  getMiProgreso: async () => {
    const { data } = await api.get('/academicos/notas-acumuladas/mi-progreso/');
    return data;
  },

  // Obtener desglose de nota por asignatura
  getDesglose: async (notaAcumuladaId) => {
    const { data } = await api.get(`/academicos/notas-acumuladas/${notaAcumuladaId}/desglose/`);
    return data;
  },

  // Obtener notas por asignatura (docente)
  getPorAsignatura: async (asignaturaId, params = {}) => {
    const { data } = await api.get(`/academicos/notas-acumuladas/por-asignatura/${asignaturaId}/`, {
      params,
    });
    return data;
  },

  // Listar notas acumuladas
  getAll: async (params = {}) => {
    const { data } = await api.get('/academicos/notas-acumuladas/', { params });
    return data;
  },

  // Obtener detalle de nota acumulada
  getById: async (id) => {
    const { data } = await api.get(`/academicos/notas-acumuladas/${id}/`);
    return data;
  },
};
