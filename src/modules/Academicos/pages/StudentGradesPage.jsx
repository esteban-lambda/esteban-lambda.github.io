import { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Card,
    CardContent,
    Grid,
    LinearProgress,
    Chip,
    MenuItem,
    TextField,
    IconButton,
    Collapse,
    Alert
} from '@mui/material';
import {
    ExpandMore,
    ExpandLess,
    TrendingUp,
    School,
    AssignmentTurnedIn,
    EmojiEvents
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { notasService } from '../services/notasService';
import { asignaturasService } from '../services/asignaturasService';

export const StudentGradesPage = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [isLoading, setIsLoading] = useState(false);
    const [progresoData, setProgresoData] = useState(null);
    const [asignaturas, setAsignaturas] = useState([]);
    const [selectedAsignatura, setSelectedAsignatura] = useState('todas');
    const [expandedAsignatura, setExpandedAsignatura] = useState(null);
    const [desgloses, setDesgloses] = useState({});

    useEffect(() => {
        loadData();
    }, [loadData]);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [progresoResponse, asignaturasResponse] = await Promise.all([
                notasService.getMiProgreso(),
                asignaturasService.getMisAsignaturas()
            ]);
            
            setProgresoData(progresoResponse);
            setAsignaturas(asignaturasResponse.results || asignaturasResponse);
        } catch (error) {
            console.error('Error cargando datos:', error);
            enqueueSnackbar('Error al cargar las calificaciones', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [enqueueSnackbar]);

    const handleExpandAsignatura = async (notaAcumuladaId) => {
        if (expandedAsignatura === notaAcumuladaId) {
            setExpandedAsignatura(null);
            return;
        }

        setExpandedAsignatura(notaAcumuladaId);

        // Si ya tenemos el desglose, no lo volvemos a cargar
        if (desgloses[notaAcumuladaId]) return;

        try {
            const desglose = await notasService.getDesglose(notaAcumuladaId);
            setDesgloses(prev => ({
                ...prev,
                [notaAcumuladaId]: desglose
            }));
        } catch (error) {
            console.error('Error cargando desglose:', error);
            enqueueSnackbar('Error al cargar el detalle de calificaciones', { variant: 'error' });
        }
    };

    const getColorByNota = (nota) => {
        const notaNum = parseFloat(nota);
        if (notaNum >= 90) return '#10B981'; // Verde
        if (notaNum >= 80) return '#3B82F6'; // Azul
        if (notaNum >= 70) return '#F59E0B'; // Amarillo
        if (notaNum >= 60) return '#F97316'; // Naranja
        return '#EF4444'; // Rojo
    };

    const getChipColorByNota = (nota) => {
        const notaNum = parseFloat(nota);
        if (notaNum >= 90) return 'success';
        if (notaNum >= 80) return 'info';
        if (notaNum >= 70) return 'warning';
        return 'error';
    };

    const asignaturasFiltered = selectedAsignatura === 'todas'
        ? progresoData?.asignaturas || []
        : (progresoData?.asignaturas || []).filter(a => a.asignatura.id === parseInt(selectedAsignatura));

    if (isLoading) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <LinearProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
                Mis Calificaciones
            </Typography>

            {/* Resumen General */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <Card elevation={0} sx={{ bgcolor: '#F0F9FF', border: '1px solid #BFDBFE' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <School sx={{ color: '#3B82F6', mr: 1 }} />
                                <Typography variant="h6" sx={{ color: '#1E40AF' }}>
                                    Asignaturas Cursando
                                </Typography>
                            </Box>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: '#1E40AF' }}>
                                {progresoData?.total_asignaturas || 0}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card elevation={0} sx={{ bgcolor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <TrendingUp sx={{ color: '#10B981', mr: 1 }} />
                                <Typography variant="h6" sx={{ color: '#065F46' }}>
                                    Promedio General
                                </Typography>
                            </Box>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: '#065F46' }}>
                                {parseFloat(progresoData?.promedio_general || 0).toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card elevation={0} sx={{ bgcolor: '#FEF3C7', border: '1px solid #FDE68A' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <EmojiEvents sx={{ color: '#F59E0B', mr: 1 }} />
                                <Typography variant="h6" sx={{ color: '#92400E' }}>
                                    Estado Académico
                                </Typography>
                            </Box>
                            <Chip
                                label={parseFloat(progresoData?.promedio_general || 0) >= 70 ? 'Satisfactorio' : 'Requiere Atención'}
                                color={parseFloat(progresoData?.promedio_general || 0) >= 70 ? 'success' : 'warning'}
                                sx={{ fontWeight: 600 }}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Filtro por asignatura */}
            <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
                <TextField
                    select
                    label="Filtrar por Asignatura"
                    value={selectedAsignatura}
                    onChange={(e) => setSelectedAsignatura(e.target.value)}
                    sx={{ minWidth: 300 }}
                >
                    <MenuItem value="todas">Todas las asignaturas</MenuItem>
                    {asignaturas.map((asignatura) => (
                        <MenuItem key={asignatura.id} value={asignatura.id}>
                            {asignatura.nombre}
                        </MenuItem>
                    ))}
                </TextField>
            </Paper>

            {/* Tabla de calificaciones */}
            <TableContainer component={Paper} elevation={0}>
                <Table>
                    <TableHead sx={{ bgcolor: '#F7FAFC' }}>
                        <TableRow>
                            <TableCell><strong>Asignatura</strong></TableCell>
                            <TableCell><strong>Período</strong></TableCell>
                            <TableCell align="center"><strong>Progreso</strong></TableCell>
                            <TableCell align="center"><strong>Nota Actual</strong></TableCell>
                            <TableCell align="center"><strong>Estado</strong></TableCell>
                            <TableCell align="center"><strong>Detalle</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {asignaturasFiltered.map((notaAcumulada) => (
                            <>
                                <TableRow key={notaAcumulada.id} hover>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {notaAcumulada.asignatura.nombre}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {notaAcumulada.asignatura.codigo}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {notaAcumulada.periodo_academico?.nombre || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={parseFloat(notaAcumulada.peso_completado)}
                                                sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                                            />
                                            <Typography variant="caption">
                                                {parseFloat(notaAcumulada.peso_completado).toFixed(0)}%
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={parseFloat(notaAcumulada.nota_actual).toFixed(2)}
                                            color={getChipColorByNota(notaAcumulada.nota_actual)}
                                            sx={{ fontWeight: 700, minWidth: 70 }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={parseFloat(notaAcumulada.nota_actual) >= 70 ? 'Aprobado' : 'En Progreso'}
                                            size="small"
                                            color={parseFloat(notaAcumulada.nota_actual) >= 70 ? 'success' : 'default'}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleExpandAsignatura(notaAcumulada.id)}
                                        >
                                            {expandedAsignatura === notaAcumulada.id ? <ExpandLess /> : <ExpandMore />}
                                        </IconButton>
                                    </TableCell>
                                </TableRow>

                                {/* Desglose expandible */}
                                <TableRow>
                                    <TableCell colSpan={6} sx={{ py: 0, borderBottom: expandedAsignatura === notaAcumulada.id ? 1 : 0 }}>
                                        <Collapse in={expandedAsignatura === notaAcumulada.id} timeout="auto" unmountOnExit>
                                            <Box sx={{ py: 3, px: 2, bgcolor: '#FAFBFC' }}>
                                                {desgloses[notaAcumulada.id] ? (
                                                    <>
                                                        <Typography variant="h6" sx={{ mb: 2 }}>
                                                            Desglose de Calificaciones
                                                        </Typography>
                                                        <Table size="small">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell>Tarea</TableCell>
                                                                    <TableCell>Tipo</TableCell>
                                                                    <TableCell align="center">Calificación</TableCell>
                                                                    <TableCell align="center">Peso</TableCell>
                                                                    <TableCell align="center">Contribución</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {desgloses[notaAcumulada.id].calificaciones?.map((cal, idx) => (
                                                                    <TableRow key={idx}>
                                                                        <TableCell>{cal.tarea}</TableCell>
                                                                        <TableCell>
                                                                            <Chip label={cal.tipo} size="small" />
                                                                        </TableCell>
                                                                        <TableCell align="center">
                                                                            {parseFloat(cal.calificacion).toFixed(2)}
                                                                        </TableCell>
                                                                        <TableCell align="center">{cal.peso}%</TableCell>
                                                                        <TableCell align="center">
                                                                            <Typography sx={{ color: getColorByNota(cal.contribucion), fontWeight: 600 }}>
                                                                                {parseFloat(cal.contribucion).toFixed(2)}
                                                                            </Typography>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </>
                                                ) : (
                                                    <Alert severity="info">
                                                        Cargando desglose...
                                                    </Alert>
                                                )}
                                            </Box>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {asignaturasFiltered.length === 0 && (
                <Alert severity="info" sx={{ mt: 3 }}>
                    No tienes calificaciones registradas aún.
                </Alert>
            )}
        </Container>
    );
};
