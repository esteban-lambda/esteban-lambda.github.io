import { useQuery } from '@tanstack/react-query';
import { academicosService } from '../services/academicosService';
import { useAuth } from '../../Usuarios/hooks/useAuth';

export const useGrades = (filters = {}) => {
  const { isAdmin, user } = useAuth();

  return useQuery({
    queryKey: ['grades', filters, isAdmin, user?.user_id],
    queryFn: async () => {
      // Administradores ven todas las calificaciones
      if (isAdmin) {
        return academicosService.getGrades(filters);
      }
      
      // Docentes y estudiantes ven solo sus calificaciones
      // El backend ya filtra según el usuario autenticado
      return academicosService.getMisCalificaciones(filters);
    },
  });
};

export const useStudentReport = (studentId) => {
  return useQuery({
    queryKey: ['student-report', studentId],
    queryFn: () => academicosService.getStudentReport(studentId),
    enabled: !!studentId,
  });
};
