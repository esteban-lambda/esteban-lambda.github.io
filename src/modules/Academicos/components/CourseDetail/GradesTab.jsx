import { useState } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    TextField,
    InputAdornment,
    Alert,
    CircularProgress,
    LinearProgress,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useGrades } from '../../hooks';

export const GradesTab = ({ asignaturaId }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const { data: grades, isLoading, error } = useGrades({ asignatura: asignaturaId });

    const filteredGrades = grades?.filter(
        (grade) =>
            grade.estudiante?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            grade.tarea?.titulo?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const getCalificacionColor = (calificacion, notaMaxima = 100) => {
        const porcentaje = (calificacion / notaMaxima) * 100;
        if (porcentaje >= 70) return 'success';
        if (porcentaje >= 50) return 'warning';
        return 'error';
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
                    Error al cargar las calificaciones: {error.message}
                </Alert>
            </Box>
        );
    }

    return (
        <Box px={3}>
            {/* Toolbar */}
            <Box mb={3}>
                <TextField
                    placeholder="Buscar por estudiante o tarea..."
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
                    fullWidth
                />
            </Box>

            {/* Tabla de calificaciones */}
            {filteredGrades.length === 0 ? (
                <Alert severity="info">No hay calificaciones disponibles</Alert>
            ) : (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Estudiante</TableCell>
                                <TableCell>Tarea</TableCell>
                                <TableCell>Calificación</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Fecha</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredGrades.map((grade) => (
                                <TableRow key={grade.id} hover>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {grade.estudiante?.nombre || 'N/A'}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {grade.estudiante?.email || ''}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {grade.tarea?.titulo || 'N/A'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box>
                                            <Typography variant="body2" fontWeight="bold">
                                                {grade.calificacion?.toFixed(2) || '0.00'} /{' '}
                                                {grade.nota_maxima || 100}
                                            </Typography>
                                            <LinearProgress
                                                variant="determinate"
                                                value={(grade.calificacion / (grade.nota_maxima || 100)) * 100}
                                                color={getCalificacionColor(grade.calificacion, grade.nota_maxima)}
                                                sx={{ mt: 0.5, height: 6, borderRadius: 1 }}
                                            />
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={grade.publicada ? 'PUBLICADA' : 'BORRADOR'}
                                            color={grade.publicada ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {grade.fecha_creacion
                                            ? new Date(grade.fecha_creacion).toLocaleDateString()
                                            : 'N/A'}
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
