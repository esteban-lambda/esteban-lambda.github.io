import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportesService } from '../services/reportesService';
import { toast } from '@/core/components';

// Query para obtener todos los reportes
export const useReportes = (params = {}) => {
  return useQuery({
    queryKey: ['reportes', params],
    queryFn: () => reportesService.getAll(params),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Query para obtener el último reporte
export const useUltimoReporte = (params = {}) => {
  return useQuery({
    queryKey: ['ultimo-reporte', params],
    queryFn: () => reportesService.getUltimo(params),
    staleTime: 5 * 60 * 1000,
  });
};

// Mutation para generar reporte
export const useGenerarReporte = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reportesService.generar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reportes'] });
      queryClient.invalidateQueries({ queryKey: ['ultimo-reporte'] });
      toast.success('Reporte generado exitosamente');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al generar reporte');
    },
  });
};

// Mutation para enviar reporte
export const useEnviarReporte = () => {
  return useMutation({
    mutationFn: ({ reporteId, email }) => reportesService.enviar(reporteId, email),
    onSuccess: () => {
      toast.success('Reporte enviado exitosamente');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Error al enviar reporte');
    },
  });
};

// ANALYTICS HOOKS

// Query para obtener dashboard analytics
export const useDashboardAnalytics = (params = {}) => {
  return useQuery({
    queryKey: ['analytics-dashboard', params],
    queryFn: () => reportesService.getDashboard(params),
    staleTime: 2 * 60 * 1000,
  });
};

// Query para obtener estadísticas de asignatura
export const useEstadisticasAsignatura = (asignaturaId, params = {}) => {
  return useQuery({
    queryKey: ['estadisticas-asignatura', asignaturaId, params],
    queryFn: () => reportesService.getEstadisticasAsignatura(asignaturaId, params),
    enabled: !!asignaturaId,
    staleTime: 5 * 60 * 1000,
  });
};

// Query para obtener tendencias de estudiante
export const useTendenciasEstudiante = (estudianteId, params = {}) => {
  return useQuery({
    queryKey: ['tendencias-estudiante', estudianteId, params],
    queryFn: () => reportesService.getTendenciasEstudiante(estudianteId, params),
    enabled: !!estudianteId,
    staleTime: 5 * 60 * 1000,
  });
};

// Query para obtener estudiantes en riesgo
export const useEstudiantesRiesgo = (params = {}) => {
  return useQuery({
    queryKey: ['estudiantes-riesgo', params],
    queryFn: () => reportesService.getEstudiantesRiesgo(params),
    staleTime: 10 * 60 * 1000,
  });
};

// Query para comparar asignaturas
export const useComparacionAsignaturas = (params = {}) => {
  return useQuery({
    queryKey: ['comparacion-asignaturas', params],
    queryFn: () => reportesService.compararAsignaturas(params),
    staleTime: 10 * 60 * 1000,
  });
};

// Query para obtener ranking de estudiantes
export const useRankingEstudiantes = (params = {}) => {
  return useQuery({
    queryKey: ['ranking-estudiantes', params],
    queryFn: () => reportesService.getRankingEstudiantes(params),
    staleTime: 5 * 60 * 1000,
  });
};

// Query para obtener distribución global de calificaciones
export const useDistribucionGlobal = (params = {}) => {
  return useQuery({
    queryKey: ['distribucion-global', params],
    queryFn: () => reportesService.getDistribucionGlobal(params),
    staleTime: 10 * 60 * 1000,
  });
};

// Query para obtener métricas de entregas
export const useMetricasEntregas = (params = {}) => {
  return useQuery({
    queryKey: ['metricas-entregas', params],
    queryFn: () => reportesService.getMetricasEntregas(params),
    staleTime: 5 * 60 * 1000,
  });
};

// Query para obtener tendencias del período
export const useTendenciasPeriodo = (params = {}) => {
  return useQuery({
    queryKey: ['tendencias-periodo', params],
    queryFn: () => reportesService.getTendenciasPeriodo(params),
    staleTime: 10 * 60 * 1000,
  });
};
