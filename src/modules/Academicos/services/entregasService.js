import { api } from '../../../core';

export const entregasService = {
  // Listar entregas
  getAll: async (params = {}) => {
    const { data } = await api.get('/academicos/entregas/', { params });
    return data;
  },

  // Obtener mis entregas (estudiante)
  getMisEntregas: async (params = {}) => {
    const { data } = await api.get('/academicos/entregas/mis-entregas/', { params });
    return data;
  },

  // Obtener entregas por tarea (docente)
  getPorTarea: async (tareaId, params = {}) => {
    const { data } = await api.get(`/academicos/entregas/por-tarea/${tareaId}/`, { params });
    return data;
  },

  // Obtener entregas pendientes de calificar
  getPendientesCalificar: async (params = {}) => {
    const { data } = await api.get('/academicos/entregas/pendientes-calificar/', { params });
    return data;
  },

  // Obtener detalle de entrega
  getById: async (id) => {
    const { data } = await api.get(`/academicos/entregas/${id}/`);
    return data;
  },

  // Crear entrega (estudiante)
  create: async (entregaData) => {
    const formData = new FormData();
    Object.keys(entregaData).forEach((key) => {
      if (entregaData[key] !== null && entregaData[key] !== undefined) {
        if (key === 'archivo_adjunto' && entregaData[key] instanceof File) {
          formData.append(key, entregaData[key]);
        } else {
          formData.append(key, entregaData[key]);
        }
      }
    });

    const { data } = await api.post('/academicos/entregas/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  // Actualizar entrega
  update: async (id, entregaData) => {
    const formData = new FormData();
    Object.keys(entregaData).forEach((key) => {
      if (entregaData[key] !== null && entregaData[key] !== undefined) {
        if (key === 'archivo_adjunto' && entregaData[key] instanceof File) {
          formData.append(key, entregaData[key]);
        } else {
          formData.append(key, entregaData[key]);
        }
      }
    });

    const { data } = await api.put(`/academicos/entregas/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  // Calificar entrega
  calificar: async (id, calificacionData) => {
    const { data } = await api.post(`/academicos/entregas/${id}/calificar/`, calificacionData);
    return data;
  },

  // Aprobar entrega
  aprobar: async (id, comentario = '') => {
    const { data } = await api.post(`/academicos/entregas/${id}/aprobar/`, {
      comentario_docente: comentario,
    });
    return data;
  },

  // Devolver entrega para corrección
  devolver: async (id, comentario) => {
    const { data } = await api.post(`/academicos/entregas/${id}/devolver/`, {
      comentario_docente: comentario,
    });
    return data;
  },

  // Rechazar entrega
  rechazar: async (id, motivo) => {
    const { data } = await api.post(`/academicos/entregas/${id}/rechazar/`, {
      comentario_docente: motivo,
    });
    return data;
  },

  // Eliminar entrega
  delete: async (id) => {
    await api.delete(`/academicos/entregas/${id}/`);
  },
};
