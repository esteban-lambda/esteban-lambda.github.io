import { Box, Grid, Paper, Typography } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export const StatisticsTab = ({ analytics }) => {
  // Preparar datos para el gráfico de distribución de calificaciones
  const distribucionData = [
    { rango: '0-50', cantidad: analytics?.distribucion?.['0-50'] || 0 },
    { rango: '50-70', cantidad: analytics?.distribucion?.['50-70'] || 0 },
    { rango: '70-85', cantidad: analytics?.distribucion?.['70-85'] || 0 },
    { rango: '85-100', cantidad: analytics?.distribucion?.['85-100'] || 0 },
  ];

  return (
    <Box px={3}>
      <Grid container spacing={3}>
        {/* Distribución de Calificaciones */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Distribución de Calificaciones
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={distribucionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rango" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cantidad" fill="#1976d2" name="Estudiantes" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Métricas clave */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Métricas Clave
            </Typography>
            <Box>
              <MetricRow
                label="Promedio más alto"
                value={analytics?.promedio_mas_alto?.toFixed(2) || '0.00'}
              />
              <MetricRow
                label="Promedio más bajo"
                value={analytics?.promedio_mas_bajo?.toFixed(2) || '0.00'}
              />
              <MetricRow
                label="Desviación estándar"
                value={analytics?.desviacion_estandar?.toFixed(2) || '0.00'}
              />
              <MetricRow
                label="Tareas entregadas"
                value={`${analytics?.tareas_entregadas || 0} / ${analytics?.total_tareas || 0}`}
              />
              <MetricRow
                label="% Entregas a tiempo"
                value={`${analytics?.entregas_a_tiempo?.toFixed(0) || '0'}%`}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Estadísticas por asignatura */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Estadísticas por Asignatura
            </Typography>
            {analytics?.por_asignatura && analytics.por_asignatura.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.por_asignatura}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nombre" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="promedio" fill="#4caf50" name="Promedio" />
                  <Bar dataKey="aprobados" fill="#2196f3" name="% Aprobados" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Typography color="text.secondary">No hay datos disponibles</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

const MetricRow = ({ label, value }) => (
  <Box display="flex" justifyContent="space-between" py={1.5} borderBottom="1px solid #eee">
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2" fontWeight="bold">
      {value}
    </Typography>
  </Box>
);
