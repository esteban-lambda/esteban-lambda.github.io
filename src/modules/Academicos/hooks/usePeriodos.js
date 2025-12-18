import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { periodosService } from '../services/periodosService';
import { toast } from '@/core/components';

// Query para obtener todos los períodos
export const usePeriodos = (params = {}) => {
  return useQuery({
    queryKey: ['periodos', params],
    queryFn: () => periodosService.getAll(params),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Query para obtener el período actual
export const usePeriodoActual = () => {
  return useQuery({
    queryKey: ['periodo-actual'],
    queryFn: periodosService.getActual,
    staleTime: 10 * 60 * 1000,
  });
};

// Query para obtener un período específico
export const usePeriodo = (id) => {
  return useQuery({
    queryKey: ['periodo', id],
    queryFn: () => periodosService.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

// Mutation para crear período
export const useCreatePeriodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: periodosService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['periodos'] });
      toast.success('Período creado exitosamente');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al crear período');
    },
  });
};

// Mutation para actualizar período
export const useUpdatePeriodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => periodosService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['periodos'] });
      queryClient.invalidateQueries({ queryKey: ['periodo', variables.id] });
      toast.success('Período actualizado exitosamente');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al actualizar período');
    },
  });
};

// Mutation para marcar período como actual
export const useMarcarPeriodoActual = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: periodosService.marcarActual,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['periodos'] });
      queryClient.invalidateQueries({ queryKey: ['periodo-actual'] });
      queryClient.invalidateQueries({ queryKey: ['periodo', id] });
      toast.success('Período marcado como actual');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al marcar período como actual');
    },
  });
};

// Mutation para eliminar período
export const useDeletePeriodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: periodosService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['periodos'] });
      toast.success('Período eliminado exitosamente');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al eliminar período');
    },
  });
};
