import { api } from '../../../core';

export const dashboardService = {
  // Obtener resumen general del dashboard
  getResumen: async () => {
    const { data } = await api.get('/academicos/analytics/dashboard/');
    return data;
  },

  // Obtener próximas tareas/entregas usando el endpoint existente
  getProximasEntregas: async () => {
    const { data } = await api.get('/academicos/tareas/mis-tareas/', {
      params: {
        estado: 'publicada',
        ordering: 'fecha_vencimiento',
        page_size: 5,
      },
    });
    
    // Adaptar formato al esperado por el frontend
    const tareas = data.results || data;
    return Array.isArray(tareas) ? tareas.map(tarea => ({
      id: tarea.id,
      titulo: tarea.titulo,
      asignatura: {
        id: tarea.asignatura_codigo,
        nombre: tarea.asignatura_nombre
      },
      fecha_entrega: tarea.fecha_vencimiento,
      urgente: tarea.esta_vencida || false,
    })) : [];
  },

  // Obtener calificaciones recientes usando el endpoint existente
  getCalificacionesRecientes: async (limit = 5) => {
    const { data } = await api.get('/academicos/calificaciones/mis-calificaciones/');
    
    // Extraer y aplanar las calificaciones de todas las asignaturas
    const todasCalificaciones = [];
    if (data.asignaturas && Array.isArray(data.asignaturas)) {
      data.asignaturas.forEach(asig => {
        if (asig.calificaciones && Array.isArray(asig.calificaciones)) {
          asig.calificaciones.forEach(cal => {
            todasCalificaciones.push({
              id: cal.id,
              nota: cal.nota,
              tarea: {
                id: cal.id,
                titulo: cal.tarea_titulo
              },
              asignatura: {
                id: asig.asignatura_id,
                nombre: asig.asignatura
              },
              fecha_calificacion: cal.fecha_calificacion
            });
          });
        }
      });
    }
    
    // Ordenar por fecha y limitar
    return todasCalificaciones
      .sort((a, b) => new Date(b.fecha_calificacion) - new Date(a.fecha_calificacion))
      .slice(0, limit);
  },

  // Obtener progreso por asignaturas
  getProgresoPorAsignatura: async () => {
    const { data } = await api.get('/academicos/analytics/progreso-por-asignatura/');
    return data;
  },

  // Obtener estadísticas generales del estudiante
  getEstadisticasEstudiante: async () => {
    const { data } = await api.get('/academicos/analytics/distribucion-global/');
    return data;
  },
};
