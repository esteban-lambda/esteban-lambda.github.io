import { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    TextField,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    Grid,
    Pagination
} from '@mui/material';
import {
    Add,
    Edit,
    Delete,
    Search,
    Refresh,
    PersonAdd,
    CheckCircle,
    Cancel
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { Layout } from '../../../core';
import { asignaturasService } from '../services/asignaturasService';
import { periodosService } from '../services/periodosService';

export const SubjectsManagementPage = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [asignaturas, setAsignaturas] = useState([]);
    const [periodos, setPeriodos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [editingAsignatura, setEditingAsignatura] = useState(null);
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;
    const [formData, setFormData] = useState({
        nombre: '',
        codigo: '',
        descripcion: '',
        estado: 'planificacion',
        periodo_academico: '',
        creditos: 0,
        horas_semanales: 0,
        cupo_maximo: 30
    });
    const [errors, setErrors] = useState({});

    const estadoColors = {
        activa: 'success',
        inactiva: 'default',
        planificacion: 'warning',
        suspendida: 'error'
    };

    const estadoLabels = {
        activa: 'Activa',
        inactiva: 'Inactiva',
        planificacion: 'En Planificación',
        suspendida: 'Suspendida'
    };

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [asignaturasData, periodosData] = await Promise.all([
                asignaturasService.getAsignaturas(),
                periodosService.getPeriodos()
            ]);
            setAsignaturas(asignaturasData.results || asignaturasData);
            setPeriodos(periodosData.results || periodosData);
        } catch (error) {
            console.error('Error cargando datos:', error);
            enqueueSnackbar('Error al cargar datos', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [enqueueSnackbar]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleOpenDialog = (asignatura = null) => {
        if (asignatura) {
            setEditingAsignatura(asignatura);
            setFormData({
                nombre: asignatura.nombre,
                codigo: asignatura.codigo,
                descripcion: asignatura.descripcion || '',
                estado: asignatura.estado,
                periodo_academico: asignatura.periodo_academico?.id || '',
                creditos: asignatura.creditos,
                horas_semanales: asignatura.horas_semanales,
                cupo_maximo: asignatura.cupo_maximo
            });
        } else {
            setEditingAsignatura(null);
            setFormData({
                nombre: '',
                codigo: '',
                descripcion: '',
                estado: 'planificacion',
                periodo_academico: '',
                creditos: 0,
                horas_semanales: 0,
                cupo_maximo: 30
            });
        }
        setErrors({});
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingAsignatura(null);
        setErrors({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
        if (!formData.codigo.trim()) newErrors.codigo = 'El código es requerido';
        if (!formData.periodo_academico) newErrors.periodo_academico = 'El período académico es requerido';
        if (formData.creditos < 0) newErrors.creditos = 'Los créditos deben ser positivos';
        if (formData.horas_semanales < 0) newErrors.horas_semanales = 'Las horas deben ser positivas';
        if (formData.cupo_maximo <= 0) newErrors.cupo_maximo = 'El cupo debe ser mayor a 0';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setIsLoading(true);
        try {
            // Transformar los datos para el backend
            const dataToSend = {
                ...formData,
                periodo_academico_id: formData.periodo_academico
            };
            delete dataToSend.periodo_academico;

            if (editingAsignatura) {
                await asignaturasService.update(editingAsignatura.id, dataToSend);
                enqueueSnackbar('Asignatura actualizada exitosamente', { variant: 'success' });
            } else {
                await asignaturasService.create(dataToSend);
                enqueueSnackbar('Asignatura creada exitosamente', { variant: 'success' });
            }
            handleCloseDialog();
            loadData();
        } catch (error) {
            console.error('Error guardando asignatura:', error);
            const errorMsg = error.response?.data?.codigo?.[0] || 
                           error.response?.data?.error || 
                           'Error al guardar la asignatura';
            enqueueSnackbar(errorMsg, { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangeEstado = async (id, nuevoEstado) => {
        try {
            await asignaturasService.cambiarEstado(id, nuevoEstado);
            enqueueSnackbar('Estado actualizado', { variant: 'success' });
            loadData();
        } catch (error) {
            console.error('Error cambiando estado:', error);
            enqueueSnackbar('Error al cambiar estado', { variant: 'error' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Está seguro de eliminar esta asignatura?')) return;

        try {
            await asignaturasService.delete(id);
            enqueueSnackbar('Asignatura eliminada', { variant: 'success' });
            loadData();
        } catch (error) {
            console.error('Error eliminando asignatura:', error);
            enqueueSnackbar('Error al eliminar asignatura', { variant: 'error' });
        }
    };

    const filteredAsignaturas = asignaturas.filter(a =>
        a.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calcular paginación
    const totalPages = Math.ceil(filteredAsignaturas.length / rowsPerPage);
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedAsignaturas = filteredAsignaturas.slice(startIndex, endIndex);

    // Reset page cuando cambia la búsqueda
    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    return (
        <Layout>
            <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Gestión de Asignaturas
                </Typography>
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
                        onClick={() => handleOpenDialog()}
                        sx={{ bgcolor: '#4169FF' }}
                    >
                        Nueva Asignatura
                    </Button>
                </Box>
            </Box>

            <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
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
            </Paper>

            <TableContainer component={Paper} elevation={0}>
                <Table>
                    <TableHead sx={{ bgcolor: '#F7FAFC' }}>
                        <TableRow>
                            <TableCell><strong>Código</strong></TableCell>
                            <TableCell><strong>Nombre</strong></TableCell>
                            <TableCell><strong>Período</strong></TableCell>
                            <TableCell><strong>Docente</strong></TableCell>
                            <TableCell><strong>Créditos</strong></TableCell>
                            <TableCell><strong>Estado</strong></TableCell>
                            <TableCell align="center"><strong>Acciones</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedAsignaturas.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    <Typography color="text.secondary">
                                        No se encontraron asignaturas
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedAsignaturas.map((asignatura) => (
                            <TableRow key={asignatura.id} hover>
                                <TableCell>{asignatura.codigo}</TableCell>
                                <TableCell>{asignatura.nombre}</TableCell>
                                <TableCell>
                                    {asignatura.periodo_academico?.nombre || 'Sin período'}
                                </TableCell>
                                <TableCell>
                                    {asignatura.docente_responsable?.nombre_completo || 'Sin asignar'}
                                </TableCell>
                                <TableCell>{asignatura.creditos}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={estadoLabels[asignatura.estado]}
                                        color={estadoColors[asignatura.estado]}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        size="small"
                                        onClick={() => handleOpenDialog(asignatura)}
                                        color="primary"
                                        title="Editar"
                                    >
                                        <Edit />
                                    </IconButton>
                                    {asignatura.estado === 'planificacion' && (
                                        <IconButton
                                            size="small"
                                            onClick={() => handleChangeEstado(asignatura.id, 'activa')}
                                            color="success"
                                            title="Activar"
                                        >
                                            <CheckCircle />
                                        </IconButton>
                                    )}
                                    {asignatura.estado === 'activa' && (
                                        <IconButton
                                            size="small"
                                            onClick={() => handleChangeEstado(asignatura.id, 'inactiva')}
                                            color="warning"
                                            title="Desactivar"
                                        >
                                            <Cancel />
                                        </IconButton>
                                    )}
                                    {asignatura.estado === 'inactiva' && (
                                        <IconButton
                                            size="small"
                                            onClick={() => handleChangeEstado(asignatura.id, 'activa')}
                                            color="success"
                                            title="Activar"
                                        >
                                            <CheckCircle />
                                        </IconButton>
                                    )}
                                    {asignatura.estado === 'suspendida' && (
                                        <IconButton
                                            size="small"
                                            onClick={() => handleChangeEstado(asignatura.id, 'planificacion')}
                                            color="info"
                                            title="Volver a planificación"
                                        >
                                            <CheckCircle />
                                        </IconButton>
                                    )}
                                    <IconButton
                                        size="small"
                                        onClick={() => handleDelete(asignatura.id)}
                                        color="error"
                                        title="Eliminar"
                                    >
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            
            {/* Paginación */}
            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        shape="rounded"
                        showFirstButton
                        showLastButton
                    />
                </Box>
            )}

            {/* Dialog para crear/editar asignatura */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {editingAsignatura ? 'Editar Asignatura' : 'Nueva Asignatura'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Grid container spacing={2} sx={{ mt: 1, maxWidth: 600 }}>
                        {/* Columna izquierda */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Código"
                                name="codigo"
                                value={formData.codigo}
                                onChange={handleChange}
                                error={!!errors.codigo}
                                helperText={errors.codigo}
                                disabled={!!editingAsignatura}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                error={!!errors.nombre}
                                helperText={errors.nombre}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                select
                                label="Período Académico"
                                name="periodo_academico"
                                value={formData.periodo_academico}
                                onChange={handleChange}
                                error={!!errors.periodo_academico}
                                helperText={errors.periodo_academico}
                                sx={{ mb: 2 }}
                            >
                                {periodos.map((periodo) => (
                                    <MenuItem key={periodo.id} value={periodo.id}>
                                        {periodo.nombre}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                fullWidth
                                select
                                label="Estado"
                                name="estado"
                                value={formData.estado}
                                onChange={handleChange}
                                sx={{ mb: 2 }}
                            >
                                <MenuItem value="planificacion">En Planificación</MenuItem>
                                <MenuItem value="activa">Activa</MenuItem>
                                <MenuItem value="inactiva">Inactiva</MenuItem>
                                <MenuItem value="suspendida">Suspendida</MenuItem>
                            </TextField>
                        </Grid>
                        {/* Columna derecha */}
                        <Grid item xs={12} md={6}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Créditos"
                                        name="creditos"
                                        value={formData.creditos}
                                        onChange={handleChange}
                                        error={!!errors.creditos}
                                        helperText={errors.creditos}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Horas Semanales"
                                        name="horas_semanales"
                                        value={formData.horas_semanales}
                                        onChange={handleChange}
                                        error={!!errors.horas_semanales}
                                        helperText={errors.horas_semanales}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Cupo Máximo"
                                        name="cupo_maximo"
                                        value={formData.cupo_maximo}
                                        onChange={handleChange}
                                        error={!!errors.cupo_maximo}
                                        helperText={errors.cupo_maximo}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Descripción"
                                        name="descripcion"
                                        value={formData.descripcion}
                                        onChange={handleChange}
                                        multiline
                                        rows={5}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', maxWidth: 600, mx: 'auto' }}>
                        <Button onClick={handleCloseDialog}>Cancelar</Button>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            disabled={isLoading}
                            sx={{ bgcolor: '#4169FF', ml: 2 }}
                        >
                            {editingAsignatura ? 'Actualizar' : 'Crear'}
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
        </Container>
        </Layout>
    );
};
