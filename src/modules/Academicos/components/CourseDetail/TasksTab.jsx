import { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    TextField,
    InputAdornment,
    Alert,
    CircularProgress,
} from '@mui/material';
import {
    Add as AddIcon,
    MoreVert as MoreVertIcon,
    Search as SearchIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Publish as PublishIcon,
    CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useTasks, usePublicarTarea, useCerrarTarea, useDeleteTarea } from '../../hooks';
import { Can } from '@/core';
import { TaskFormDialog } from '../Tasks/TaskFormDialog';

export const TasksTab = ({ asignaturaId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);

    const { mutate: publicarTarea } = usePublicarTarea();
    const { mutate: cerrarTarea } = useCerrarTarea();
    const { mutate: deleteTarea } = useDeleteTarea();

    const { data: tasks, isLoading, error } = useTasks({ asignatura: asignaturaId });

    const handleMenuOpen = (event, task) => {
        setAnchorEl(event.currentTarget);
        setSelectedTask(task);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedTask(null);
    };

    const handleCreateTask = () => {
        setTaskToEdit(null);
        setDialogOpen(true);
    };

    const handleEditTask = (task) => {
        setTaskToEdit(task);
        setDialogOpen(true);
        handleMenuClose();
    };

    const handlePublicarTask = (task) => {
        publicarTarea(task.id);
        handleMenuClose();
    };

    const handleCerrarTask = (task) => {
        cerrarTarea(task.id);
        handleMenuClose();
    };

    const handleDeleteTask = (task) => {
        if (window.confirm(`¿Está seguro de eliminar la tarea "${task.titulo}"?`)) {
            deleteTarea(task.id);
        }
        handleMenuClose();
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setTaskToEdit(null);
    };

    const filteredTasks = tasks?.filter(
        (task) =>
            task.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const getEstadoColor = (estado) => {
        const colors = {
            borrador: 'default',
            publicada: 'success',
            cerrada: 'error',
        };
        return colors[estado] || 'default';
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box px={3}>
                <Alert severity="error">Error al cargar las tareas: {error.message}</Alert>
            </Box>
        );
    }

    return (
        <Box px={3}>
            {/* Toolbar */}
            <Box display="flex" gap={2} mb={3}>
                <TextField
                    placeholder="Buscar tareas..."
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ flexGrow: 1 }}
                />
                <Can permission="manage_tasks">
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreateTask}
                    >
                        Nueva Tarea
                    </Button>
                </Can>
            </Box>

            {/* Tabla de tareas */}
            {filteredTasks.length === 0 ? (
                <Alert severity="info">No hay tareas disponibles</Alert>
            ) : (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Título</TableCell>
                                <TableCell>Tipo</TableCell>
                                <TableCell>Peso (%)</TableCell>
                                <TableCell>Fecha de entrega</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Entregas</TableCell>
                                <TableCell align="right">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredTasks.map((task) => (
                                <TableRow key={task.id} hover>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="medium">
                                            {task.titulo}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {task.descripcion?.substring(0, 50)}
                                            {task.descripcion?.length > 50 ? '...' : ''}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={task.tipo || 'N/A'} size="small" />
                                    </TableCell>
                                    <TableCell>{task.peso || 0}%</TableCell>
                                    <TableCell>
                                        {task.fecha_entrega
                                            ? new Date(task.fecha_entrega).toLocaleDateString()
                                            : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={task.estado?.toUpperCase() || 'BORRADOR'}
                                            color={getEstadoColor(task.estado)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={`${task.total_entregas || 0} / ${task.total_estudiantes || 0}`}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Can permission="manage_tasks">
                                            <IconButton
                                                size="small"
                                                onClick={(e) => handleMenuOpen(e, task)}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                        </Can>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Menu contextual */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => handleEditTask(selectedTask)}>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} />
                    Editar
                </MenuItem>
                {selectedTask?.estado === 'borrador' && (
                    <MenuItem onClick={() => handlePublicarTask(selectedTask)}>
                        <PublishIcon fontSize="small" sx={{ mr: 1 }} />
                        Publicar
                    </MenuItem>
                )}
                {selectedTask?.estado === 'publicada' && (
                    <MenuItem onClick={() => handleCerrarTask(selectedTask)}>
                        <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} />
                        Cerrar
                    </MenuItem>
                )}
                <MenuItem onClick={() => handleDeleteTask(selectedTask)} sx={{ color: 'error.main' }}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    Eliminar
                </MenuItem>
            </Menu>

            {/* Dialog para crear/editar tarea */}
            <TaskFormDialog
                open={dialogOpen}
                onClose={handleDialogClose}
                task={taskToEdit}
                asignaturaId={asignaturaId}
            />
        </Box>
    );
};
