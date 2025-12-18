import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { entregasService } from '../services/entregasService';
import { useAuth } from '../../Usuarios/hooks/useAuth';
import { toast } from '@/core/components';

// Query para obtener todas las entregas (solo admins)
export const useEntregas = (params = {}) => {
  const { isAdmin } = useAuth();

  return useQuery({
    queryKey: ['entregas', params, isAdmin],
    queryFn: () => {
      // Solo admins pueden ver todas las entregas
      if (!isAdmin) {
        return entregasService.getMisEntregas(params);
      }
      return entregasService.getAll(params);
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

// Query para obtener mis entregas
export const useMisEntregas = (params = {}) => {
  return useQuery({
    queryKey: ['mis-entregas', params],
    queryFn: () => entregasService.getMisEntregas(params),
    staleTime: 2 * 60 * 1000,
  });
};

// Query para obtener entregas por tarea
export const useEntregasPorTarea = (tareaId) => {
  return useQuery({
    queryKey: ['entregas-tarea', tareaId],
    queryFn: () => entregasService.getPorTarea(tareaId),
    enabled: !!tareaId,
    staleTime: 2 * 60 * 1000,
  });
};

// Query para obtener entregas pendientes de calificar
export const useEntregasPendientes = (params = {}) => {
  return useQuery({
    queryKey: ['entregas-pendientes', params],
    queryFn: () => entregasService.getPendientesCalificar(params),
    staleTime: 2 * 60 * 1000,
  });
};

// Query para obtener una entrega específica
export const useEntrega = (id) => {
  return useQuery({
    queryKey: ['entrega', id],
    queryFn: () => entregasService.getById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
};

// Mutation para crear entrega (subir trabajo)
export const useCreateEntrega = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: entregasService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['entregas'] });
      queryClient.invalidateQueries({ queryKey: ['mis-entregas'] });
      queryClient.invalidateQueries({ queryKey: ['entregas-tarea', data.tarea] });
      toast.success('Tu entrega ha sido enviada correctamente', 'Entrega enviada');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'No se pudo enviar la entrega', 'Error');
    },
  });
};

// Mutation para actualizar entrega
export const useUpdateEntrega = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => entregasService.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['entregas'] });
      queryClient.invalidateQueries({ queryKey: ['mis-entregas'] });
      queryClient.invalidateQueries({ queryKey: ['entrega', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['entregas-tarea', data.tarea] });
      toast.success('Los cambios se guardaron correctamente', 'Entrega actualizada');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'No se pudo actualizar la entrega', 'Error');
    },
  });
};

// Mutation para calificar entrega
export const useCalificarEntrega = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, calificacion, comentarios }) => 
      entregasService.calificar(id, calificacion, comentarios),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['entregas'] });
      queryClient.invalidateQueries({ queryKey: ['entregas-pendientes'] });
      queryClient.invalidateQueries({ queryKey: ['entrega', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['calificaciones'] });
      toast.success('La calificación ha sido registrada correctamente', 'Entrega calificada');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'No se pudo calificar la entrega', 'Error');
    },
  });
};

// Mutation para aprobar entrega
export const useAprobarEntrega = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: entregasService.aprobar,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['entregas'] });
      queryClient.invalidateQueries({ queryKey: ['entregas-pendientes'] });
      queryClient.invalidateQueries({ queryKey: ['entrega', id] });
      toast.success('La entrega ha sido aprobada correctamente', 'Entrega aprobada');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'No se pudo aprobar la entrega', 'Error');
    },
  });
};

// Mutation para devolver entrega
export const useDevolverEntrega = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, comentarios }) => entregasService.devolver(id, comentarios),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['entregas'] });
      queryClient.invalidateQueries({ queryKey: ['entregas-pendientes'] });
      queryClient.invalidateQueries({ queryKey: ['entrega', variables.id] });
      toast.success('La entrega ha sido devuelta para su corrección', 'Entrega devuelta');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'No se pudo devolver la entrega', 'Error');
    },
  });
};

// Mutation para rechazar entrega
export const useRechazarEntrega = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, motivo }) => entregasService.rechazar(id, motivo),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['entregas'] });
      queryClient.invalidateQueries({ queryKey: ['entregas-pendientes'] });
      queryClient.invalidateQueries({ queryKey: ['entrega', variables.id] });
      toast.success('La entrega ha sido rechazada', 'Entrega rechazada');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'No se pudo rechazar la entrega', 'Error');
    },
  });
};
