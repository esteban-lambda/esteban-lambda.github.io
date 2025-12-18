import { useQuery } from '@tanstack/react-query';
import { notasService } from '../services/notasService';

// Query para obtener mi progreso académico
export const useMiProgreso = (params = {}) => {
  return useQuery({
    queryKey: ['mi-progreso', params],
    queryFn: () => notasService.getMiProgreso(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Query para obtener desglose de notas
export const useDesglose = (notaId) => {
  return useQuery({
    queryKey: ['desglose-nota', notaId],
    queryFn: () => notasService.getDesglose(notaId),
    enabled: !!notaId,
    staleTime: 5 * 60 * 1000,
  });
};

// Query para obtener notas por asignatura
export const useNotasPorAsignatura = (asignaturaId, params = {}) => {
  return useQuery({
    queryKey: ['notas-asignatura', asignaturaId, params],
    queryFn: () => notasService.getPorAsignatura(asignaturaId, params),
    enabled: !!asignaturaId,
    staleTime: 5 * 60 * 1000,
  });
};

// Query para obtener todas las notas (admin/docente)
export const useNotas = (params = {}) => {
  return useQuery({
    queryKey: ['notas', params],
    queryFn: () => notasService.getAll(params),
    staleTime: 5 * 60 * 1000,
  });
};

// Query para obtener una nota específica
export const useNota = (id) => {
  return useQuery({
    queryKey: ['nota', id],
    queryFn: () => notasService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
