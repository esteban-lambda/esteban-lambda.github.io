import { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  InputAdornment,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Grade as GradeIcon,
  CheckCircle as CheckCircleIcon,
  Undo as UndoIcon,
  Cancel as CancelIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAprobarEntrega, useDevolverEntrega, useRechazarEntrega } from '../../hooks';
import { GradeDialog } from '../Grades/GradeDialog';

export const PendingGradingTab = ({ entregas }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  const [selectedEntrega, setSelectedEntrega] = useState(null);

  const { mutate: aprobar } = useAprobarEntrega();
  const { mutate: devolver } = useDevolverEntrega();
  const { mutate: rechazar } = useRechazarEntrega();

  const handleOpenGradeDialog = (entrega) => {
    setSelectedEntrega(entrega);
    setGradeDialogOpen(true);
  };

  const handleCloseGradeDialog = () => {
    setGradeDialogOpen(false);
    setSelectedEntrega(null);
  };

  const handleAprobar = (entregaId) => {
    if (window.confirm('¿Está seguro de aprobar esta entrega?')) {
      aprobar(entregaId);
    }
  };

  const handleDevolver = (entregaId) => {
    const motivo = window.prompt('Ingrese el motivo de la devolución:');
    if (motivo) {
      devolver({ id: entregaId, comentarios: motivo });
    }
  };

  const handleRechazar = (entregaId) => {
    const motivo = window.prompt('Ingrese el motivo del rechazo:');
    if (motivo) {
      rechazar({ id: entregaId, motivo });
    }
  };

  const filteredEntregas = entregas.filter(
    (entrega) =>
      entrega.tarea?.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entrega.estudiante?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), "dd 'de' MMMM, yyyy HH:mm", { locale: es });
    } catch {
      return 'N/A';
    }
  };

  return (
    <Box px={3}>
      {/* Búsqueda */}
      <Box mb={3}>
        <TextField
          placeholder="Buscar entregas pendientes..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          fullWidth
        />
      </Box>

      {/* Tabla */}
      {filteredEntregas.length === 0 ? (
        <Alert severity="info">No hay entregas pendientes de calificar</Alert>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Estudiante</TableCell>
                <TableCell>Tarea</TableCell>
                <TableCell>Asignatura</TableCell>
                <TableCell>Fecha Entrega</TableCell>
                <TableCell>Archivos</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEntregas.map((entrega) => (
                <TableRow key={entrega.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {entrega.estudiante?.nombre || 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {entrega.estudiante?.email || ''}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{entrega.tarea?.titulo || 'N/A'}</Typography>
                    {entrega.contenido && (
                      <Typography variant="caption" color="text.secondary">
                        {entrega.contenido.substring(0, 50)}...
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {entrega.tarea?.asignatura?.nombre || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{formatDate(entrega.fecha_entrega)}</Typography>
                  </TableCell>
                  <TableCell>
                    {entrega.archivo ? (
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => window.open(entrega.archivo, '_blank')}
                      >
                        <DownloadIcon />
                      </IconButton>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Sin archivo
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Box display="flex" gap={1} justifyContent="flex-end">
                      <Tooltip title="Calificar">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenGradeDialog(entrega)}
                        >
                          <GradeIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Aprobar">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleAprobar(entrega.id)}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Devolver">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => handleDevolver(entrega.id)}
                        >
                          <UndoIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Rechazar">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRechazar(entrega.id)}
                        >
                          <CancelIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog de calificación */}
      <GradeDialog
        open={gradeDialogOpen}
        onClose={handleCloseGradeDialog}
        entrega={selectedEntrega}
      />
    </Box>
  );
};
