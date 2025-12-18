import { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  TextField,
  InputAdornment,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const MySubmissionsTab = ({ entregas, isDocente }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEntrega, setSelectedEntrega] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleMenuOpen = (event, entrega) => {
    setAnchorEl(event.currentTarget);
    setSelectedEntrega(entrega);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewDetails = () => {
    setDetailsOpen(true);
    handleMenuClose();
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedEntrega(null);
  };

  const filteredEntregas = entregas.filter(
    (entrega) =>
      entrega.tarea?.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entrega.estudiante?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEstadoColor = (estado) => {
    const colors = {
      pendiente: 'warning',
      aprobada: 'success',
      rechazada: 'error',
      devuelta: 'info',
    };
    return colors[estado] || 'default';
  };

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
          placeholder="Buscar entregas..."
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
        <Alert severity="info">No hay entregas disponibles</Alert>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tarea</TableCell>
                {isDocente && <TableCell>Estudiante</TableCell>}
                <TableCell>Fecha Entrega</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Calificación</TableCell>
                <TableCell>Archivos</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEntregas.map((entrega) => (
                <TableRow key={entrega.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {entrega.tarea?.titulo || 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {entrega.tarea?.asignatura?.nombre || ''}
                    </Typography>
                  </TableCell>
                  {isDocente && (
                    <TableCell>
                      <Typography variant="body2">
                        {entrega.estudiante?.nombre || 'N/A'}
                      </Typography>
                    </TableCell>
                  )}
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(entrega.fecha_entrega)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={entrega.estado?.toUpperCase() || 'PENDIENTE'}
                      color={getEstadoColor(entrega.estado)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {entrega.calificacion ? (
                      <Typography variant="body2" fontWeight="bold">
                        {entrega.calificacion} / {entrega.nota_maxima || 100}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Sin calificar
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {entrega.archivo ? (
                      <Button
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={() => window.open(entrega.archivo, '_blank')}
                      >
                        Descargar
                      </Button>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Sin archivo
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, entrega)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Menu contextual */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleViewDetails}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
          Ver Detalles
        </MenuItem>
        {!isDocente && selectedEntrega?.estado === 'devuelta' && (
          <MenuItem onClick={handleMenuClose}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            Editar Entrega
          </MenuItem>
        )}
        {selectedEntrega?.archivo && (
          <MenuItem onClick={() => window.open(selectedEntrega.archivo, '_blank')}>
            <DownloadIcon fontSize="small" sx={{ mr: 1 }} />
            Descargar Archivo
          </MenuItem>
        )}
      </Menu>

      {/* Dialog de detalles */}
      <Dialog open={detailsOpen} onClose={handleCloseDetails} maxWidth="sm" fullWidth>
        <DialogTitle>Detalles de la Entrega</DialogTitle>
        <DialogContent>
          {selectedEntrega && (
            <Box>
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Tarea
                </Typography>
                <Typography variant="body1">{selectedEntrega.tarea?.titulo}</Typography>
              </Box>
              {isDocente && (
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Estudiante
                  </Typography>
                  <Typography variant="body1">
                    {selectedEntrega.estudiante?.nombre}
                  </Typography>
                </Box>
              )}
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Fecha de Entrega
                </Typography>
                <Typography variant="body1">
                  {formatDate(selectedEntrega.fecha_entrega)}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Estado
                </Typography>
                <Chip
                  label={selectedEntrega.estado?.toUpperCase()}
                  color={getEstadoColor(selectedEntrega.estado)}
                  size="small"
                />
              </Box>
              {selectedEntrega.calificacion && (
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Calificación
                  </Typography>
                  <Typography variant="body1">
                    {selectedEntrega.calificacion} / {selectedEntrega.nota_maxima || 100}
                  </Typography>
                </Box>
              )}
              {selectedEntrega.comentarios && (
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Comentarios
                  </Typography>
                  <Typography variant="body1">{selectedEntrega.comentarios}</Typography>
                </Box>
              )}
              {selectedEntrega.contenido && (
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Contenido
                  </Typography>
                  <Typography variant="body1">{selectedEntrega.contenido}</Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
