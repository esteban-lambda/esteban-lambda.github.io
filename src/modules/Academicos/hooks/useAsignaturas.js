import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { asignaturasService } from '../services/asignaturasService';
import { toast } from '@/core/components';

// Query para obtener todas las asignaturas
export const useAsignaturas = (params = {}) => {
  return useQuery({
    queryKey: ['asignaturas', params],
    queryFn: () => asignaturasService.getAsignaturas(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Query para obtener mis asignaturas
export const useMisAsignaturas = (params = {}) => {
  return useQuery({
    queryKey: ['mis-asignaturas', params],
    queryFn: () => asignaturasService.getMisAsignaturas(params),
    staleTime: 5 * 60 * 1000,
  });
};

// Query para obtener una asignatura específica
export const useAsignatura = (id) => {
  return useQuery({
    queryKey: ['asignatura', id],
    queryFn: () => asignaturasService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Mutation para crear asignatura
export const useCreateAsignatura = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: asignaturasService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asignaturas'] });
      queryClient.invalidateQueries({ queryKey: ['mis-asignaturas'] });
      toast.success('La asignatura ha sido creada correctamente', 'Asignatura creada');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'No se pudo crear la asignatura', 'Error');
    },
  });
};

// Mutation para actualizar asignatura
export const useUpdateAsignatura = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => asignaturasService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['asignaturas'] });
      queryClient.invalidateQueries({ queryKey: ['mis-asignaturas'] });
      queryClient.invalidateQueries({ queryKey: ['asignatura', variables.id] });
      toast.success('Los cambios se guardaron correctamente', 'Asignatura actualizada');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'No se pudo actualizar la asignatura', 'Error');
    },
  });
};

// Mutation para asignar docente
export const useAsignarDocente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, docenteId }) => asignaturasService.asignarDocente(id, docenteId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['asignaturas'] });
      queryClient.invalidateQueries({ queryKey: ['mis-asignaturas'] });
      queryClient.invalidateQueries({ queryKey: ['asignatura', variables.id] });
      toast.success('El docente ha sido asignado correctamente', 'Docente asignado');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'No se pudo asignar el docente', 'Error');
    },
  });
};

// Mutation para activar asignatura
export const useActivarAsignatura = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: asignaturasService.activar,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['asignaturas'] });
      queryClient.invalidateQueries({ queryKey: ['mis-asignaturas'] });
      queryClient.invalidateQueries({ queryKey: ['asignatura', id] });
      toast.success('La asignatura ha sido activada correctamente', 'Asignatura activada');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'No se pudo activar la asignatura', 'Error');
    },
  });
};

// Mutation para desactivar asignatura
export const useDesactivarAsignatura = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: asignaturasService.desactivar,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['asignaturas'] });
      queryClient.invalidateQueries({ queryKey: ['mis-asignaturas'] });
      queryClient.invalidateQueries({ queryKey: ['asignatura', id] });
      toast.success('La asignatura ha sido desactivada correctamente', 'Asignatura desactivada');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'No se pudo desactivar la asignatura', 'Error');
    },
  });
};

// Mutation para cambiar estado
export const useCambiarEstadoAsignatura = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, estado }) => asignaturasService.cambiarEstado(id, estado),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['asignaturas'] });
      queryClient.invalidateQueries({ queryKey: ['mis-asignaturas'] });
      queryClient.invalidateQueries({ queryKey: ['asignatura', variables.id] });
      toast.success('El estado se cambió correctamente', 'Estado actualizado');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'No se pudo cambiar el estado', 'Error');
    },
  });
};

// Mutation para eliminar asignatura
export const useDeleteAsignatura = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: asignaturasService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asignaturas'] });
      queryClient.invalidateQueries({ queryKey: ['mis-asignaturas'] });
      toast.success('La asignatura ha sido eliminada correctamente', 'Asignatura eliminada');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'No se pudo eliminar la asignatura', 'Error');
    },
  });
};
