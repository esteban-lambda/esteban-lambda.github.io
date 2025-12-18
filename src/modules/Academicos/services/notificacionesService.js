  // Actualizar recordatorio existente
  actualizarRecordatorio: async (recordatorioId, recordatorioData) => {
    const { data } = await api.put(`/academicos/recordatorios/${recordatorioId}/`, recordatorioData);
    return data;
  },
import { api } from '../../../core';

export const notificacionesService = {
  // Obtener recordatorios de tareas
  getRecordatorios: async (params = {}) => {
    const { data } = await api.get('/academicos/recordatorios/', { params });
    return data;
  },

  // Obtener recordatorios pendientes
  getRecordatoriosPendientes: async () => {
    const { data } = await api.get('/academicos/recordatorios/pendientes/');
    return data;
  },

  // Crear recordatorio para una tarea
  crearRecordatorio: async (recordatorioData) => {
    const { data } = await api.post('/academicos/recordatorios/', recordatorioData);
    return data;
  },

  // Cancelar recordatorio
  cancelarRecordatorio: async (recordatorioId) => {
    const { data } = await api.post(`/academicos/recordatorios/${recordatorioId}/cancelar/`);
    return data;
  },

  // Reenviar recordatorio
  reenviarRecordatorio: async (recordatorioId, fechaProgramada) => {
    const { data } = await api.post(`/academicos/recordatorios/${recordatorioId}/reenviar/`, {
      fecha_programada: fechaProgramada
    });
    return data;
  },

  // Obtener reportes mensuales
  getReportesMensuales: async (params = {}) => {
    const { data } = await api.get('/reportes-mensuales/', { params });
    return data;
  },

  // Obtener último reporte mensual
  getUltimoReporte: async () => {
    const { data } = await api.get('/reportes-mensuales/ultimo/');
    return data;
  },

  // Obtener detalle de reporte mensual
  getReporteMensual: async (reporteId) => {
    const { data } = await api.get(`/reportes-mensuales/${reporteId}/`);
    return data;
  },

  // Generar reporte mensual manualmente
  generarReporteMensual: async (periodo_academico_id, mes = null, anio = null) => {
    const { data } = await api.post('/reportes-mensuales/generar/', {
      periodo_academico_id,
      mes,
      anio
    });
    return data;
  }
};
