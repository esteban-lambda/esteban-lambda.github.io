import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  Chip,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Info as InfoIcon,
  Assignment as AssignmentIcon,
  Grade as GradeIcon,
  People as PeopleIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useAsignatura } from '../hooks';
import { Layout, RoleGate } from '../../../core';
import { useAuth } from '../../Usuarios';
import { ROLES } from '../../../core/constants/roles';
import { InfoTab } from '../components/CourseDetail/InfoTab';
import { TasksTab } from '../components/CourseDetail/TasksTab';
import { GradesTab } from '../components/CourseDetail/GradesTab';
import { StudentsTab } from '../components/CourseDetail/StudentsTab';

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`course-tabpanel-${index}`}
    aria-labelledby={`course-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

export const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);
  const { isAdmin, isDocente, isEstudiante, permissions } = useAuth();
  
  const { data: asignatura, isLoading, error } = useAsignatura(id);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleBack = () => {
    navigate('/courses');
  };

  if (isLoading) {
    return (
      <Layout>
        <Container maxWidth="xl">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress size={60} />
          </Box>
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Container maxWidth="xl">
          <Box py={4}>
            <Alert severity="error">
              Error al cargar la asignatura: {error.message}
            </Alert>
          </Box>
        </Container>
      </Layout>
    );
  }

  if (!asignatura) {
    return (
      <Layout>
        <Container maxWidth="xl">
          <Box py={4}>
            <Alert severity="warning">Asignatura no encontrada</Alert>
          </Box>
        </Container>
      </Layout>
    );
  }

  const getEstadoColor = (estado) => {
    const colors = {
      activo: 'success',
      inactivo: 'default',
      finalizado: 'info',
    };
    return colors[estado] || 'default';
  };

  return (
    <Layout>
      <Container maxWidth="xl">
        <Box py={4}>
          {/* Header */}
          <Box mb={3}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <IconButton onClick={handleBack}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h4" component="h1" fontWeight="bold">
                {asignatura.nombre}
              </Typography>
              <Chip
                label={asignatura.estado?.toUpperCase() || 'ACTIVO'}
                color={getEstadoColor(asignatura.estado)}
                size="small"
              />
              <Box flexGrow={1} />
              <Can permission="manage_tasks">
                <Tooltip title="Editar asignatura">
                  <IconButton color="primary">
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              </Can>
            </Box>

            {/* Información rápida */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Código
                    </Typography>
                    <Typography variant="h6">
                      {asignatura.codigo || 'N/A'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Créditos
                    </Typography>
                    <Typography variant="h6">
                      {asignatura.creditos || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Docente
                    </Typography>
                    <Typography variant="h6">
                      {asignatura.docente?.nombre || 'Sin asignar'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Estudiantes
                    </Typography>
                    <Typography variant="h6">
                      {asignatura.total_estudiantes || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Tabs */}
          <Paper>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab
                icon={<InfoIcon />}
                iconPosition="start"
                label="Información"
              />
              <Tab
                icon={<AssignmentIcon />}
                iconPosition="start"
                label="Tareas"
              />
              <Tab
                icon={<GradeIcon />}
                iconPosition="start"
                label="Calificaciones"
              />
              <Tab
                icon={<PeopleIcon />}
                iconPosition="start"
                label="Estudiantes"
              />
            </Tabs>

            <TabPanel value={currentTab} index={0}>
              <InfoTab asignatura={asignatura} />
            </TabPanel>

            <TabPanel value={currentTab} index={1}>
              <TasksTab asignaturaId={id} />
            </TabPanel>

            <TabPanel value={currentTab} index={2}>
              <GradesTab asignaturaId={id} />
            </TabPanel>

            <TabPanel value={currentTab} index={3}>
              <StudentsTab asignaturaId={id} />
            </TabPanel>
          </Paper>
        </Box>
      </Container>
    </Layout>
  );
};
