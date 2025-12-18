import { api } from '../../../core';

export const tareasService = {
  // Obtener todas las tareas
  getTareas: async (params = {}) => {
    const { data } = await api.get('/academicos/tareas/', { params });
    return data;
  },

  // Obtener mis tareas (estudiante)
  getMisTareas: async (params = {}) => {
    const { data } = await api.get('/academicos/tareas/mis-tareas/', { params });
    return data;
  },

  // Obtener una tarea por ID
  getTarea: async (id) => {
    const { data } = await api.get(`/academicos/tareas/${id}/`);
    return data;
  },

  // Crear una nueva tarea
  createTarea: async (tareaData) => {
    const { data } = await api.post('/academicos/tareas/', tareaData);
    return data;
  },

  // Actualizar una tarea
  updateTarea: async (id, tareaData) => {
    const { data } = await api.patch(`/academicos/tareas/${id}/`, tareaData);
    return data;
  },

  // Eliminar una tarea
  deleteTarea: async (id) => {
    const { data } = await api.delete(`/academicos/tareas/${id}/`);
    return data;
  },

  // Publicar tarea
  publicarTarea: async (id) => {
    const { data } = await api.post(`/academicos/tareas/${id}/publicar/`);
    return data;
  },

  // Cerrar tarea
  cerrarTarea: async (id) => {
    const { data } = await api.post(`/academicos/tareas/${id}/cerrar/`);
    return data;
  },

  // Validar pesos de tareas en una asignatura
  validarPesos: async (asignaturaId) => {
    const { data } = await api.get(`/academicos/tareas/validar-pesos/${asignaturaId}/`);
    return data;
  },

  // Entregar tarea
  entregarTarea: async (tareaId, entregaData) => {
    const { data } = await api.post(`/academicos/tareas/${tareaId}/entregar/`, entregaData);
    return data;
  },

  // Calificar entrega
  calificarEntrega: async (entregaId, calificacionData) => {
    const { data } = await api.post(`/academicos/entregas/${entregaId}/calificar/`, calificacionData);
    return data;
  },
};
