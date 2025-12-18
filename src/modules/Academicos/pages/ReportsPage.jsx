import { useState } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  Leaderboard as LeaderboardIcon,
  Download as DownloadIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { Layout, RoleGate } from '../../../core';
import { useDashboardAnalytics, useGenerarReporte } from '../hooks';
import { useAuth } from '../../Usuarios';
import { ROLES } from '../../../core/constants/roles';
import { Navigate } from 'react-router-dom';
import { StatisticsTab } from '../components/Reports/StatisticsTab';
import { TrendsTab } from '../components/Reports/TrendsTab';
import { RankingTab } from '../components/Reports/RankingTab';

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box py={3}>{children}</Box>}
  </div>
);

export const ReportsPage = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const { permissions } = useAuth();
  const { data: analytics, isLoading, error } = useDashboardAnalytics();
  const { mutate: generarReporte, isPending: isGenerating } = useGenerarReporte();

  // Solo admins y docentes pueden ver reportes
  if (!permissions.canViewReports()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleGenerarReporte = () => {
    generarReporte({});
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
            <Alert severity="error">Error al cargar los reportes: {error.message}</Alert>
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
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                Reportes y Analytics
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Estadísticas, tendencias y análisis del rendimiento académico
              </Typography>
            </Box>
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleGenerarReporte}
                disabled={isGenerating}
              >
                {isGenerating ? 'Generando...' : 'Generar Reporte'}
              </Button>
              <Button variant="contained" startIcon={<SendIcon />}>
                Enviar Reporte
              </Button>
            </Box>
          </Box>

          {/* Resumen General */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <AssessmentIcon color="primary" fontSize="large" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Promedio General
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {analytics?.promedio_general?.toFixed(2) || '0.00'}
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
                    <TrendingUpIcon color="success" fontSize="large" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Tasa de Aprobación
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {analytics?.tasa_aprobacion?.toFixed(0) || '0'}%
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
                    <AssessmentIcon color="info" fontSize="large" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Total Estudiantes
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {analytics?.total_estudiantes || 0}
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
                    <LeaderboardIcon color="warning" fontSize="large" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Asignaturas
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {analytics?.total_asignaturas || 0}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Tabs */}
          <Paper>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab icon={<AssessmentIcon />} iconPosition="start" label="Estadísticas" />
              <Tab icon={<TrendingUpIcon />} iconPosition="start" label="Tendencias" />
              <Tab icon={<LeaderboardIcon />} iconPosition="start" label="Ranking" />
            </Tabs>

            <TabPanel value={currentTab} index={0}>
              <StatisticsTab analytics={analytics} />
            </TabPanel>

            <TabPanel value={currentTab} index={1}>
              <TrendsTab />
            </TabPanel>

            <TabPanel value={currentTab} index={2}>
              <RankingTab />
            </TabPanel>
          </Paper>
        </Box>
      </Container>
    </Layout>
  );
};
