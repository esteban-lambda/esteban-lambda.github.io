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
    Avatar,
    Chip,
    TextField,
    InputAdornment,
    Alert,
    CircularProgress,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Email as EmailIcon,
    RemoveCircle as RemoveCircleIcon,
} from '@mui/icons-material';
import { cursosService } from '../../services/cursosService';
import { useQuery } from '@tanstack/react-query';
import { Can } from '@/core';

export const StudentsTab = ({ asignaturaId }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const {
        data: estudiantes,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['estudiantes-asignatura', asignaturaId],
        queryFn: () => cursosService.getEstudiantes(asignaturaId),
        enabled: !!asignaturaId,
    });

    const filteredStudents = estudiantes?.filter(
        (student) =>
            student.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.codigo?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const getInitials = (nombre) => {
        if (!nombre) return '?';
        const parts = nombre.split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return nombre[0].toUpperCase();
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
                <Alert severity="error">
                    Error al cargar los estudiantes: {error.message}
                </Alert>
            </Box>
        );
    }

    return (
        <Box px={3}>
            {/* Toolbar */}
            <Box display="flex" gap={2} mb={3}>
                <TextField
                    placeholder="Buscar estudiantes..."
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
                        onClick={() => console.log('Matricular estudiante')}
                    >
                        Matricular
                    </Button>
                </Can>
            </Box>

            {/* Estadísticas rápidas */}
            <Box display="flex" gap={2} mb={3}>
                <Chip
                    label={`Total: ${filteredStudents.length}`}
                    color="primary"
                    variant="outlined"
                />
                <Chip
                    label={`Activos: ${filteredStudents.filter((s) => s.estado === 'activo').length}`}
                    color="success"
                    variant="outlined"
                />
            </Box>

            {/* Tabla de estudiantes */}
            {filteredStudents.length === 0 ? (
                <Alert severity="info">No hay estudiantes matriculados</Alert>
            ) : (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Estudiante</TableCell>
                                <TableCell>Código</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Promedio</TableCell>
                                <TableCell align="right">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredStudents.map((student) => (
                                <TableRow key={student.id} hover>
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={2}>
                                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                {getInitials(student.nombre)}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {student.nombre || 'N/A'}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {student.carrera || 'Sin carrera'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{student.codigo || 'N/A'}</TableCell>
                                    <TableCell>{student.email || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={student.estado?.toUpperCase() || 'ACTIVO'}
                                            color={student.estado === 'activo' ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="bold">
                                            {student.promedio?.toFixed(2) || '0.00'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Enviar email">
                                            <IconButton size="small" color="primary">
                                                <EmailIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Can permission="manage_tasks">
                                            <Tooltip title="Desmatricular">
                                                <IconButton size="small" color="error">
                                                    <RemoveCircleIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Can>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};
