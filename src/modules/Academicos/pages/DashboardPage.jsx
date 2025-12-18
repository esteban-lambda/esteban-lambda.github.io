import { Box, Grid, Card, CardContent, Typography, Avatar, LinearProgress, Chip, IconButton, List, ListItem, ListItemText, ListItemAvatar, Divider, CircularProgress, Alert } from '@mui/material';
import { Assignment, TrendingUp, CheckCircle, Schedule, ArrowForward, Warning } from '@mui/icons-material';
import { Layout } from '../../../core';
import { PermissionGate } from '../../../core/components/PermissionGate';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../hooks';
import { useAuth } from '../../Usuarios';

// StatCard component - Tarjeta de estadística
const StatCard = ({ title, value, icon, color, subtitle }) => (
  <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 } }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography color="textSecondary" variant="body2" sx={{ mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold" color={color}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="textSecondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Avatar sx={{ bgcolor: `${color}.lighter`, color: `${color}.main` }}>
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { can, user } = useAuth();
  const { resumen, proximasEntregas, calificacionesRecientes, progresoPorAsignatura } = useDashboard();

  // Mensaje de bienvenida personalizado
  const getWelcomeMessage = () => {
    const nombre = user?.nombre || user?.first_name || 'Usuario';
    if (can.hasPermission('academicos.ver_todas_calificaciones')) {
      return 'Panel administrativo - Vista general del sistema';
    }
    if (can.hasPermission('academicos.editar_asignatura')) {
      return `Bienvenido, Profesor ${nombre}. Resumen de tus asignaturas`;
    }
    return `Bienvenido, ${nombre}. Aquí está tu resumen académico`;
  };

  const welcomeMessage = getWelcomeMessage();

  // Loading state
  if (resumen.isLoading || proximasEntregas.isLoading || calificacionesRecientes.isLoading || progresoPorAsignatura.isLoading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={60} />
        </Box>
      </Layout>
    );
  }

  // Error state
  if (resumen.error || proximasEntregas.error || calificacionesRecientes.error || progresoPorAsignatura.error) {
    return (
      <Layout>
        <Box p={3}>
          <Alert severity="error">
            Error al cargar los datos del dashboard. Por favor, intenta nuevamente.
          </Alert>
        </Box>
      </Layout>
    );
  }

  const stats = resumen.data || {};
  const proximasTareas = proximasEntregas.data || [];
  const calificaciones = calificacionesRecientes.data || [];
  const progreso = progresoPorAsignatura.data || [];

  return (
    <Layout>
      <Box>
        {/* Header */}
        <Box mb={3}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Dashboard
          </Typography>
          <Typography color="textSecondary">
            {welcomeMessage}
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Tareas Activas"
              value={stats.tareas_activas || 0}
              icon={<Assignment />}
              color="primary.main"
              subtitle="En curso"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Pendientes"
              value={stats.tareas_pendientes || 0}
              icon={<Schedule />}
              color="warning.main"
              subtitle="Por entregar"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Promedio"
              value={stats.promedio_general ? `${stats.promedio_general}%` : 'N/A'}
              icon={<TrendingUp />}
              color="success.main"
              subtitle="General"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Próximas Entregas"
              value={stats.proximas_entregas || 0}
              icon={<Warning />}
              color="error.main"
              subtitle="Esta semana"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Próximas Tareas */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight="bold">
                    Próximas Tareas
                  </Typography>
                  <IconButton size="small" onClick={() => navigate('/tareas')}>
                    <ArrowForward />
                  </IconButton>
                </Box>
                <List disablePadding>
                  {proximasTareas.map((tarea, index) => (
                    <Box key={tarea.id}>
                      {index > 0 && <Divider />}
                      <ListItem
                        sx={{
                          cursor: 'pointer',
                          '&:hover': { bgcolor: 'action.hover' },
                          borderRadius: 1,
                        }}
                        onClick={() => navigate(`/tareas/${tarea.id}`)}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: tarea.urgente || tarea.estado === 'urgente' ? 'error.main' : 'primary.main' }}>
                            <Assignment />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography fontWeight={600}>{tarea.titulo}</Typography>
                              {(tarea.urgente || tarea.estado === 'urgente') && (
                                <Chip label="Urgente" size="small" color="error" />
                              )}
                            </Box>
                          }
                          secondary={
                            <Typography variant="body2" color="textSecondary">
                              {tarea.asignatura?.nombre || tarea.asignatura || 'Sin asignatura'} • Vence: {new Date(tarea.fecha_entrega || tarea.fecha).toLocaleDateString('es-ES')}
                            </Typography>
                          }
                        />
                        <IconButton>
                          <ArrowForward />
                        </IconButton>
                      </ListItem>
                    </Box>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Calificaciones Recientes */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight="bold">
                    Calificaciones Recientes
                  </Typography>
                  <IconButton size="small" onClick={() => navigate('/calificaciones')}>
                    <ArrowForward />
                  </IconButton>
                </Box>
                <List disablePadding>
                  {calificaciones.map((cal, index) => (
                    <Box key={cal.id}>
                      {index > 0 && <Divider sx={{ my: 1 }} />}
                      <ListItem disablePadding sx={{ mb: 1 }}>
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor: cal.nota >= 90 ? 'success.main' : cal.nota >= 70 ? 'warning.main' : 'error.main',
                              width: 40,
                              height: 40,
                              fontWeight: 'bold',
                            }}
                          >
                            {cal.nota || cal.calificacion || 'N/A'}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body2" fontWeight={600}>
                              {cal.tarea?.titulo || cal.titulo || 'Sin título'}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" color="textSecondary">
                              {cal.asignatura?.nombre || cal.asignatura || 'Sin asignatura'}
                            </Typography>
                          }
                        />
                      </ListItem>
                    </Box>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Progreso por Asignatura */}
        <Grid container spacing={3} mt={1}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Progreso por Asignatura
                </Typography>
                <Grid container spacing={3}>
                  {progreso.length > 0 ? (
                    progreso.map((asignatura) => (
                      <Grid item xs={12} sm={6} md={3} key={asignatura.id || asignatura.nombre}>
                        <Box>
                          <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body2" fontWeight={600}>
                              {asignatura.nombre}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {asignatura.progreso || 0}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={asignatura.progreso || 0}
                            color={
                              asignatura.progreso >= 85
                                ? 'success'
                                : asignatura.progreso >= 70
                                ? 'warning'
                                : 'error'
                            }
                            sx={{ height: 8, borderRadius: 4 }}
                          />
                        </Box>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary" align="center">
                        No hay datos de progreso disponibles
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};
