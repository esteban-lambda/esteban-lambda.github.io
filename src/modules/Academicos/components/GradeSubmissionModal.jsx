import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    Alert,
    Chip,
    Divider,
    Rating,
    InputAdornment
} from '@mui/material';
import { Person, Assignment, CalendarToday, Grade } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { entregasService } from '../services/entregasService';
import dayjs from 'dayjs';

export const GradeSubmissionModal = ({ open, onClose, entrega, onSuccess }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        calificacion: '',
        comentarios: ''
    });
    const [errors, setErrors] = useState({});

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
        
        const calificacion = parseFloat(formData.calificacion);
        if (!formData.calificacion) {
            newErrors.calificacion = 'La calificación es requerida';
        } else if (isNaN(calificacion)) {
            newErrors.calificacion = 'Debe ser un número válido';
        } else if (calificacion < 0) {
            newErrors.calificacion = 'La calificación no puede ser negativa';
        } else if (entrega?.tarea?.nota_maxima && calificacion > parseFloat(entrega.tarea.nota_maxima)) {
            newErrors.calificacion = `No puede exceder la nota máxima (${entrega.tarea.nota_maxima})`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setIsLoading(true);
        try {
            await entregasService.calificar(entrega.id, {
                calificacion: parseFloat(formData.calificacion),
                comentarios: formData.comentarios
            });

            enqueueSnackbar('Entrega calificada exitosamente', { variant: 'success' });
            handleClose();
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Error calificando entrega:', error);
            const errorMsg = error.response?.data?.error || 
                           error.response?.data?.calificacion?.[0] ||
                           'Error al calificar la entrega';
            enqueueSnackbar(errorMsg, { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ calificacion: '', comentarios: '' });
        setErrors({});
        onClose();
    };

    if (!entrega) return null;

    const calcularNotaPonderada = () => {
        if (!formData.calificacion || !entrega.tarea) return 0;
        const calificacion = parseFloat(formData.calificacion);
        const notaMaxima = parseFloat(entrega.tarea.nota_maxima);
        const peso = parseFloat(entrega.tarea.peso_porcentual);
        
        if (notaMaxima === 0) return 0;
        
        // Normalizar a 100 y aplicar peso
        const notaPonderada = (calificacion / notaMaxima) * (peso / 100) * 100;
        return notaPonderada.toFixed(2);
    };

    const esEntregaTardia = () => {
        if (!entrega.fecha_entrega || !entrega.tarea?.fecha_vencimiento) return false;
        return dayjs(entrega.fecha_entrega).isAfter(dayjs(entrega.tarea.fecha_vencimiento));
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>Calificar Entrega</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    {/* Información de la entrega */}
                    <Box sx={{ mb: 3, p: 2, bgcolor: '#F7FAFC', borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Person sx={{ mr: 1, color: '#4169FF' }} />
                            <Typography variant="body1">
                                <strong>Estudiante:</strong> {entrega.estudiante?.nombre_completo || entrega.estudiante?.username}
                            </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Assignment sx={{ mr: 1, color: '#4169FF' }} />
                            <Typography variant="body1">
                                <strong>Tarea:</strong> {entrega.tarea?.titulo}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <CalendarToday sx={{ mr: 1, color: '#4169FF' }} />
                            <Typography variant="body1">
                                <strong>Fecha de entrega:</strong> {dayjs(entrega.fecha_entrega).format('DD/MM/YYYY HH:mm')}
                            </Typography>
                            {esEntregaTardia() && (
                                <Chip 
                                    label="Entrega Tardía" 
                                    color="warning" 
                                    size="small" 
                                    sx={{ ml: 2 }}
                                />
                            )}
                        </Box>

                        {entrega.comentario_estudiante && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                    <strong>Comentario del estudiante:</strong>
                                </Typography>
                                <Typography variant="body2" sx={{ p: 1.5, bgcolor: 'white', borderRadius: 1 }}>
                                    {entrega.comentario_estudiante}
                                </Typography>
                            </Box>
                        )}

                        {entrega.archivo_adjunto && (
                            <Box sx={{ mt: 2 }}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    href={entrega.archivo_adjunto}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Ver archivo adjunto
                                </Button>
                            </Box>
                        )}
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Información de calificación */}
                    <Alert severity="info" sx={{ mb: 3 }}>
                        <Typography variant="body2">
                            <strong>Nota máxima:</strong> {entrega.tarea?.nota_maxima || 100}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Peso porcentual:</strong> {entrega.tarea?.peso_porcentual}%
                        </Typography>
                        {esEntregaTardia() && entrega.tarea?.penalizacion_tardia > 0 && (
                            <Typography variant="body2" color="warning.main">
                                <strong>Penalización por tardanza:</strong> {entrega.tarea.penalizacion_tardia}%
                            </Typography>
                        )}
                    </Alert>

                    {/* Formulario de calificación */}
                    <TextField
                        fullWidth
                        label="Calificación"
                        name="calificacion"
                        type="number"
                        value={formData.calificacion}
                        onChange={handleChange}
                        error={!!errors.calificacion}
                        helperText={errors.calificacion || `Máximo: ${entrega.tarea?.nota_maxima || 100}`}
                        sx={{ mb: 3 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Grade />
                                </InputAdornment>
                            ),
                        }}
                        inputProps={{
                            step: "0.01",
                            min: "0",
                            max: entrega.tarea?.nota_maxima || 100
                        }}
                    />

                    {formData.calificacion && (
                        <Alert severity="success" sx={{ mb: 3 }}>
                            <Typography variant="body2">
                                <strong>Nota ponderada (contribución a nota final):</strong> {calcularNotaPonderada()}
                            </Typography>
                        </Alert>
                    )}

                    <TextField
                        fullWidth
                        label="Comentarios"
                        name="comentarios"
                        value={formData.comentarios}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        placeholder="Retroalimentación para el estudiante (opcional)..."
                        helperText="Proporciona retroalimentación constructiva"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={isLoading}
                    sx={{ bgcolor: '#4169FF' }}
                >
                    {isLoading ? 'Calificando...' : 'Calificar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
