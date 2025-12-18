import { Box, Typography } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = {
  excelente: '#4caf50',
  bueno: '#2196f3',
  regular: '#ff9800',
  deficiente: '#f44336',
};

export const GradesDistribution = ({ asignaturas }) => {
  // Clasificar notas
  const clasificacion = {
    excelente: 0, // >= 90
    bueno: 0, // 70-89
    regular: 0, // 50-69
    deficiente: 0, // < 50
  };

  asignaturas?.forEach((asig) => {
    const nota = asig.nota_final || 0;
    if (nota >= 90) clasificacion.excelente++;
    else if (nota >= 70) clasificacion.bueno++;
    else if (nota >= 50) clasificacion.regular++;
    else clasificacion.deficiente++;
  });

  const data = [
    { name: 'Excelente (≥90)', value: clasificacion.excelente, color: COLORS.excelente },
    { name: 'Bueno (70-89)', value: clasificacion.bueno, color: COLORS.bueno },
    { name: 'Regular (50-69)', value: clasificacion.regular, color: COLORS.regular },
    { name: 'Deficiente (<50)', value: clasificacion.deficiente, color: COLORS.deficiente },
  ].filter((item) => item.value > 0);

  if (data.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={300}>
        <Typography color="text.secondary">No hay datos disponibles</Typography>
      </Box>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
};
