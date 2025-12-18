import { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { PermissionGate } from '../../../core/components/PermissionGate';
import { cursosService } from '../services/cursosService';

export const CreateTaskPage = () => {
  const [openModal, setOpenModal] = useState(true);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await cursosService.getCursos();
      setCourses(data || []);
    } catch (error) {
      console.error('Error al cargar asignaturas:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    navigate('/tareas');
  };

  const handleTaskCreated = () => {
    setOpenModal(false);
    navigate('/tareas');
  };

  return (
    <PermissionGate requiredPermissions="academicos.crear_tarea">
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/tareas')}
            sx={{ mb: 2, color: '#4A5568' }}
          >
            Volver a Tareas
          </Button>
          <Typography variant="h4" fontWeight={700} sx={{ color: '#1A202C', mb: 1 }}>
            Nueva Tarea
          </Typography>
          <Typography variant="body1" sx={{ color: '#718096' }}>
            Crea una nueva tarea para tus estudiantes
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 2,
            border: '1px solid #E2E8F0',
            bgcolor: '#FFFFFF',
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" sx={{ color: '#4A5568', mb: 2 }}>
            Completa el formulario para crear una nueva tarea
          </Typography>
          <Typography variant="body2" sx={{ color: '#718096', mb: 3 }}>
            La tarea será visible para los estudiantes una vez creada
          </Typography>
        </Paper>

        <CreateTaskModal
          open={openModal}
          onClose={handleCloseModal}
          onTaskCreated={handleTaskCreated}
          courses={courses}
          loading={loading}
        />
      </Container>
    </PermissionGate>
  );
};
