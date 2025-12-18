import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cursosService } from '../services/cursosService';
import { asignaturasService } from '../services/asignaturasService';
import { toast } from '@/core/components';
import { useAuth } from '../../Usuarios';

export const useCourses = (params = {}) => {
  const { isAdmin, isDocente, isEstudiante } = useAuth();

  return useQuery({
    queryKey: ['cursos', params, isAdmin, isDocente],
    queryFn: async () => {
      // Si es admin, obtener todas las asignaturas
      if (isAdmin) {
        return asignaturasService.getAsignaturas(params);
      }
      // Si es docente o estudiante, obtener solo sus asignaturas
      return asignaturasService.getMisAsignaturas(params);
    },
  });
};

export const useCourse = (id) => {
  return useQuery({
    queryKey: ['curso', id],
    queryFn: () => cursosService.getCurso(id),
    enabled: !!id,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cursosService.createCurso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cursos'] });
      toast.success('El curso ha sido creado correctamente', 'Curso creado');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'No se pudo crear el curso', 'Error');
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => cursosService.updateCurso(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cursos'] });
      queryClient.invalidateQueries({ queryKey: ['curso', variables.id] });
      toast.success('Los cambios se guardaron correctamente', 'Curso actualizado');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'No se pudo actualizar el curso', 'Error');
    },
  });
};
