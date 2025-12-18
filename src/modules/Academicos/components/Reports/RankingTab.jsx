import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Typography,
  Chip,
  LinearProgress,
} from '@mui/material';
import { EmojiEvents as TrophyIcon } from '@mui/icons-material';
import { useRankingEstudiantes } from '../../hooks';

export const RankingTab = () => {
  const { data: ranking, isLoading } = useRankingEstudiantes();

  const getPositionColor = (position) => {
    if (position === 1) return 'gold';
    if (position === 2) return 'silver';
    if (position === 3) return '#cd7f32'; // bronze
    return 'grey.400';
  };

  const getPromedioColor = (promedio) => {
    if (promedio >= 85) return 'success';
    if (promedio >= 70) return 'info';
    if (promedio >= 50) return 'warning';
    return 'error';
  };

  if (isLoading) {
    return (
      <Box px={3} display="flex" justifyContent="center" p={4}>
        <Typography>Cargando ranking...</Typography>
      </Box>
    );
  }

  const estudiantes = ranking?.estudiantes || [];

  return (
    <Box px={3}>
      <Typography variant="h6" gutterBottom>
        Ranking de Estudiantes
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Clasificación según el promedio general de calificaciones
      </Typography>

      {estudiantes.length === 0 ? (
        <Typography color="text.secondary">No hay datos de ranking disponibles</Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={80}>Posición</TableCell>
                <TableCell>Estudiante</TableCell>
                <TableCell>Código</TableCell>
                <TableCell>Promedio</TableCell>
                <TableCell>Créditos</TableCell>
                <TableCell>Asignaturas</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {estudiantes.map((estudiante, index) => (
                <TableRow key={estudiante.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      {index < 3 && (
                        <TrophyIcon sx={{ color: getPositionColor(index + 1), fontSize: 24 }} />
                      )}
                      <Typography variant="h6" fontWeight="bold">
                        #{index + 1}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {estudiante.nombre?.charAt(0) || '?'}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {estudiante.nombre}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {estudiante.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{estudiante.codigo || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                        <Typography variant="h6" fontWeight="bold">
                          {estudiante.promedio?.toFixed(2) || '0.00'}
                        </Typography>
                        <Chip
                          label={estudiante.promedio >= 70 ? 'Aprobado' : 'Bajo'}
                          color={getPromedioColor(estudiante.promedio)}
                          size="small"
                        />
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={estudiante.promedio || 0}
                        color={getPromedioColor(estudiante.promedio)}
                        sx={{ height: 6, borderRadius: 1 }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {estudiante.creditos_aprobados || 0} / {estudiante.total_creditos || 0}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {estudiante.total_asignaturas || 0}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};
