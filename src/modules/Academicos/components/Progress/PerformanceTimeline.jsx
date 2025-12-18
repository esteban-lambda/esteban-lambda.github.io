import { Box, Typography } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export const PerformanceTimeline = ({ asignaturas }) => {
  // Preparar datos para el gráfico
  const data = asignaturas?.map((asig, index) => ({
    name: asig.codigo || `Asig ${index + 1}`,
    promedio: asig.nota_final || 0,
    objetivo: 70, // Línea de referencia
  })) || [];

  if (data.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={300}>
        <Typography color="text.secondary">No hay datos disponibles</Typography>
      </Box>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="promedio"
          stroke="#1976d2"
          strokeWidth={2}
          name="Mi Promedio"
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="objetivo"
          stroke="#4caf50"
          strokeDasharray="5 5"
          strokeWidth={2}
          name="Objetivo (70)"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
