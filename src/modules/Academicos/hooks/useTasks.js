import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tareasService } from '../services/tareasService';
import { toast } from '@/core/components';
import { useAuth } from '../../Usuarios/hooks/useAuth';

export const useTasks = (params = {}) => {
  const { isAdmin, user } = useAuth();

  return useQuery({
    queryKey: ['tareas', params, isAdmin, user?.user_id],
    queryFn: async () => {
      // Administradores ven todas las tareas
      if (isAdmin) {
        return tareasService.getTareas(params);
      }
      
      // Docentes y estudiantes ven solo sus tareas
      // El backend ya filtra según el usuario autenticado
      return tareasService.getMisTareas(params);
    },
  });
};

export const useTask = (id) => {
  return useQuery({
    queryKey: ['tarea', id],
    queryFn: () => tareasService.getTarea(id),
    enabled: !!id,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tareasService.createTarea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
      toast.success('La tarea ha sido creada correctamente', 'Tarea creada');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'No se pudo crear la tarea', 'Error');
    },
  });
};

// Alias para compatibilidad
export const useCreateTarea = useCreateTask;

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => tareasService.updateTarea(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
      queryClient.invalidateQueries({ queryKey: ['tarea', variables.id] });
      toast.success('Los cambios se guardaron correctamente', 'Tarea actualizada');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'No se pudo actualizar la tarea', 'Error');
    },
  });
};

// Alias para compatibilidad
export const useUpdateTarea = useUpdateTask;

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tareasService.deleteTarea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
      toast.success('La tarea ha sido eliminada correctamente', 'Tarea eliminada');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'No se pudo eliminar la tarea', 'Error');
    },
  });
};

// Alias para compatibilidad
export const useDeleteTarea = useDeleteTask;

export const usePublishTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tareasService.publicarTarea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
      toast.success('La tarea ha sido publicada y está visible para los estudiantes', 'Tarea publicada');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'No se pudo publicar la tarea', 'Error');
    },
  });
};

// Alias para compatibilidad
export const usePublicarTarea = usePublishTask;

export const useCloseTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tareasService.cerrarTarea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
      toast.success('La tarea ha sido cerrada, ya no se aceptan entregas', 'Tarea cerrada');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'No se pudo cerrar la tarea', 'Error');
    },
  });
};

// Alias para compatibilidad
export const useCerrarTarea = useCloseTask;

export const useEntregarTarea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tareaId, entregaData }) => tareasService.entregarTarea(tareaId, entregaData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tarea', variables.tareaId] });
      toast.success('Tu tarea ha sido entregada correctamente', 'Tarea entregada');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'No se pudo entregar la tarea', 'Error');
    },
  });
};
