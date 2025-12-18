import { api } from '../../../core';

export const cursosService = {
    // Obtener todos los cursos/asignaturas
    getCursos: async (params = {}) => {
        const { data } = await api.get("/academicos/asignaturas/", { params });
        return data;
    },

    // Obtener mis cursos/asignaturas
    getMisCursos: async (params = {}) => {
        const { data } = await api.get("/academicos/asignaturas/mis-asignaturas/", { params });
        return data;
    },

    // Obtener un curso por ID
    getCurso: async (id) => {
        const { data } = await api.get(`/academicos/asignaturas/${id}/`);
        return data;
    },

    // Crear un nuevo curso
    createCurso: async (cursoData) => {
        const { data } = await api.post("/academicos/asignaturas/", cursoData);
        return data;
    },

    // Actualizar un curso
    updateCurso: async (id, cursoData) => {
        const { data } = await api.patch(`/academicos/asignaturas/${id}/`, cursoData);
        return data;
    },

    // Eliminar un curso
    deleteCurso: async (id) => {
        const { data } = await api.delete(`/academicos/asignaturas/${id}/`);
        return data;
    },

    // Asignar docente
    asignarDocente: async (id, docenteId) => {
        const { data } = await api.post(`/academicos/asignaturas/${id}/asignar-docente/`, {
            docente_responsable: docenteId,
        });
        return data;
    },

    // Activar asignatura
    activarCurso: async (id) => {
        const { data } = await api.post(`/academicos/asignaturas/${id}/activar/`);
        return data;
    },

    // Desactivar asignatura
    desactivarCurso: async (id) => {
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

    // Obtener estudiantes de un curso
    getEstudiantes: async (cursoId) => {
        const { data } = await api.get(
            `/academicos/asignaturas/${cursoId}/estudiantes/`
        );
        return data;
    },

    // Matricular estudiante
    matricularEstudiante: async (cursoId, estudianteId) => {
        const { data } = await api.post(
            `/academicos/asignaturas/${cursoId}/matricular/`,
            {
                estudiante_id: estudianteId,
            }
        );
        return data;
    },
};
