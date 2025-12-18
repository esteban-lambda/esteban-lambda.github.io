import { Box, Grid, Paper, Typography } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { useTendenciasPeriodo } from '../../hooks';

export const TrendsTab = () => {
  const { data: tendencias, isLoading } = useTendenciasPeriodo();

  if (isLoading) {
    return (
      <Box px={3} display="flex" justifyContent="center" p={4}>
        <Typography>Cargando tendencias...</Typography>
      </Box>
    );
  }

  const tendenciasData = tendencias?.tendencias || [];

  return (
    <Box px={3}>
      <Grid container spacing={3}>
        {/* Tendencia de Promedios */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Tendencia de Promedios
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={tendenciasData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="periodo" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="promedio"
                  stroke="#1976d2"
                  strokeWidth={2}
                  name="Promedio"
                />
                <Line
                  type="monotone"
                  dataKey="objetivo"
                  stroke="#4caf50"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  name="Objetivo"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Tasa de Aprobación */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Tasa de Aprobación por Período
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={tendenciasData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="periodo" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="tasa_aprobacion"
                  stroke="#4caf50"
                  fill="#4caf50"
                  fillOpacity={0.3}
                  name="Tasa de Aprobación (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Entregas a Tiempo */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Entregas a Tiempo
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={tendenciasData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="periodo" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="entregas_a_tiempo"
                  stroke="#2196f3"
                  fill="#2196f3"
                  fillOpacity={0.3}
                  name="Entregas a Tiempo (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
