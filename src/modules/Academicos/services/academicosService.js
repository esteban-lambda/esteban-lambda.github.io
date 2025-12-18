import { api } from '../../../core';

export const academicosService = {
  // Courses
  getCourses: async () => {
    const { data } = await api.get('/academicos/cursos/');
    return data;
  },

  getCourse: async (id) => {
    const { data } = await api.get(`/academicos/cursos/${id}/`);
    return data;
  },

  // Tasks
  getTasks: async (filters = {}) => {
    const { data } = await api.get('/academicos/tareas/', { params: filters });
    return data;
  },

  getTask: async (id) => {
    const { data } = await api.get(`/academicos/tareas/${id}/`);
    return data;
  },

  submitTask: async (taskId, submission) => {
    const { data } = await api.post(`/academicos/tareas/${taskId}/entregar/`, submission);
    return data;
  },

  // Grades
  getGrades: async (filters = {}) => {
    const { data } = await api.get('/academicos/calificaciones/', { params: filters });
    return data;
  },

  getMisCalificaciones: async (filters = {}) => {
    const { data } = await api.get('/academicos/calificaciones/mis-calificaciones/', { params: filters });
    return data;
  },

  getStudentReport: async (studentId) => {
    const { data } = await api.get(`/academicos/estudiantes/${studentId}/reporte/`);
    return data;
  },
};
