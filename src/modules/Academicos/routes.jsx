import { Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ProtectedRoute, RoleBasedRoute, LoadingSpinner, ROLES } from '../../core';

const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const CoursesPage = lazy(() => import('./pages/CoursesPage').then(m => ({ default: m.CoursesPage })));
const CourseManagementPage = lazy(() => import('./pages/CourseManagementPage').then(m => ({ default: m.CourseManagementPage })));
const CourseDetailPage = lazy(() => import('./pages/CourseDetailPage').then(m => ({ default: m.CourseDetailPage })));
const TasksPage = lazy(() => import('./pages/TasksPage').then(m => ({ default: m.TasksPage })));
const TaskDetailPage = lazy(() => import('./pages/TaskDetailPage').then(m => ({ default: m.TaskDetailPage })));
const GradesPage = lazy(() => import('./pages/GradesPage').then(m => ({ default: m.GradesPage })));
const SubmissionsPage = lazy(() => import('./pages/SubmissionsPage').then(m => ({ default: m.SubmissionsPage })));
const ProgressPage = lazy(() => import('./pages/ProgressPage').then(m => ({ default: m.ProgressPage })));
const ReportsPage = lazy(() => import('./pages/ReportsPage').then(m => ({ default: m.ReportsPage })));
const SubjectsManagementPage = lazy(() => import('./pages/SubjectsManagementPage').then(m => ({ default: m.SubjectsManagementPage })));
const StudentGradesPage = lazy(() => import('./pages/StudentGradesPage').then(m => ({ default: m.StudentGradesPage })));
const NotificationsManagementPage = lazy(() => import('./pages/NotificationsManagementPage').then(m => ({ default: m.NotificationsManagementPage })));
const MonthlyReportPage = lazy(() => import('./pages/MonthlyReportPage').then(m => ({ default: m.MonthlyReportPage })));
const CreateTaskPage = lazy(() => import('./pages/CreateTaskPage').then(m => ({ default: m.CreateTaskPage })));

const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
);

export const AcademicosRoutes = () => {
  return (
    <>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <SuspenseWrapper><DashboardPage /></SuspenseWrapper>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/cursos"
        element={
          <ProtectedRoute>
            <SuspenseWrapper><CoursesPage /></SuspenseWrapper>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/cursos/gestion"
        element={
          <ProtectedRoute>
            <SuspenseWrapper><CourseManagementPage /></SuspenseWrapper>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/cursos/:id"
        element={
          <ProtectedRoute>
            <SuspenseWrapper><CourseDetailPage /></SuspenseWrapper>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/tareas"
        element={
          <ProtectedRoute>
            <SuspenseWrapper><TasksPage /></SuspenseWrapper>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tareas/:id"
        element={
          <ProtectedRoute>
            <SuspenseWrapper><TaskDetailPage /></SuspenseWrapper>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/calificaciones"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ESTUDIANTE, ROLES.DOCENTE, ROLES.PROFESOR]}>
            <SuspenseWrapper><GradesPage /></SuspenseWrapper>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/entregas"
        element={
          <ProtectedRoute>
            <SuspenseWrapper><SubmissionsPage /></SuspenseWrapper>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/progreso"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ESTUDIANTE]}>
            <SuspenseWrapper><ProgressPage /></SuspenseWrapper>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/reportes"
        element={
          <ProtectedRoute>
            <SuspenseWrapper><ReportsPage /></SuspenseWrapper>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/academicos/asignaturas-gestion"
        element={
          <ProtectedRoute>
            <SuspenseWrapper><SubjectsManagementPage /></SuspenseWrapper>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/academicos/mis-calificaciones"
        element={
          <ProtectedRoute>
            <SuspenseWrapper><StudentGradesPage /></SuspenseWrapper>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/academicos/notificaciones"
        element={
          <ProtectedRoute>
            <SuspenseWrapper><NotificationsManagementPage /></SuspenseWrapper>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/academicos/reportes-mensuales"
        element={
          <ProtectedRoute>
            <SuspenseWrapper><MonthlyReportPage /></SuspenseWrapper>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/academicos/nueva-tarea"
        element={
          <ProtectedRoute>
            <SuspenseWrapper><CreateTaskPage /></SuspenseWrapper>
          </ProtectedRoute>
        }
      />
    </>
  );
};
