import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Alert,
  Chip,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  Rating,
  InputAdornment,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Undo as UndoIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useCalificarEntrega, useAprobarEntrega, useDevolverEntrega, useRechazarEntrega } from '../../hooks';

export const GradeDialog = ({ open, onClose, entrega = null }) => {
  // Initialize form data based on entrega
  const getInitialFormData = () => ({
    calificacion: entrega?.calificacion || '',
    comentarios: entrega?.comentarios || '',
    accion: 'calificar', // calificar, aprobar, devolver, rechazar
  });

  const [formData, setFormData] = useState(getInitialFormData);
  const [errors, setErrors] = useState({});

  const { mutate: calificarEntrega, isPending: isCalificando } = useCalificarEntrega();
  const { mutate: aprobarEntrega, isPending: isAprobando } = useAprobarEntrega();
  const { mutate: devolverEntrega, isPending: isDevolviendo } = useDevolverEntrega();
  const { mutate: rechazarEntrega, isPending: isRechazando } = useRechazarEntrega();

  const isPending = isCalificando || isAprobando || isDevolviendo || isRechazando;

  // Reset form when dialog opens or entrega changes
  // react-compiler-ignore
  useEffect(() => {
    if (open && entrega) {
      setFormData(getInitialFormData());
      setErrors({});
    }
  }, [open, entrega?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.accion === 'calificar' || formData.accion === 'aprobar') {
      const nota = parseFloat(formData.calificacion);
      const notaMaxima = entrega?.tarea?.nota_maxima || 100;
      
      if (!formData.calificacion || isNaN(nota)) {
        newErrors.calificacion = 'La calificación es requerida';
      } else if (nota < 0 || nota > notaMaxima) {
        newErrors.calificacion = `La calificación debe estar entre 0 y ${notaMaxima}`;
      }
    }

    if (formData.accion === 'devolver' && !formData.comentarios.trim()) {
      newErrors.comentarios = 'Debe proporcionar un motivo para devolver la entrega';
    }

    if (formData.accion === 'rechazar' && !formData.comentarios.trim()) {
      newErrors.comentarios = 'Debe proporcionar un motivo para rechazar la entrega';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const data = {
      calificacion: formData.calificacion ? parseFloat(formData.calificacion) : undefined,
      comentarios: formData.comentarios,
    };

    switch (formData.accion) {
      case 'calificar':
        calificarEntrega(
          { id: entrega.id, data },
          { onSuccess: handleClose }
        );
        break;
      case 'aprobar':
        aprobarEntrega(
          { id: entrega.id, data },
          { onSuccess: handleClose }
        );
        break;
      case 'devolver':
        devolverEntrega(
          { id: entrega.id, data: { comentarios: data.comentarios } },
          { onSuccess: handleClose }
        );
        break;
      case 'rechazar':
        rechazarEntrega(
          { id: entrega.id, data: { comentarios: data.comentarios } },
          { onSuccess: handleClose }
        );
        break;
    }
  };

  const handleClose = () => {
    setFormData({
      calificacion: '',
      comentarios: '',
      accion: 'calificar',
    });
    setErrors({});
    onClose();
  };

  const getActionColor = () => {
    const colors = {
      calificar: 'primary',
      aprobar: 'success',
      devolver: 'warning',
      rechazar: 'error',
    };
    return colors[formData.accion] || 'primary';
  };

  const getActionLabel = () => {
    const labels = {
      calificar: 'Calificar',
      aprobar: 'Aprobar',
      devolver: 'Devolver',
      rechazar: 'Rechazar',
    };
    return labels[formData.accion];
  };

  if (!entrega) return null;

  const notaMaxima = entrega.tarea?.nota_maxima || 100;
  const porcentajeNota = formData.calificacion ? (parseFloat(formData.calificacion) / notaMaxima) * 100 : 0;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Calificar Entrega</Typography>
          <Button onClick={handleClose} color="inherit" size="small">
            <CloseIcon />
          </Button>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Información de la entrega */}
          <Grid item xs={12}>
            <Alert severity="info">
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  {entrega.tarea?.titulo}
                </Typography>
                <Typography variant="caption" display="block">
                  Estudiante: {entrega.estudiante?.nombre} {entrega.estudiante?.apellido}
                </Typography>
                <Typography variant="caption" display="block">
                  Fecha de entrega: {new Date(entrega.fecha_entrega).toLocaleString('es-ES')}
                </Typography>
                <Box display="flex" gap={1} mt={1}>
                  <Chip
                    label={entrega.estado?.toUpperCase()}
                    size="small"
                    color={
                      entrega.estado === 'aprobada'
                        ? 'success'
                        : entrega.estado === 'devuelta'
                        ? 'warning'
                        : entrega.estado === 'rechazada'
                        ? 'error'
                        : 'default'
                    }
                  />
                  {entrega.archivo_entrega && (
                    <Chip
                      label="Con archivo adjunto"
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  )}
                </Box>
              </Box>
            </Alert>
          </Grid>

          {/* Contenido de la entrega */}
          {entrega.contenido && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Contenido de la entrega:
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {entrega.contenido}
                </Typography>
              </Paper>
            </Grid>
          )}

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Acción a realizar */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Acción a realizar:
            </Typography>
            <RadioGroup
              row
              value={formData.accion}
              onChange={(e) => handleChange('accion', e.target.value)}
            >
              <FormControlLabel
                value="calificar"
                control={<Radio />}
                label={
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <StarIcon fontSize="small" />
                    <Typography variant="body2">Calificar</Typography>
                  </Box>
                }
              />
              <FormControlLabel
                value="aprobar"
                control={<Radio />}
                label={
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <CheckCircleIcon fontSize="small" color="success" />
                    <Typography variant="body2">Aprobar</Typography>
                  </Box>
                }
              />
              <FormControlLabel
                value="devolver"
                control={<Radio />}
                label={
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <UndoIcon fontSize="small" color="warning" />
                    <Typography variant="body2">Devolver</Typography>
                  </Box>
                }
              />
              <FormControlLabel
                value="rechazar"
                control={<Radio />}
                label={
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <CancelIcon fontSize="small" color="error" />
                    <Typography variant="body2">Rechazar</Typography>
                  </Box>
                }
              />
            </RadioGroup>
          </Grid>

          {/* Calificación */}
          {(formData.accion === 'calificar' || formData.accion === 'aprobar') && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Calificación"
                  value={formData.calificacion}
                  onChange={(e) => handleChange('calificacion', e.target.value)}
                  error={!!errors.calificacion}
                  helperText={errors.calificacion || `Nota máxima: ${notaMaxima}`}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">/ {notaMaxima}</InputAdornment>
                    ),
                  }}
                  inputProps={{
                    min: 0,
                    max: notaMaxima,
                    step: 0.1,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Porcentaje de logro:
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Rating
                      value={porcentajeNota / 20}
                      readOnly
                      precision={0.1}
                      size="large"
                    />
                    <Typography variant="h6" fontWeight="bold" color={
                      porcentajeNota >= 60 ? 'success.main' : 'error.main'
                    }>
                      {porcentajeNota.toFixed(1)}%
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </>
          )}

          {/* Comentarios / Retroalimentación */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label={
                formData.accion === 'calificar' || formData.accion === 'aprobar'
                  ? 'Comentarios y Retroalimentación'
                  : 'Motivo (Requerido)'
              }
              value={formData.comentarios}
              onChange={(e) => handleChange('comentarios', e.target.value)}
              error={!!errors.comentarios}
              helperText={
                errors.comentarios ||
                (formData.accion === 'calificar' || formData.accion === 'aprobar'
                  ? 'Opcional: Proporcione retroalimentación constructiva al estudiante'
                  : 'Explique la razón de su decisión')
              }
              placeholder={
                formData.accion === 'calificar'
                  ? 'Ej: Excelente trabajo, cumple con todos los objetivos...'
                  : formData.accion === 'devolver'
                  ? 'Ej: Falta completar el punto 3 del enunciado...'
                  : 'Ej: El trabajo no cumple con los requisitos mínimos...'
              }
              required={formData.accion === 'devolver' || formData.accion === 'rechazar'}
            />
          </Grid>

          {/* Advertencia según acción */}
          {formData.accion === 'aprobar' && (
            <Grid item xs={12}>
              <Alert severity="success">
                Esta entrega será marcada como <strong>APROBADA</strong> y el estudiante será
                notificado.
              </Alert>
            </Grid>
          )}

          {formData.accion === 'devolver' && (
            <Grid item xs={12}>
              <Alert severity="warning">
                Esta entrega será <strong>DEVUELTA</strong> al estudiante para correcciones. Podrá
                volver a entregarla.
              </Alert>
            </Grid>
          )}

          {formData.accion === 'rechazar' && (
            <Grid item xs={12}>
              <Alert severity="error">
                Esta entrega será <strong>RECHAZADA</strong>. El estudiante no podrá volver a
                entregarla.
              </Alert>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isPending}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color={getActionColor()}
          disabled={isPending}
        >
          {isPending ? 'Procesando...' : getActionLabel()}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
