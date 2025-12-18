import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';

export const useDashboard = () => {
  const resumen = useQuery({
    queryKey: ['dashboard', 'resumen'],
    queryFn: dashboardService.getResumen,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const proximasEntregas = useQuery({
    queryKey: ['dashboard', 'proximas-entregas'],
    queryFn: dashboardService.getProximasEntregas,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  const calificacionesRecientes = useQuery({
    queryKey: ['dashboard', 'calificaciones-recientes'],
    queryFn: () => dashboardService.getCalificacionesRecientes(5),
    staleTime: 5 * 60 * 1000,
  });

  const progresoPorAsignatura = useQuery({
    queryKey: ['dashboard', 'progreso'],
    queryFn: dashboardService.getProgresoPorAsignatura,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });

  return {
    resumen,
    proximasEntregas,
    calificacionesRecientes,
    progresoPorAsignatura,
    isLoading:
      resumen.isLoading ||
      proximasEntregas.isLoading ||
      calificacionesRecientes.isLoading ||
      progresoPorAsignatura.isLoading,
  };
};
