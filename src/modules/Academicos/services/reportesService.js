import { api } from '../../../core';

export const reportesService = {
  // Listar reportes mensuales
  getAll: async (params = {}) => {
    const { data } = await api.get('/academicos/reportes-mensuales/', { params });
    return data;
  },

  // Obtener último reporte
  getUltimo: async () => {
    const { data } = await api.get('/academicos/reportes-mensuales/ultimo/');
    return data;
  },

  // Obtener detalle de reporte
  getById: async (id) => {
    const { data } = await api.get(`/academicos/reportes-mensuales/${id}/`);
    return data;
  },

  // Generar reporte mensual
  generar: async (reporteData) => {
    const { data } = await api.post('/academicos/reportes-mensuales/generar/', reporteData);
    return data;
  },

  // Enviar reporte por correo
  enviar: async (id, destinatarios = []) => {
    const { data } = await api.post(`/academicos/reportes-mensuales/${id}/enviar/`, {
      destinatarios,
    });
    return data;
  },

  // Analytics - Dashboard
  getDashboard: async () => {
    const { data } = await api.get('/academicos/analytics/dashboard/');
    return data;
  },

  // Analytics - Estadísticas por asignatura
  getEstadisticasAsignatura: async (asignaturaId) => {
    const { data } = await api.get(`/academicos/analytics/${asignaturaId}/estadisticas-asignatura/`);
    return data;
  },

  // Analytics - Tendencias del estudiante
  getTendenciasEstudiante: async (estudianteId) => {
    const { data } = await api.get(`/academicos/analytics/${estudianteId}/tendencias-estudiante/`);
    return data;
  },

  // Analytics - Estudiantes en riesgo
  getEstudiantesRiesgo: async (params = {}) => {
    const { data } = await api.get('/academicos/analytics/estudiantes-riesgo/', { params });
    return data;
  },

  // Analytics - Comparar asignaturas
  compararAsignaturas: async (params = {}) => {
    const { data } = await api.get('/academicos/analytics/comparar-asignaturas/', { params });
    return data;
  },

  // Analytics - Ranking de estudiantes
  getRankingEstudiantes: async (params = {}) => {
    const { data } = await api.get('/academicos/analytics/ranking-estudiantes/', { params });
    return data;
  },

  // Analytics - Distribución global
  getDistribucionGlobal: async () => {
    const { data } = await api.get('/academicos/analytics/distribucion-global/');
    return data;
  },

  // Analytics - Métricas de entregas
  getMetricasEntregas: async () => {
    const { data } = await api.get('/academicos/analytics/metricas-entregas/');
    return data;
  },

  // Analytics - Tendencias por período
  getTendenciasPeriodo: async () => {
    const { data } = await api.get('/academicos/analytics/tendencias-periodo/');
    return data;
  },
};
