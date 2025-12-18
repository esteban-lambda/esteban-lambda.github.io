import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Box,
  Typography,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Close as CloseIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useCreateTarea, useUpdateTarea } from '../../hooks';
import { useAsignaturas } from '../../hooks';

const TIPOS_TAREA = [
  { value: 'taller', label: 'Taller' },
  { value: 'parcial', label: 'Parcial' },
  { value: 'quiz', label: 'Quiz' },
  { value: 'proyecto', label: 'Proyecto' },
  { value: 'laboratorio', label: 'Laboratorio' },
  { value: 'exposicion', label: 'Exposición' },
  { value: 'trabajo_final', label: 'Trabajo Final' },
  { value: 'otro', label: 'Otro' },
];

export const TaskFormDialog = ({ open, onClose, task = null, asignaturaId = null }) => {
  const isEditing = !!task;
  const { mutate: createTarea, isPending: isCreating } = useCreateTarea();
  const { mutate: updateTarea, isPending: isUpdating } = useUpdateTarea();
  const { data: asignaturas } = useAsignaturas();

  // Extraer el array de asignaturas (puede ser paginado o directo)
  const asignaturasArray = Array.isArray(asignaturas) ? asignaturas : (asignaturas?.results || []);

  // Initialize form data based on task or defaults
  const getInitialFormData = () => {
    if (task) {
      return {
        titulo: task.titulo || '',
        descripcion: task.descripcion || '',
        tipo: task.tipo || 'taller',
        peso: task.peso || '',
        fecha_limite: task.fecha_limite ? task.fecha_limite.split('T')[0] : '',
        asignatura: task.asignatura || asignaturaId || '',
        archivo_adjunto: null,
      };
    }
    return {
      titulo: '',
      descripcion: '',
      tipo: 'taller',
      peso: '',
      fecha_limite: '',
      asignatura: asignaturaId || '',
      archivo_adjunto: null,
    };
  };

  const [formData, setFormData] = useState(getInitialFormData);
  const [errors, setErrors] = useState({});
  const [pesoWarning, setPesoWarning] = useState('');

  // Reset form data when dialog opens/closes or task changes
  // react-compiler-ignore
  useEffect(() => {
    if (open) {
      setFormData(getInitialFormData());
      setErrors({});
      setPesoWarning('');
    }
  }, [open, task?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es requerido';
    }
    
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }
    
    if (!formData.asignatura) {
      newErrors.asignatura = 'Debe seleccionar una asignatura';
    }
    
    const peso = parseFloat(formData.peso);
    if (!formData.peso || isNaN(peso) || peso <= 0 || peso > 100) {
      newErrors.peso = 'El peso debe ser entre 0 y 100';
    }
    
    if (!formData.fecha_limite) {
      newErrors.fecha_limite = 'La fecha límite es requerida';
    } else {
      const fechaLimite = new Date(formData.fecha_limite);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      if (fechaLimite < hoy) {
        newErrors.fecha_limite = 'La fecha límite no puede ser en el pasado';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // Check peso warning
    if (name === 'peso') {
      const peso = parseFloat(value);
      if (!isNaN(peso)) {
        if (peso > 30) {
          setPesoWarning('El peso es mayor al 30%. Verifique que sea correcto.');
        } else if (peso < 5) {
          setPesoWarning('El peso es menor al 5%. Considere ajustarlo.');
        } else {
          setPesoWarning('');
        }
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          archivo_adjunto: 'El archivo no debe superar 10MB',
        }));
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        archivo_adjunto: file,
      }));
      
      if (errors.archivo_adjunto) {
        setErrors(prev => ({
          ...prev,
          archivo_adjunto: undefined,
        }));
      }
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const dataToSubmit = new FormData();
    dataToSubmit.append('titulo', formData.titulo);
    dataToSubmit.append('descripcion', formData.descripcion);
    dataToSubmit.append('tipo', formData.tipo);
    dataToSubmit.append('peso', formData.peso);
    dataToSubmit.append('fecha_limite', formData.fecha_limite);
    dataToSubmit.append('asignatura', formData.asignatura);
    
    if (formData.archivo_adjunto) {
      dataToSubmit.append('archivo_adjunto', formData.archivo_adjunto);
    }

    if (isEditing) {
      updateTarea(
        { id: task.id, data: dataToSubmit },
        {
          onSuccess: () => {
            handleClose();
          },
        }
      );
    } else {
      createTarea(dataToSubmit, {
        onSuccess: () => {
          handleClose();
        },
      });
    }
  };

  const handleClose = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      tipo: 'taller',
      peso: '',
      fecha_limite: '',
      asignatura: asignaturaId || '',
      archivo_adjunto: null,
    });
    setErrors({});
    setPesoWarning('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {isEditing ? 'Editar Tarea' : 'Crear Nueva Tarea'}
          </Typography>
          <Button onClick={handleClose} color="inherit" size="small">
            <CloseIcon />
          </Button>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Título */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Título de la Tarea"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              error={!!errors.titulo}
              helperText={errors.titulo}
              placeholder="Ej: Taller #1 - Introducción a Python"
            />
          </Grid>

          {/* Descripción */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              multiline
              rows={4}
              label="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              error={!!errors.descripcion}
              helperText={errors.descripcion}
              placeholder="Describe los objetivos, requisitos y criterios de evaluación..."
            />
          </Grid>

          {/* Asignatura */}
          {!asignaturaId && (
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!errors.asignatura}>
                <InputLabel>Asignatura</InputLabel>
                <Select
                  name="asignatura"
                  value={formData.asignatura}
                  onChange={handleChange}
                  label="Asignatura"
                >
                  {asignaturasArray?.map((asig) => (
                    <MenuItem key={asig.id} value={asig.id}>
                      {asig.codigo} - {asig.nombre}
                    </MenuItem>
                  ))}
                </Select>
                {errors.asignatura && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                    {errors.asignatura}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          )}

          {/* Tipo */}
          <Grid item xs={12} md={asignaturaId ? 6 : 6}>
            <FormControl fullWidth required>
              <InputLabel>Tipo de Tarea</InputLabel>
              <Select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                label="Tipo de Tarea"
              >
                {TIPOS_TAREA.map((tipo) => (
                  <MenuItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Peso */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              type="number"
              label="Peso"
              name="peso"
              value={formData.peso}
              onChange={handleChange}
              error={!!errors.peso}
              helperText={errors.peso}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              inputProps={{ min: 0, max: 100, step: 0.1 }}
            />
            {pesoWarning && (
              <Alert severity="warning" icon={<WarningIcon />} sx={{ mt: 1 }}>
                {pesoWarning}
              </Alert>
            )}
          </Grid>

          {/* Fecha Límite */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              type="date"
              label="Fecha Límite"
              name="fecha_limite"
              value={formData.fecha_limite}
              onChange={handleChange}
              error={!!errors.fecha_limite}
              helperText={errors.fecha_limite}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          {/* Archivo Adjunto */}
          <Grid item xs={12}>
            <Box>
              <input
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar"
                style={{ display: 'none' }}
                id="archivo-adjunto"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="archivo-adjunto">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<UploadIcon />}
                  fullWidth
                >
                  {formData.archivo_adjunto
                    ? formData.archivo_adjunto.name
                    : 'Adjuntar Archivo (Opcional)'}
                </Button>
              </label>
              {errors.archivo_adjunto && (
                <Typography variant="caption" color="error" display="block" sx={{ mt: 0.5 }}>
                  {errors.archivo_adjunto}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                Formatos permitidos: PDF, Word, Excel, PowerPoint, ZIP, RAR (Máx. 10MB)
              </Typography>
            </Box>
          </Grid>

          {/* Info adicional */}
          {isEditing && task?.estado && (
            <Grid item xs={12}>
              <Alert severity="info">
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2">
                    Estado actual:
                  </Typography>
                  <Chip
                    label={task.estado.toUpperCase()}
                    size="small"
                    color={task.estado === 'publicada' ? 'success' : 'default'}
                  />
                </Box>
              </Alert>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isCreating || isUpdating}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isCreating || isUpdating}
        >
          {isCreating || isUpdating
            ? 'Guardando...'
            : isEditing
            ? 'Actualizar'
            : 'Crear Tarea'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
