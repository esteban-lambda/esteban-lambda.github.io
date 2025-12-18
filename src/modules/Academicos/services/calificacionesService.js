import { api } from '../../../core';

export const calificacionesService = {
  // Obtener todas las calificaciones
  getCalificaciones: async (params = {}) => {
    const { data } = await api.get('/academicos/calificaciones/', { params });
    return data;
  },

  // Obtener mis calificaciones (estudiante)
  getMisCalificaciones: async (params = {}) => {
    const { data } = await api.get('/academicos/calificaciones/mis-calificaciones/', { params });
    return data;
  },

  // Obtener reporte completo de calificaciones
  getReporteCompleto: async (params = {}) => {
    const { data } = await api.get('/academicos/calificaciones/reporte-completo/', { params });
    return data;
  },

  // Obtener calificaciones por asignatura
  getPorAsignatura: async (asignaturaId, params = {}) => {
    const { data } = await api.get(`/academicos/calificaciones/por-asignatura/${asignaturaId}/`, {
      params,
    });
    return data;
  },

  // Obtener calificación por ID
  getCalificacion: async (id) => {
    const { data } = await api.get(`/academicos/calificaciones/${id}/`);
    return data;
  },

  // Crear calificación
  createCalificacion: async (calificacionData) => {
    const { data } = await api.post('/academicos/calificaciones/', calificacionData);
    return data;
  },

  // Crear calificación desde entrega
  createDesdeEntrega: async (entregaId, calificacionData) => {
    const { data } = await api.post(
      `/academicos/calificaciones/crear-desde-entrega/${entregaId}/`,
      calificacionData
    );
    return data;
  },

  // Actualizar calificación
  updateCalificacion: async (id, calificacionData) => {
    const { data } = await api.patch(`/academicos/calificaciones/${id}/`, calificacionData);
    return data;
  },

  // Modificar calificación (método específico)
  modificarCalificacion: async (id, modificacionData) => {
    const { data } = await api.post(`/academicos/calificaciones/${id}/modificar/`, modificacionData);
    return data;
  },

  // Publicar calificación
  publicarCalificacion: async (id) => {
    const { data } = await api.post(`/academicos/calificaciones/${id}/publicar/`);
    return data;
  },

  // Despublicar calificación
  despublicarCalificacion: async (id) => {
    const { data } = await api.post(`/academicos/calificaciones/${id}/despublicar/`);
    return data;
  },

  // Eliminar calificación
  deleteCalificacion: async (id) => {
    const { data } = await api.delete(`/academicos/calificaciones/${id}/`);
    return data;
  },

  // Obtener notas acumuladas del estudiante
  getNotasAcumuladas: async (estudianteId) => {
    const { data } = await api.get(`/academicos/estudiantes/${estudianteId}/notas-acumuladas/`);
    return data;
  },

  // Obtener reporte mensual
  getReporteMensual: async (estudianteId, params = {}) => {
    const { data } = await api.get(`/academicos/estudiantes/${estudianteId}/reporte-mensual/`, {
      params,
    });
    return data;
  },
};
