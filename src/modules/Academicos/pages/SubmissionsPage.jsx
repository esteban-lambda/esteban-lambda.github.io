import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Upload as UploadIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { Layout, RoleGate } from '../../../core';
import { useMisEntregas, useEntregasPendientes } from '../hooks';
import { useAuth } from '../../Usuarios';
import { ROLES } from '../../../core/constants/roles';
import { MySubmissionsTab } from '../components/Submissions/MySubmissionsTab';
import { PendingGradingTab } from '../components/Submissions/PendingGradingTab';

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box py={3}>{children}</Box>}
  </div>
);

export const SubmissionsPage = () => {
  const navigate = useNavigate();
  const { isDocente } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);

  const { data: misEntregas, isLoading: loadingMisEntregas } = useMisEntregas();
  const { data: pendientes, isLoading: loadingPendientes } = useEntregasPendientes();

  // Extraer arrays de respuestas (pueden ser paginadas o directas)
  const misEntregasArray = Array.isArray(misEntregas) ? misEntregas : (misEntregas?.results || []);
  const pendientesArray = Array.isArray(pendientes) ? pendientes : (pendientes?.results || []);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Estadísticas para estudiantes
  const entregasAprobadas = misEntregasArray?.filter(e => e.estado === 'aprobada')?.length || 0;
  const entregasPendientes = misEntregasArray?.filter(e => e.estado === 'pendiente')?.length || 0;
  const entregasDevueltas = misEntregasArray?.filter(e => e.estado === 'devuelta')?.length || 0;

  // Estadísticas para docentes
  const totalPendientesCalificar = pendientesArray?.length || 0;

  if (loadingMisEntregas && loadingPendientes) {
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

  return (
    <Layout>
      <Container maxWidth="xl">
        <Box py={4}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Entregas
            </Typography>
            {!isDocente && (
              <Button
                variant="contained"
                startIcon={<UploadIcon />}
                onClick={() => navigate('/tareas')}
              >
                Ver Tareas Disponibles
              </Button>
            )}
          </Box>

          {/* Estadísticas */}
          <Grid container spacing={3} mb={4}>
            {!isDocente ? (
              <>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2}>
                        <CheckCircleIcon color="success" fontSize="large" />
                        <Box>
                          <Typography variant="h4" fontWeight="bold">
                            {entregasAprobadas}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Aprobadas
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2}>
                        <PendingIcon color="warning" fontSize="large" />
                        <Box>
                          <Typography variant="h4" fontWeight="bold">
                            {entregasPendientes}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Pendientes
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2}>
                        <CancelIcon color="error" fontSize="large" />
                        <Box>
                          <Typography variant="h4" fontWeight="bold">
                            {entregasDevueltas}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Devueltas
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2}>
                        <AssignmentIcon color="primary" fontSize="large" />
                        <Box>
                          <Typography variant="h4" fontWeight="bold">
                            {misEntregasArray?.length || 0}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total Entregas
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </>
            ) : (
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <PendingIcon color="warning" fontSize="large" />
                      <Box>
                        <Typography variant="h4" fontWeight="bold">
                          {totalPendientesCalificar}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Pendientes de Calificar
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>

          {/* Tabs */}
          <Paper>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="Mis Entregas" />
              {isDocente && <Tab label="Pendientes de Calificar" />}
            </Tabs>

            <TabPanel value={currentTab} index={0}>
              <MySubmissionsTab entregas={misEntregasArray || []} isDocente={isDocente} />
            </TabPanel>

            {isDocente && (
              <TabPanel value={currentTab} index={1}>
                <PendingGradingTab entregas={pendientesArray || []} />
              </TabPanel>
            )}
          </Paper>
        </Box>
      </Container>
    </Layout>
  );
};
