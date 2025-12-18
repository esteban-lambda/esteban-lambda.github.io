import { useState, useEffect } from 'react';
import { Box, Typography, TextField, InputAdornment, Chip, ToggleButtonGroup, ToggleButton, Grid, Button, Container, Stack, Fade, CircularProgress, Alert, Paper } from '@mui/material';
import { Search, ViewList, CalendarMonth, Add, FilterList, TrendingUp } from '@mui/icons-material';
import { TaskCard } from '../components/TaskCard';
import { useTasks } from '../hooks/useTasks';
import { Layout, PermissionGate } from '../../../core';
import { useAuth } from '../../Usuarios';
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';

export const TasksPage = () => {
    const { isAdmin, isDocente, isEstudiante, can } = useAuth();
    const navigate = useNavigate();
    const { data: tareas, isLoading, error } = useTasks();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [viewMode, setViewMode] = useState('list');
    const [page, setPage] = useState(1);
    const TASKS_PER_PAGE = 6;

    const statusFilters = [
        { label: 'Todas', value: 'all' },
        { label: 'Pendientes', value: 'pendiente', color: 'warning' },
        { label: 'Entregadas', value: 'entregada', color: 'success' },
        { label: 'Vencidas', value: 'vencida', color: 'error' },
    ];

    // Extraer el array de tareas de la respuesta (puede ser paginada o directa)
    const tareasArray = Array.isArray(tareas) ? tareas : (tareas?.results || []);

    const filteredTasks = tareasArray.filter(task => {
        if (!task) return false;
        const matchesSearch = task.titulo?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
        const matchesStatus = filterStatus === 'all' || task.estado?.toLowerCase() === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Reiniciar página al cambiar búsqueda o filtro
    useEffect(() => { setPage(1); }, [searchQuery, filterStatus, viewMode]);

    // Paginación de tareas filtradas
    const totalPages = Math.ceil(filteredTasks.length / TASKS_PER_PAGE);
    const paginatedTasks = filteredTasks.slice((page - 1) * TASKS_PER_PAGE, page * TASKS_PER_PAGE);
    const emptySlots = TASKS_PER_PAGE - paginatedTasks.length;

    // Determinar mensaje según permisos
    const getRoleMessage = () => {
        if (can.hasPermission('academicos.calificar_entregas')) {
            return 'Gestiona las tareas de tus asignaturas, revisa entregas y califica a tus estudiantes';
        }
        if (can.hasPermission('academicos.ver_estadisticas')) {
            return 'Vista completa de todas las tareas del sistema y gestión integral';
        }
        return 'Visualiza tus tareas asignadas, realiza entregas y monitorea tus calificaciones';
    };

    if (isLoading) return (
        <Layout>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress size={60} sx={{ color: '#8b5cf6' }} />
            </Box>
        </Layout>
    );

    if (error) return (
        <Layout>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="error" gutterBottom>
                        Error al cargar las tareas
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {error.message || 'Por favor, intenta nuevamente más tarde'}
                    </Typography>
                </Box>
            </Container>
        </Layout>
    );

    const taskStats = {
        total: tareasArray.length,
        pendientes: tareasArray.filter(t => t.estado?.toLowerCase() === 'pendiente').length,
        entregadas: tareasArray.filter(t => t.estado?.toLowerCase() === 'entregada').length,
    };

    return (
        <Layout>
            <Container maxWidth="xl" sx={{ py: 2 }}>
                {/* Hero Header con diseño único */}
                <Box
                    sx={{
                        background: 'linear-gradient(165deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%)',
                        borderRadius: '24px',
                        p: 5,
                        mb: 4,
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: '-50%',
                            right: '-20%',
                            width: '600px',
                            height: '600px',
                            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
                            animation: 'pulse 8s ease-in-out infinite',
                        },
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: '-40%',
                            left: '-10%',
                            width: '500px',
                            height: '500px',
                            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%)',
                            animation: 'pulse 6s ease-in-out infinite reverse',
                        },
                        '@keyframes pulse': {
                            '0%, 100%': { transform: 'scale(1) translateY(0)', opacity: 0.3 },
                            '50%': { transform: 'scale(1.1) translateY(-20px)', opacity: 0.5 },
                        },
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 2 }}>
                        <Box sx={{ flex: 1, maxWidth: '70%' }}>
                            <Box sx={{ display: 'inline-block', mb: 2 }}>
                                <Chip
                                    label="SISTEMA ACADÉMICO"
                                    size="small"
                                    sx={{
                                        bgcolor: 'rgba(139, 92, 246, 0.2)',
                                        color: '#a78bfa',
                                        border: '1px solid rgba(167, 139, 250, 0.3)',
                                        fontWeight: 800,
                                        fontSize: '0.65rem',
                                        letterSpacing: '0.1em',
                                        height: 24,
                                    }}
                                />
                            </Box>
                            <Typography
                                variant="h2"
                                sx={{
                                    fontWeight: 900,
                                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                                    letterSpacing: '-0.03em',
                                    lineHeight: 1.1,
                                    mb: 2,
                                    background: 'linear-gradient(135deg, #ffffff 0%, #a78bfa 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                Gestión de Tareas
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.7, fontWeight: 400, mb: 4, maxWidth: 500 }}>
                                {getRoleMessage()}
                            </Typography>

                            {/* Alerta informativa según permisos */}
                            {!can.hasPermission('academicos.crear_tarea') && (
                                <Alert severity="info" sx={{ mb: 3, maxWidth: 500 }}>
                                    Consulta tus tareas pendientes y revisa tus calificaciones
                                </Alert>
                            )}
                            {can.hasPermission('academicos.crear_tarea') && (
                                <Alert severity="info" sx={{ mb: 3, maxWidth: 500 }}>
                                    Puedes crear y gestionar tareas en tus asignaturas asignadas
                                </Alert>
                            )}

                            {/* Stats Cards con diseño único */}
                            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                                <Box
                                    sx={{
                                        px: 3,
                                        py: 2,
                                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(167, 139, 250, 0.2)',
                                        borderRadius: '16px',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '2px',
                                            background: 'linear-gradient(90deg, transparent, #8b5cf6, transparent)',
                                        },
                                    }}
                                >
                                    <Typography variant="h3" fontWeight={900} color="white" sx={{ fontFamily: 'monospace' }}>
                                        {taskStats.total}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#a78bfa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                        Total
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        px: 3,
                                        py: 2,
                                        background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.15) 0%, rgba(245, 158, 11, 0.1) 100%)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(251, 146, 60, 0.3)',
                                        borderRadius: '16px',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '2px',
                                            background: 'linear-gradient(90deg, transparent, #fb923c, transparent)',
                                        },
                                    }}
                                >
                                    <Typography variant="h3" fontWeight={900} color="white" sx={{ fontFamily: 'monospace' }}>
                                        {taskStats.pendientes}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#fb923c', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                        Pendientes
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{
                                        px: 3,
                                        py: 2,
                                        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(34, 197, 94, 0.3)',
                                        borderRadius: '16px',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '2px',
                                            background: 'linear-gradient(90deg, transparent, #22c55e, transparent)',
                                        },
                                    }}
                                >
                                    <Typography variant="h3" fontWeight={900} color="white" sx={{ fontFamily: 'monospace' }}>
                                        {taskStats.entregadas}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#22c55e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                        Completadas
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>
                        
                        {/* Botón crear tarea - solo para usuarios con permiso */}
                        <PermissionGate requiredPermissions="academicos.crear_tarea">
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<Add />}
                                onClick={() => navigate('/academicos/tareas/crear')}
                                sx={{
                                    background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                                    color: 'white',
                                    borderRadius: '16px',
                                    px: 4,
                                    py: 2,
                                    fontWeight: 800,
                                    fontSize: '1rem',
                                    textTransform: 'none',
                                    boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: '-100%',
                                        width: '100%',
                                        height: '100%',
                                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                                    transition: 'left 0.5s',
                                },
                                '&:hover': {
                                    transform: 'translateY(-3px)',
                                    boxShadow: '0 15px 40px rgba(139, 92, 246, 0.5)',
                                    '&::before': {
                                        left: '100%',
                                    },
                                },
                            }}
                            >
                                Agregar Tarea
                            </Button>
                        </PermissionGate>
                    </Box>
                </Box>

                {/* Filters and Search con diseño único */}
                <Box
                    sx={{
                        p: 3,
                        mb: 4,
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
                    }}
                >
                    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
                        <TextField
                            placeholder="Buscar tareas por título, descripción..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            size="medium"
                            sx={{
                                flexGrow: 1,
                                minWidth: 300,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '14px',
                                    background: 'white',
                                    border: '2px solid transparent',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        borderColor: '#e0e7ff',
                                        boxShadow: '0 4px 16px rgba(139, 92, 246, 0.1)',
                                    },
                                    '&.Mui-focused': {
                                        borderColor: '#8b5cf6',
                                        boxShadow: '0 4px 20px rgba(139, 92, 246, 0.2)',
                                        background: 'white',
                                    },
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search sx={{ color: '#8b5cf6' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <ToggleButtonGroup
                            value={viewMode}
                            exclusive
                            onChange={(e, newView) => newView && setViewMode(newView)}
                            size="medium"
                        >
                            <ToggleButton value="list">
                                <ViewList sx={{ mr: 0.5 }} />
                                Lista
                            </ToggleButton>
                            <ToggleButton value="calendar">
                                <CalendarMonth sx={{ mr: 0.5 }} />
                                Calendario
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#64748b', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
                            Filtrar:
                        </Typography>
                        {statusFilters.map((filter) => (
                            <Chip
                                key={filter.value}
                                label={filter.label}
                                onClick={() => setFilterStatus(filter.value)}
                                sx={{
                                    fontWeight: 700,
                                    fontSize: '0.875rem',
                                    height: 36,
                                    px: 0.5,
                                    borderRadius: '12px',
                                    border: '2px solid',
                                    borderColor: filterStatus === filter.value
                                        ? filter.color === 'success' ? '#22c55e'
                                        : filter.color === 'error' ? '#ef4444'
                                        : filter.color === 'warning' ? '#f59e0b'
                                        : '#8b5cf6'
                                        : 'transparent',
                                    bgcolor: filterStatus === filter.value
                                        ? filter.color === 'success' ? 'rgba(34, 197, 94, 0.1)'
                                        : filter.color === 'error' ? 'rgba(239, 68, 68, 0.1)'
                                        : filter.color === 'warning' ? 'rgba(245, 158, 11, 0.1)'
                                        : 'rgba(139, 92, 246, 0.1)'
                                        : 'white',
                                    color: filterStatus === filter.value
                                        ? filter.color === 'success' ? '#22c55e'
                                        : filter.color === 'error' ? '#ef4444'
                                        : filter.color === 'warning' ? '#f59e0b'
                                        : '#8b5cf6'
                                        : '#64748b',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        transform: 'translateY(-2px) scale(1.05)',
                                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
                                        borderColor: filter.color === 'success' ? '#22c55e'
                                        : filter.color === 'error' ? '#ef4444'
                                        : filter.color === 'warning' ? '#f59e0b'
                                        : '#8b5cf6',
                                    },
                                }}
                            />
                        ))}
                        {filterStatus !== 'all' && (
                            <Button
                                size="small"
                                onClick={() => setFilterStatus('all')}
                                sx={{ ml: 1, fontWeight: 600 }}
                            >
                                Limpiar
                            </Button>
                        )}
                    </Box>
                </Box>

                {viewMode === 'list' && (
                    <Fade in timeout={500}>
                        <Grid container spacing={3}>
                            {paginatedTasks.map((tarea, index) => (
                                <Grid item xs={12} sm={6} md={4} key={tarea.id}>
                                    <Box
                                        sx={{
                                            minHeight: 270,
                                            maxHeight: 270,
                                            display: 'flex',
                                            alignItems: 'stretch',
                                            animation: 'fadeInUp 0.4s ease-out',
                                            animationDelay: `${index * 0.05}s`,
                                            animationFillMode: 'both',
                                            '@keyframes fadeInUp': {
                                                from: { opacity: 0, transform: 'translateY(20px)' },
                                                to: { opacity: 1, transform: 'translateY(0)' },
                                            },
                                        }}
                                    >
                                        <TaskCard tarea={tarea} />
                                    </Box>
                                </Grid>
                            ))}
                            {/* Espacios vacíos para mantener el grid */}
                            {Array.from({ length: emptySlots }).map((_, i) => (
                                <Grid item xs={12} sm={6} md={4} key={`empty-${i}`}>
                                    <Box sx={{ minHeight: 270, maxHeight: 270, opacity: 0 }} />
                                </Grid>
                            ))}
                        </Grid>
                    </Fade>
                )}

                {/* Paginación */}
                {viewMode === 'list' && totalPages > 1 && (
                    <Box display="flex" justifyContent="center" mt={4}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={(_, value) => setPage(value)}
                            color="primary"
                            size="large"
                        />
                    </Box>
                )}

                {/* Vista de calendario (placeholder) */}
                {viewMode === 'calendar' && (
                    <Box sx={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6', fontWeight: 700, fontSize: 24 }}>
                        Vista de calendario próximamente
                    </Box>
                )}

                {/* Estado vacío */}
                {filteredTasks?.length === 0 && (
                    <Paper
                        elevation={0}
                        sx={{
                            textAlign: 'center',
                            py: 10,
                            bgcolor: 'grey.50',
                            border: '2px dashed',
                            borderColor: 'divider',
                            borderRadius: 3,
                        }}
                    >
                        <Box sx={{ maxWidth: 400, mx: 'auto' }}>
                            <Typography variant="h5" fontWeight={700} gutterBottom>
                                No se encontraron tareas
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                Intenta ajustar los filtros de búsqueda o crear una nueva tarea
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                size="large"
                            >
                                Crear Primera Tarea
                            </Button>
                        </Box>
                    </Paper>
                )}
            </Container>
        </Layout>
    );
};
