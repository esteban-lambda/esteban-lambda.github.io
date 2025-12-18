import { Container, Grid, Typography, Box, CircularProgress, Alert } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import { useState } from 'react';
import { BarChart, TrendingUp, School } from '@mui/icons-material';
import { Layout } from '../../../core';
import { PermissionGate } from '../../../core/components/PermissionGate';
import { GradeCard } from '../components/GradeCard';
import { useGrades } from '../hooks/useGrades';
import { useAuth } from '../../Usuarios';

export const GradesPage = () => {
  const { can } = useAuth();
  const { data: grades, isLoading, error } = useGrades();

  // Asignar colores dinámicamente
  const colores = ['#2563eb', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4'];
  
  // Extraer el array de calificaciones de la respuesta (puede ser paginada o directa)
  const gradesArray = Array.isArray(grades) ? grades : (grades?.results || []);
  
  const calificaciones = gradesArray.map((cal, index) => ({
    ...cal,
    color: cal.color || colores[index % colores.length],
  })) || [];

  const promedio = calificaciones.length > 0
    ? calificaciones.reduce((acc, c) => acc + ((c.nota || c.calificacion || 0) / (c.notaMaxima || c.nota_maxima || 100)) * 100, 0) / calificaciones.length
    : 0;

  const aprobadas = calificaciones.filter((c) => ((c.nota || c.calificacion || 0) / (c.notaMaxima || c.nota_maxima || 100)) * 100 >= 60).length;

  // Mensajes según permisos
  const getRoleMessage = () => {
    if (can.hasPermission('academicos.ver_todas_calificaciones')) {
      return 'Vista completa de todas las calificaciones del sistema';
    }
    if (can.hasPermission('academicos.calificar')) {
      return 'Gestiona las calificaciones de tus estudiantes';
    }
    return 'Aquí puedes revisar tus calificaciones en cada asignatura';
  };

  return (
    <Layout>
      {/* Dark Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%)',
          pt: 8,
          pb: 10,
          mb: 4,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '15%',
            left: '5%',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(70px)',
            animation: 'float 11s ease-in-out infinite',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '15%',
            right: '5%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(80px)',
            animation: 'float 13s ease-in-out infinite reverse',
          },
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                mb: 3,
                px: 3,
                py: 1,
                bgcolor: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                borderRadius: 10,
              }}
            >
              <BarChart sx={{ color: '#22c55e', fontSize: 20 }} />
              <Typography variant="caption" sx={{ color: '#86efac', fontWeight: 600, letterSpacing: 1 }}>
                DESEMPEÑO ACADÉMICO
              </Typography>
            </Box>

            <Typography
              variant="h2"
              fontWeight={900}
              gutterBottom
              sx={{
                background: 'linear-gradient(135deg, #ffffff 0%, #dcfce7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em',
                mb: 2,
              }}
            >
              {can.hasPermission('academicos.ver_todas_calificaciones') 
                ? 'Todas las Calificaciones' 
                : can.hasPermission('academicos.calificar') 
                ? 'Gestión de Calificaciones' 
                : 'Mis Calificaciones'}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: '#94a3b8',
                fontWeight: 400,
                mb: 4,
                lineHeight: 1.6,
              }}
            >
              {getRoleMessage()}
            </Typography>

            {/* Alertas informativas según permisos */}
            <PermissionGate requiredPermissions="academicos.calificar">
              <Alert severity="info" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
                Puedes calificar las entregas de los estudiantes en tus asignaturas
              </Alert>
            </PermissionGate>
            <PermissionGate requiredPermissions="academicos.ver_todas_calificaciones">
              <Alert severity="warning" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
                Vista administrativa: Puedes ver y gestionar todas las calificaciones
              </Alert>
            </PermissionGate>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mt: 4 }}>
              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    p: 3,
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="h3"
                    fontWeight={800}
                    sx={{
                      color: '#22c55e',
                      fontFamily: 'monospace',
                    }}
                  >
                    {promedio.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    Promedio general
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    p: 3,
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="h3"
                    fontWeight={800}
                    sx={{
                      color: '#8b5cf6',
                      fontFamily: 'monospace',
                    }}
                  >
                    {aprobadas}/{calificaciones.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    Materias aprobadas
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    p: 3,
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <TrendingUp sx={{ color: '#22c55e', fontSize: 32 }} />
                    <Typography
                      variant="h3"
                      fontWeight={800}
                      sx={{
                        color: '#22c55e',
                        fontFamily: 'monospace',
                      }}
                    >
                      +5%
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    Mejora este semestre
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ pb: 6 }}>
        {(() => {
          const CARDS_PER_PAGE = 6;
          const [page, setPage] = useState(1);
          // Si loading o error, mostrar esos estados
          if (isLoading) {
            return (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress size={60} sx={{ color: '#8b5cf6' }} />
              </Box>
            );
          }
          if (error) {
            return (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="error" gutterBottom>
                  Error al cargar las calificaciones
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {error.message || 'Por favor, intenta nuevamente más tarde'}
                </Typography>
              </Box>
            );
          }
          if (!calificaciones || calificaciones.length === 0) {
            return (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No hay calificaciones disponibles
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Aún no tienes calificaciones registradas
                </Typography>
              </Box>
            );
          }
          // Paginación y grid
          const totalPages = Math.ceil(calificaciones.length / CARDS_PER_PAGE);
          const paginated = calificaciones.slice((page - 1) * CARDS_PER_PAGE, page * CARDS_PER_PAGE);
          const emptySlots = CARDS_PER_PAGE - paginated.length;
          return <>
            <Grid container spacing={3}>
              {paginated.map((calificacion) => (
                <Grid item xs={12} sm={6} lg={4} key={calificacion.id}>
                  <GradeCard calificacion={calificacion} />
                </Grid>
              ))}
              {/* Empty slots to keep grid uniform */}
              {Array.from({ length: emptySlots }).map((_, i) => (
                <Grid item xs={12} sm={6} lg={4} key={`empty-${i}`}>
                  <Box sx={{ minHeight: 320, opacity: 0 }} />
                </Grid>
              ))}
            </Grid>
            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>;
        })()}
      </Container>
    </Layout>
  );
};
