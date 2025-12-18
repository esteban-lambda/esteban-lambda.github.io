import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  TextField,
  InputAdornment,
  Fab,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  School,
  Refresh
} from '@mui/icons-material';
import { Layout } from '../../../core';
import { useAuth } from '../../Usuarios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { asignaturasService } from '../services/asignaturasService';
import { CourseFormDialog } from '../components/Courses/CourseFormDialog';
import { AssignTeacherDialog } from '../components/Courses/AssignTeacherDialog';
import { CourseManagementCard } from '../components/Courses/CourseManagementCard';
import { Navigate } from 'react-router-dom';

const ESTADOS_FILTER = [
  { value: '', label: 'Todos los estados' },
  { value: 'activa', label: 'Activas' },
  { value: 'inactiva', label: 'Inactivas' },
  { value: 'planificacion', label: 'En Planificación' },
  { value: 'suspendida', label: 'Suspendidas' },
];

export const CourseManagementPage = () => {
  const queryClient = useQueryClient();
  const { isAdmin, loading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Query para obtener asignaturas
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['asignaturas', searchTerm, estadoFilter],
    queryFn: () => asignaturasService.getAsignaturas({ 
      search: searchTerm,
      estado: estadoFilter 
    }),
  });

  // Query para obtener docentes
  const { data: teachers = [] } = useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      // Aquí deberías tener un endpoint para obtener usuarios con rol Docente
      const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/usuarios/?rol=Docente`);
      const data = await response.json();
      return data.results || [];
    },
  });

  // Mutation para eliminar
  const deleteMutation = useMutation({
    mutationFn: (id) => asignaturasService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['asignaturas']);
      showSnackbar('Asignatura eliminada exitosamente', 'success');
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      showSnackbar(error.response?.data?.error || 'Error al eliminar la asignatura', 'error');
    },
  });

  // Mutation para activar
  const activateMutation = useMutation({
    mutationFn: (id) => asignaturasService.activar(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['asignaturas']);
      showSnackbar('Asignatura activada exitosamente', 'success');
    },
    onError: (error) => {
      showSnackbar(error.response?.data?.error || 'Error al activar la asignatura', 'error');
    },
  });

  // Mutation para desactivar
  const deactivateMutation = useMutation({
    mutationFn: (id) => asignaturasService.desactivar(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['asignaturas']);
      showSnackbar('Asignatura desactivada exitosamente', 'success');
    },
    onError: (error) => {
      showSnackbar(error.response?.data?.error || 'Error al desactivar la asignatura', 'error');
    },
  });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Redirigir si no es admin
  if (authLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setFormDialogOpen(true);
  };

  const handleAssignTeacher = (course) => {
    setSelectedCourse(course);
    setAssignDialogOpen(true);
  };

  const handleDelete = (course) => {
    setSelectedCourse(course);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCourse) {
      deleteMutation.mutate(selectedCourse.id);
    }
  };

  const handleActivate = (course) => {
    activateMutation.mutate(course.id);
  };

  const handleDeactivate = (course) => {
    deactivateMutation.mutate(course.id);
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries(['asignaturas']);
    showSnackbar(
      selectedCourse ? 'Asignatura actualizada exitosamente' : 'Asignatura creada exitosamente',
      'success'
    );
    setSelectedCourse(null);
  };

  const handleAssignSuccess = () => {
    queryClient.invalidateQueries(['asignaturas']);
    showSnackbar('Docente asignado exitosamente', 'success');
    setSelectedCourse(null);
  };

  const courses = data?.results || data || [];

  return (
    <Layout>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          pt: 8,
          pb: 10,
          mb: 4,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                mb: 3,
                px: 3,
                py: 1,
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: 10,
              }}
            >
              <School sx={{ color: 'white', fontSize: 20 }} />
              <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                GESTIÓN ACADÉMICA
              </Typography>
            </Box>

            <Typography variant="h2" fontWeight={900} color="white" gutterBottom>
              Gestión de Asignaturas
            </Typography>

            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Crea, edita y gestiona las asignaturas del plan de estudios
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mb: 4 }}>
        {/* Filtros y Búsqueda */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Buscar por nombre o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={estadoFilter}
                  onChange={(e) => setEstadoFilter(e.target.value)}
                  label="Estado"
                >
                  {ESTADOS_FILTER.map(estado => (
                    <MenuItem key={estado.value} value={estado.value}>
                      {estado.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={() => refetch()}
                  fullWidth
                >
                  Actualizar
                </Button>
              </Box>
            </Grid>
          </Grid>

          {/* Contador */}
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Total de asignaturas:
            </Typography>
            <Chip label={courses.length} size="small" color="primary" />
          </Box>
        </Box>

        {/* Contenido */}
        {error ? (
          <Alert severity="error">
            Error al cargar las asignaturas: {error.message}
          </Alert>
        ) : isLoading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : courses.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              px: 3,
              bgcolor: 'grey.50',
              borderRadius: 2,
            }}
          >
            <School sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No hay asignaturas registradas
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Comienza creando tu primera asignatura
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setSelectedCourse(null);
                setFormDialogOpen(true);
              }}
            >
              Crear Primera Asignatura
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {courses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <CourseManagementCard
                  course={course}
                  onEdit={() => handleEdit(course)}
                  onDelete={() => handleDelete(course)}
                  onActivate={() => handleActivate(course)}
                  onDeactivate={() => handleDeactivate(course)}
                  onAssignTeacher={() => handleAssignTeacher(course)}
                  canManage={true}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Botón Flotante para Crear */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
        onClick={() => {
          setSelectedCourse(null);
          setFormDialogOpen(true);
        }}
      >
        <Add />
      </Fab>

      {/* Diálogos */}
      <CourseFormDialog
        open={formDialogOpen}
        onClose={() => {
          setFormDialogOpen(false);
          setSelectedCourse(null);
        }}
        course={selectedCourse}
        onSuccess={handleFormSuccess}
      />

      <AssignTeacherDialog
        open={assignDialogOpen}
        onClose={() => {
          setAssignDialogOpen(false);
          setSelectedCourse(null);
        }}
        course={selectedCourse}
        teachers={teachers}
        onSuccess={handleAssignSuccess}
      />

      {/* Diálogo de Confirmación de Eliminación */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar la asignatura{' '}
            <strong>{selectedCourse?.nombre}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            disabled={deleteMutation.isLoading}
          >
            {deleteMutation.isLoading ? <CircularProgress size={20} /> : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};
