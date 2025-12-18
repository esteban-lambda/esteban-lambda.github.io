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
    Chip,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Grid,
    Alert,
    Card,
    CardContent
} from '@mui/material';
import {
    Notifications,
    NotificationsActive,
    Cancel,
    Refresh,
    Add,
    Edit,
    CalendarToday,
    Assignment,
    CheckCircle,
    Error
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { Layout } from '../../../core';
import { notificacionesService } from '../services/notificacionesService';
import { tareasService } from '../services/tareasService';
import dayjs from 'dayjs';

export const NotificationsManagementPage = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [recordatorios, setRecordatorios] = useState([]);
    const [tareas, setTareas] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState({
        tarea: '',
        tipo_recordatorio: '3_dias'
    });
    const [editingId, setEditingId] = useState(null);
    const [errors, setErrors] = useState({});
    const [stats, setStats] = useState({
        pendientes: 0,
        enviados: 0,
        errores: 0
    });
    // Filtros de búsqueda
    const [search, setSearch] = useState('');
    const [filterEstado, setFilterEstado] = useState('');

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [recordatoriosData, tareasData] = await Promise.all([
                notificacionesService.getRecordatorios(),
                tareasService.getTareas({ estado: 'publicada' })
            ]);

            setRecordatorios(recordatoriosData.results || recordatoriosData);
            setTareas(tareasData.results || tareasData);

            // Calcular estadísticas
            const recs = recordatoriosData.results || recordatoriosData;
            setStats({
                pendientes: recs.filter(r => r.estado === 'pendiente').length,
                enviados: recs.filter(r => r.estado === 'enviado').length,
                errores: recs.filter(r => r.estado === 'error').length
            });
        } catch (error) {
            console.error('Error cargando datos:', error);
            enqueueSnackbar('Error al cargar notificaciones', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [enqueueSnackbar]);

    useEffect(() => {
        loadData();
    }, [loadData]);


    const handleOpenDialog = () => {
        setFormData({ tarea: '', tipo_recordatorio: '3_dias' });
        setEditingId(null);
        setErrors({});
        setOpenDialog(true);
    };

    const handleEditDialog = (recordatorio) => {
        setFormData({
            tarea: recordatorio.tarea || '',
            tipo_recordatorio: recordatorio.tipo_recordatorio || '3_dias',
        });
        setEditingId(recordatorio.id);
        setErrors({});
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFormData({ tarea: '', tipo_recordatorio: '3_dias' });
        setEditingId(null);
        setErrors({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.tarea) newErrors.tarea = 'Selecciona una tarea';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setIsLoading(true);
        try {
            if (editingId) {
                await notificacionesService.actualizarRecordatorio(editingId, formData);
                enqueueSnackbar('Recordatorio actualizado exitosamente', { variant: 'success' });
            } else {
                await notificacionesService.crearRecordatorio(formData);
                enqueueSnackbar('Recordatorio programado exitosamente', { variant: 'success' });
            }
            handleCloseDialog();
            loadData();
        } catch (error) {
            console.error('Error guardando recordatorio:', error);
            const errorMsg = error.response?.data?.error || 
                           error.response?.data?.detail ||
                           'Error al guardar recordatorio';
            enqueueSnackbar(errorMsg, { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelar = async (recordatorioId) => {
        if (!window.confirm('¿Cancelar este recordatorio?')) return;

        try {
            await notificacionesService.cancelarRecordatorio(recordatorioId);
            enqueueSnackbar('Recordatorio cancelado', { variant: 'success' });
            loadData();
        } catch (error) {
            console.error('Error cancelando recordatorio:', error);
            enqueueSnackbar('Error al cancelar recordatorio', { variant: 'error' });
        }
    };

    const estadoConfig = {
        pendiente: { label: 'Pendiente', color: 'warning', icon: <NotificationsActive /> },
        enviado: { label: 'Enviado', color: 'success', icon: <CheckCircle /> },
        cancelado: { label: 'Cancelado', color: 'default', icon: <Cancel /> },
        error: { label: 'Error', color: 'error', icon: <Error /> }
    };

    const tipoConfig = {
        '3_dias': '3 días antes',
        '1_dia': '1 día antes'
    };

    return (
        <Layout>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                            Gestión de Notificaciones
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Programa recordatorios automáticos para tareas (HU-11)
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<Refresh />}
                            onClick={loadData}
                            disabled={isLoading}
                        >
                            Actualizar
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={handleOpenDialog}
                            sx={{ bgcolor: '#4169FF' }}
                        >
                            Programar Recordatorio
                        </Button>
                    </Box>
                </Box>

            {/* Estadísticas */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <Card elevation={0} sx={{ bgcolor: '#FEF3C7', border: '1px solid #FDE68A' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <NotificationsActive sx={{ color: '#F59E0B', mr: 1 }} />
                                <Typography variant="h6" sx={{ color: '#92400E' }}>
                                    Pendientes
                                </Typography>
                            </Box>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: '#92400E' }}>
                                {stats.pendientes}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card elevation={0} sx={{ bgcolor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <CheckCircle sx={{ color: '#10B981', mr: 1 }} />
                                <Typography variant="h6" sx={{ color: '#065F46' }}>
                                    Enviados
                                </Typography>
                            </Box>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: '#065F46' }}>
                                {stats.enviados}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card elevation={0} sx={{ bgcolor: '#FEE2E2', border: '1px solid #FCA5A5' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Error sx={{ color: '#EF4444', mr: 1 }} />
                                <Typography variant="h6" sx={{ color: '#7F1D1D' }}>
                                    Errores
                                </Typography>
                            </Box>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: '#7F1D1D' }}>
                                {stats.errores}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                    Los recordatorios se envían automáticamente según la configuración. 
                    Se notifica a estudiantes que no han entregado la tarea.
                </Typography>
            </Alert>

            {/* Tabla de recordatorios */}
            <TableContainer component={Paper} elevation={0}>
                <Table>
                    <TableHead sx={{ bgcolor: '#F7FAFC' }}>
                        <TableRow>
                            <TableCell><strong>Tarea</strong></TableCell>
                            <TableCell><strong>Asignatura</strong></TableCell>
                            <TableCell><strong>Tipo</strong></TableCell>
                            <TableCell><strong>Programado para</strong></TableCell>
                            <TableCell><strong>Estado</strong></TableCell>
                            <TableCell><strong>Destinatarios</strong></TableCell>
                            <TableCell align="center"><strong>Acciones</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    {/* Filtros de búsqueda */}
                    <Box sx={{ display: 'flex', gap: 2, p: 2, alignItems: 'center' }}>
                        <TextField
                            label="Buscar por tarea o asignatura"
                            size="small"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            sx={{ minWidth: 220 }}
                        />
                        <TextField
                            label="Estado"
                            size="small"
                            select
                            value={filterEstado}
                            onChange={e => setFilterEstado(e.target.value)}
                            sx={{ minWidth: 150 }}
                        >
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value="pendiente">Pendiente</MenuItem>
                            <MenuItem value="enviado">Enviado</MenuItem>
                            <MenuItem value="cancelado">Cancelado</MenuItem>
                            <MenuItem value="error">Error</MenuItem>
                        </TextField>
                    </Box>
                    <TableBody>
                        {recordatorios
                            .filter(r => {
                                const text = `${r.tarea_titulo || ''} ${r.asignatura_nombre || ''}`.toLowerCase();
                                return text.includes(search.toLowerCase());
                            })
                            .filter(r => !filterEstado || r.estado === filterEstado)
                            .map((recordatorio) => (
                            <TableRow key={recordatorio.id} hover>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Assignment sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />
                                        <Typography variant="body2">
                                            {recordatorio.tarea_titulo || 'N/A'}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {recordatorio.asignatura_nombre || 'N/A'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {recordatorio.asignatura_codigo || ''}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={tipoConfig[recordatorio.tipo_recordatorio] || recordatorio.tipo_recordatorio}
                                        size="small"
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <CalendarToday sx={{ mr: 0.5, fontSize: 16, color: 'text.secondary' }} />
                                        <Typography variant="body2">
                                            {dayjs(recordatorio.fecha_programada).format('DD/MM/YYYY HH:mm')}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={estadoConfig[recordatorio.estado]?.label || recordatorio.estado}
                                        color={estadoConfig[recordatorio.estado]?.color || 'default'}
                                        size="small"
                                        icon={estadoConfig[recordatorio.estado]?.icon}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={`${recordatorio.destinatarios?.length || 0} destinatarios`}
                                        size="small"
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    {recordatorio.estado === 'pendiente' && (
                                        <>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEditDialog(recordatorio)}
                                                color="primary"
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleCancelar(recordatorio.id)}
                                                color="error"
                                            >
                                                <Cancel />
                                            </IconButton>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {recordatorios.length === 0 && (
                <Alert severity="info" sx={{ mt: 3 }}>
                    No hay recordatorios programados
                </Alert>
            )}

            {/* Dialog para crear recordatorio */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Notifications sx={{ mr: 1, color: '#4169FF' }} />
                        Programar Recordatorio
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Alert severity="info" sx={{ mb: 3 }}>
                            El recordatorio se enviará automáticamente a los estudiantes que no hayan entregado la tarea
                        </Alert>

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Tarea"
                                    name="tarea"
                                    value={formData.tarea}
                                    onChange={handleChange}
                                    error={!!errors.tarea}
                                    helperText={errors.tarea}
                                >
                                    {tareas.map((tarea) => (
                                        <MenuItem key={tarea.id} value={tarea.id}>
                                            {tarea.asignatura?.codigo} - {tarea.titulo}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Momento del Recordatorio"
                                    name="tipo_recordatorio"
                                    value={formData.tipo_recordatorio}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="3_dias">3 días antes del vencimiento</MenuItem>
                                    <MenuItem value="1_dia">1 día antes del vencimiento</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={isLoading}
                        sx={{ bgcolor: '#4169FF' }}
                    >
                        {isLoading ? (editingId ? 'Actualizando...' : 'Programando...') : (editingId ? 'Actualizar' : 'Programar')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
        </Layout>
    };
};
