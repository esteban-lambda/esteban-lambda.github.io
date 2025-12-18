import { useState } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  Star as StarIcon,
  EmojiEvents as EmojiEventsIcon,
} from '@mui/icons-material';
import { Layout, RoleGate } from '../../../core';
import { useMiProgreso, useMisAsignaturas } from '../hooks';
import { ROLES } from '../../../core/constants/roles';
import { ProgressChart } from '../components/Progress/ProgressChart';
import { GradesDistribution } from '../components/Progress/GradesDistribution';
import { PerformanceTimeline } from '../components/Progress/PerformanceTimeline';

export const ProgressPage = () => {
  const [selectedAsignatura, setSelectedAsignatura] = useState('todas');

  const { data: progreso, isLoading, error } = useMiProgreso();
  const { data: asignaturas } = useMisAsignaturas();

  const promedioGeneral = typeof progreso?.promedio_general === 'number' 
    ? progreso.promedio_general 
    : parseFloat(progreso?.promedio_general) || 0;
  const totalCreditos = progreso?.total_creditos || 0;
  const creditosAprobados = progreso?.creditos_aprobados || 0;

  const getPromedioColor = (promedio) => {
    if (promedio >= 70) return 'success';
    if (promedio >= 50) return 'warning';
    return 'error';
  };

  const asignaturasArray = Array.isArray(progreso?.asignaturas) ? progreso.asignaturas : [];
  const filteredAsignaturas =
    selectedAsignatura === 'todas'
      ? asignaturasArray
      : asignaturasArray.filter((a) => a.id === selectedAsignatura);

  if (isLoading) {
    return (
      <Layout>
        <Container maxWidth="xl">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress size={60} />
          </Box>
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Container maxWidth="xl">
          <Box py={4}>
            <Alert severity="error">Error al cargar el progreso: {error.message}</Alert>
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="xl">
        <Box py={4}>
          {/* Header */}
          <Box mb={4}>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Mi Progreso Académico
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Seguimiento de tu rendimiento académico y calificaciones
            </Typography>
          </Box>

          {/* Estadísticas principales */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <TrendingUpIcon color="primary" fontSize="large" />
                    <Box flexGrow={1}>
                      <Typography variant="body2" color="text.secondary">
                        Promedio General
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {promedioGeneral.toFixed(2)}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={promedioGeneral}
                        color={getPromedioColor(promedioGeneral)}
                        sx={{ mt: 1, height: 8, borderRadius: 1 }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <AssignmentIcon color="info" fontSize="large" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Créditos
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {creditosAprobados} / {totalCreditos}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Aprobados
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <StarIcon color="warning" fontSize="large" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Asignaturas
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {progreso?.asignaturas?.length || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Cursando
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <EmojiEventsIcon color="success" fontSize="large" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Ranking
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        #{progreso?.ranking || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Posición
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Filtro de asignatura */}
          <Box mb={3}>
            <FormControl size="small" sx={{ minWidth: 250 }}>
              <InputLabel>Filtrar por asignatura</InputLabel>
              <Select
                value={selectedAsignatura}
                label="Filtrar por asignatura"
                onChange={(e) => setSelectedAsignatura(e.target.value)}
              >
                <MenuItem value="todas">Todas las asignaturas</MenuItem>
                {asignaturas?.map((asig) => (
                  <MenuItem key={asig.id} value={asig.id}>
                    {asig.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Gráficos */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Evolución del Rendimiento
                </Typography>
                <PerformanceTimeline asignaturas={filteredAsignaturas} />
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Distribución de Calificaciones
                </Typography>
                <GradesDistribution asignaturas={filteredAsignaturas} />
              </Paper>
            </Grid>
          </Grid>

          {/* Progreso por asignatura */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Progreso por Asignatura
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {filteredAsignaturas.length === 0 ? (
              <Alert severity="info">No hay asignaturas disponibles</Alert>
            ) : (
              <Grid container spacing={2}>
                {filteredAsignaturas.map((asignatura) => (
                  <Grid item xs={12} key={asignatura.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <Box>
                            <Typography variant="h6">{asignatura.nombre}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {asignatura.codigo} • {asignatura.creditos} créditos
                            </Typography>
                          </Box>
                          <Box textAlign="right">
                            <Typography variant="h5" fontWeight="bold">
                              {asignatura.nota_final?.toFixed(2) || '0.00'}
                            </Typography>
                            <Chip
                              label={asignatura.estado?.toUpperCase() || 'EN CURSO'}
                              color={
                                asignatura.nota_final >= 70
                                  ? 'success'
                                  : asignatura.nota_final >= 50
                                  ? 'warning'
                                  : 'error'
                              }
                              size="small"
                            />
                          </Box>
                        </Box>

                        <LinearProgress
                          variant="determinate"
                          value={asignatura.nota_final || 0}
                          color={getPromedioColor(asignatura.nota_final)}
                          sx={{ mb: 2, height: 10, borderRadius: 1 }}
                        />

                        {/* Desglose de notas */}
                        {asignatura.desglose && asignatura.desglose.length > 0 && (
                          <Box>
                            <Typography variant="subtitle2" gutterBottom>
                              Desglose de Evaluaciones
                            </Typography>
                            <Grid container spacing={1}>
                              {asignatura.desglose.map((evaluacion, idx) => (
                                <Grid item xs={12} sm={6} md={4} key={idx}>
                                  <Box
                                    p={1}
                                    borderRadius={1}
                                    bgcolor="grey.50"
                                    border="1px solid"
                                    borderColor="grey.200"
                                  >
                                    <Box display="flex" justifyContent="space-between">
                                      <Typography variant="caption" color="text.secondary">
                                        {evaluacion.nombre}
                                      </Typography>
                                      <Typography variant="caption" fontWeight="bold">
                                        {evaluacion.nota?.toFixed(2)} ({evaluacion.peso}%)
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Box>
      </Container>
    </Layout>
  );
};
