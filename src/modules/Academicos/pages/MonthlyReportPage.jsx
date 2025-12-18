import { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    LinearProgress,
    Divider,
    Alert
} from '@mui/material';
import {
    TrendingUp,
    TrendingDown,
    School,
    Assignment,
    CheckCircle,
    Warning,
    PersonOutline,
    CalendarToday,
    Refresh,
    Email
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { Layout } from '../../../core';
import { notificacionesService } from '../services/notificacionesService';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

export const MonthlyReportPage = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [reporte, setReporte] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const loadReporte = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await notificacionesService.getUltimoReporte();
            setReporte(data);
        } catch (error) {
            console.error('Error cargando reporte:', error);
            if (error.response?.status !== 404) {
                enqueueSnackbar('Error al cargar reporte', { variant: 'error' });
            }
        } finally {
            setIsLoading(false);
        }
    }, [enqueueSnackbar]);

    useEffect(() => {
        loadReporte();
    }, [loadReporte]);

    const handleGenerarReporte = async () => {
        setIsGenerating(true);
        try {
            await notificacionesService.generarReporteMensual(null, null, null);
            enqueueSnackbar('Reporte en proceso de generación', { variant: 'success' });
            setTimeout(() => loadReporte(), 3000);
        } catch (error) {
            console.error('Error generando reporte:', error);
            enqueueSnackbar(error.response?.data?.error || 'Error al generar reporte', { variant: 'error' });
        } finally {
            setIsGenerating(false);
        }
    };

    if (isLoading) {
        return (
            <Layout>
                <Container maxWidth="xl" sx={{ py: 4 }}>
                    <LinearProgress />
                </Container>
            </Layout>
        );
    }

    const getColorByTasa = (tasa) => {
        if (tasa >= 80) return '#10B981';
        if (tasa >= 60) return '#F59E0B';
        return '#EF4444';
    };

    return (
        <Layout>
            <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        Reporte Académico Mensual 
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={loadReporte}
                        disabled={isLoading}
                    >
                        Actualizar
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Email />}
                        onClick={handleGenerarReporte}
                        disabled={isGenerating}
                        sx={{ bgcolor: '#4169FF' }}
                    >
                        {isGenerating ? 'Generando...' : 'Generar Reporte'}
                    </Button>
                </Box>
            </Box>

            {!reporte ? (
                <Alert severity="info">
                    <Typography variant="body2">
                        No hay reportes generados aún. Los reportes se generan automáticamente el primer día de cada mes 
                        o puedes generar uno manualmente.
                    </Typography>
                </Alert>
            ) : (
                <>
                    {/* Encabezado del reporte */}
                    <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                                    Reporte de {dayjs().month(reporte.mes - 1).format('MMMM')} {reporte.anio}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    <Typography variant="body2" color="text.secondary">
                                        Generado: {dayjs(reporte.fecha_generacion).format('DD/MM/YYYY HH:mm')}
                                    </Typography>
                                </Box>
                            </Box>
                            <Chip
                                label={reporte.estado === 'completado' ? 'Completado' : reporte.estado}
                                color={reporte.estado === 'completado' ? 'success' : 'warning'}
                            />
                        </Box>
                    </Paper>

                    {/* KPIs Principales */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={3}>
                            <Card elevation={0} sx={{ bgcolor: '#F0F9FF', border: '1px solid #BFDBFE' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <PersonOutline sx={{ color: '#3B82F6', mr: 1 }} />
                                        <Typography variant="body2" sx={{ color: '#1E40AF', fontWeight: 600 }}>
                                            Estudiantes
                                        </Typography>
                                    </Box>
                                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#1E40AF' }}>
                                        {reporte.total_estudiantes}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Card elevation={0} sx={{ bgcolor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <School sx={{ color: '#10B981', mr: 1 }} />
                                        <Typography variant="body2" sx={{ color: '#065F46', fontWeight: 600 }}>
                                            Asignaturas
                                        </Typography>
                                    </Box>
                                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#065F46' }}>
                                        {reporte.total_asignaturas}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Card elevation={0} sx={{ bgcolor: '#FEF3C7', border: '1px solid #FDE68A' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Assignment sx={{ color: '#F59E0B', mr: 1 }} />
                                        <Typography variant="body2" sx={{ color: '#92400E', fontWeight: 600 }}>
                                            Tareas Publicadas
                                        </Typography>
                                    </Box>
                                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#92400E' }}>
                                        {reporte.total_tareas_publicadas}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Card elevation={0} sx={{ bgcolor: '#ECFDF5', border: '1px solid #6EE7B7' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <CheckCircle sx={{ color: '#059669', mr: 1 }} />
                                        <Typography variant="body2" sx={{ color: '#064E3B', fontWeight: 600 }}>
                                            Entregas
                                        </Typography>
                                    </Box>
                                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#064E3B' }}>
                                        {reporte.total_entregas}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Métricas de Rendimiento */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} md={6}>
                            <Paper elevation={0} sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                    Promedio General del Campus
                                </Typography>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h2" sx={{ fontWeight: 700, color: '#4169FF', mb: 1 }}>
                                        {parseFloat(reporte.promedio_general_campus).toFixed(2)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        de 100 puntos posibles
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper elevation={0} sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                                    Tasa de Aprobación
                                </Typography>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>
                                        <Typography
                                            variant="h2"
                                            sx={{
                                                fontWeight: 700,
                                                color: getColorByTasa(parseFloat(reporte.tasa_aprobacion_general))
                                            }}
                                        >
                                            {parseFloat(reporte.tasa_aprobacion_general).toFixed(1)}%
                                        </Typography>
                                        {parseFloat(reporte.tasa_aprobacion_general) >= 70 ? (
                                            <TrendingUp sx={{ fontSize: 40, color: '#10B981', ml: 1 }} />
                                        ) : (
                                            <TrendingDown sx={{ fontSize: 40, color: '#EF4444', ml: 1 }} />
                                        )}
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        estudiantes aprobando (≥70 puntos)
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* Asignaturas con Mayor Reprobación */}
                    {reporte.asignaturas_mayor_reprobacion?.length > 0 && (
                        <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Warning sx={{ color: '#F59E0B', mr: 1 }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Asignaturas que Requieren Atención
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><strong>Asignatura</strong></TableCell>
                                            <TableCell align="center"><strong>Promedio</strong></TableCell>
                                            <TableCell align="center"><strong>Tasa Reprobación</strong></TableCell>
                                            <TableCell align="center"><strong>Estudiantes</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {reporte.asignaturas_mayor_reprobacion.map((asig, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>{asig.nombre}</TableCell>
                                                <TableCell align="center">
                                                    <Chip
                                                        label={parseFloat(asig.promedio).toFixed(2)}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: getColorByTasa(parseFloat(asig.promedio)),
                                                            color: 'white',
                                                            fontWeight: 600
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="body2" color="error">
                                                        {parseFloat(asig.tasa_reprobacion).toFixed(1)}%
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">{asig.total_estudiantes}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    )}

                    {/* Docentes Destacados */}
                    {reporte.docentes_mejor_promedio?.length > 0 && (
                        <Paper elevation={0} sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <TrendingUp sx={{ color: '#10B981', mr: 1 }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Docentes con Mejor Desempeño
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><strong>Docente</strong></TableCell>
                                            <TableCell><strong>Asignaturas</strong></TableCell>
                                            <TableCell align="center"><strong>Promedio Estudiantes</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {reporte.docentes_mejor_promedio.map((docente, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>{docente.nombre}</TableCell>
                                                <TableCell>{docente.asignaturas?.join(', ')}</TableCell>
                                                <TableCell align="center">
                                                    <Chip
                                                        label={parseFloat(docente.promedio).toFixed(2)}
                                                        size="small"
                                                        color="success"
                                                        sx={{ fontWeight: 600 }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    )}

                    {/* Información de envío */}
                    {reporte.enviado_a?.length > 0 && (
                        <Alert severity="success" sx={{ mt: 3 }}>
                            <Typography variant="body2">
                                <strong>Notificación enviada a:</strong> {reporte.enviado_a.join(', ')}
                            </Typography>
                        </Alert>
                    )}
                </>
            )}
        </Container>
        </Layout>
    );
};
