import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usuariosService } from '../services/usuariosService';
import { toast } from '@/core/components';

// Query para obtener todos los usuarios
export const useUsers = (params = {}) => {
  return useQuery({
    queryKey: ['usuarios', params],
    queryFn: () => usuariosService.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Query para obtener un usuario específico
export const useUser = (id) => {
  return useQuery({
    queryKey: ['usuario', id],
    queryFn: () => usuariosService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Query para obtener usuarios por rol
export const useUsersByRole = (rol) => {
  return useQuery({
    queryKey: ['usuarios-rol', rol],
    queryFn: () => usuariosService.porRol(rol),
    enabled: !!rol,
    staleTime: 5 * 60 * 1000,
  });
};

// Query para obtener mi perfil
export const useMiPerfil = () => {
  return useQuery({
    queryKey: ['mi-perfil'],
    queryFn: usuariosService.miPerfil,
    staleTime: 5 * 60 * 1000,
  });
};

// Mutation para crear usuario
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usuariosService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast.success('El usuario ha sido creado correctamente', 'Usuario creado');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'No se pudo crear el usuario', 'Error');
    },
  });
};

// Mutation para actualizar usuario
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => usuariosService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      queryClient.invalidateQueries({ queryKey: ['usuario', variables.id] });
      toast.success('Los cambios se guardaron correctamente', 'Usuario actualizado');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'No se pudo actualizar el usuario', 'Error');
    },
  });
};

// Mutation para eliminar usuario
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usuariosService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      toast.success('El usuario ha sido eliminado del sistema', 'Usuario eliminado');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'No se pudo eliminar el usuario', 'Error');
    },
  });
};

// Mutation para cambiar contraseña
export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ id, data }) => usuariosService.changePassword(id, data),
    onSuccess: () => {
      toast.success('La contraseña se cambió correctamente', 'Contraseña actualizada');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'No se pudo cambiar la contraseña', 'Error');
    },
  });
};

// Mutation para activar usuario
export const useActivarUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usuariosService.activar,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      queryClient.invalidateQueries({ queryKey: ['usuario', id] });
      toast.success('El usuario ha sido activado correctamente', 'Usuario activado');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'No se pudo activar el usuario', 'Error');
    },
  });
};

// Mutation para desactivar usuario
export const useDesactivarUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usuariosService.desactivar,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      queryClient.invalidateQueries({ queryKey: ['usuario', id] });
      toast.success('El usuario ha sido desactivado correctamente', 'Usuario desactivado');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'No se pudo desactivar el usuario', 'Error');
    },
  });
};

// Mutation para asignar rol
export const useAsignarRol = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, rol }) => usuariosService.asignarRol(id, rol),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      queryClient.invalidateQueries({ queryKey: ['usuario', variables.id] });
      toast.success('El rol ha sido asignado correctamente', 'Rol actualizado');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'No se pudo asignar el rol', 'Error');
    },
  });
};

// Mutation para actualizar perfil
export const useUpdatePerfil = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usuariosService.actualizarPerfil,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mi-perfil'] });
      toast.success('Tu perfil se actualizó correctamente', 'Perfil actualizado');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'No se pudo actualizar el perfil', 'Error');
    },
  });
};
