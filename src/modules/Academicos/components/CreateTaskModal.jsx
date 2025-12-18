import { useState, useEffect, useCallback } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Grid,
    Alert,
    Box,
    Typography,
    InputAdornment
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';
import { tareasService } from '../services/tareasService';

export const CreateTaskModal = ({ open, onClose, asignaturaId, onSuccess }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [isLoading, setIsLoading] = useState(false);
    const [pesoDisponible, setPesoDisponible] = useState(100);
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        tipo_tarea: 'tarea',
        peso_porcentual: '',
        fecha_publicacion: dayjs(),
        fecha_vencimiento: dayjs().add(7, 'day'),
        nota_maxima: 100,
        permite_entrega_tardia: false,
        penalizacion_tardia: 0,
        requiere_archivo: true
    });
    const [errors, setErrors] = useState({});

    const loadPesoDisponible = useCallback(async () => {
        try {
            const validacion = await tareasService.validarPesos(asignaturaId);
            const pesoUsado = validacion.peso_total || 0;
            setPesoDisponible(100 - pesoUsado);
        } catch (error) {
            console.error('Error cargando peso disponible:', error);
            setPesoDisponible(100);
        }
    }, [asignaturaId]);

    useEffect(() => {
        if (open && asignaturaId) {
            loadPesoDisponible();
        }
    }, [open, asignaturaId, loadPesoDisponible]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleDateChange = (name, value) => {
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

        if (!formData.titulo.trim()) {
            newErrors.titulo = 'El título es requerido';
        }

        if (!formData.descripcion.trim()) {
            newErrors.descripcion = 'La descripción es requerida';
        }

        const pesoNum = parseFloat(formData.peso_porcentual);
        if (!formData.peso_porcentual) {
            newErrors.peso_porcentual = 'El peso porcentual es requerido';
        } else if (isNaN(pesoNum) || pesoNum <= 0) {
            newErrors.peso_porcentual = 'El peso debe ser mayor a 0';
        } else if (pesoNum > pesoDisponible) {
            newErrors.peso_porcentual = `El peso excede el disponible (${pesoDisponible.toFixed(2)}%)`;
        }

        if (!formData.fecha_publicacion) {
            newErrors.fecha_publicacion = 'La fecha de publicación es requerida';
        }

        if (!formData.fecha_vencimiento) {
            newErrors.fecha_vencimiento = 'La fecha de vencimiento es requerida';
        } else if (dayjs(formData.fecha_vencimiento).isBefore(dayjs(formData.fecha_publicacion))) {
            newErrors.fecha_vencimiento = 'La fecha de vencimiento debe ser posterior a la de publicación';
        }

        if (formData.nota_maxima <= 0) {
            newErrors.nota_maxima = 'La nota máxima debe ser mayor a 0';
        }

        if (formData.permite_entrega_tardia && formData.penalizacion_tardia < 0) {
            newErrors.penalizacion_tardia = 'La penalización no puede ser negativa';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setIsLoading(true);
        try {
            const tareaData = {
                ...formData,
                asignatura: asignaturaId,
                fecha_publicacion: formData.fecha_publicacion.toISOString(),
                fecha_vencimiento: formData.fecha_vencimiento.toISOString(),
                peso_porcentual: parseFloat(formData.peso_porcentual),
                nota_maxima: parseFloat(formData.nota_maxima),
                penalizacion_tardia: parseFloat(formData.penalizacion_tardia)
            };

            await tareasService.createTarea(tareaData);
            enqueueSnackbar('Tarea creada exitosamente', { variant: 'success' });
            handleClose();
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Error creando tarea:', error);
            const errorMsg = error.response?.data?.peso_porcentual?.[0] ||
                           error.response?.data?.error ||
                           'Error al crear la tarea';
            enqueueSnackbar(errorMsg, { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            titulo: '',
            descripcion: '',
            tipo_tarea: 'tarea',
            peso_porcentual: '',
            fecha_publicacion: dayjs(),
            fecha_vencimiento: dayjs().add(7, 'day'),
            nota_maxima: 100,
            permite_entrega_tardia: false,
            penalizacion_tardia: 0,
            requiere_archivo: true
        });
        setErrors({});
        onClose();
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>Crear Nueva Tarea</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Alert severity="info" sx={{ mb: 3 }}>
                            <Typography variant="body2">
                                Peso disponible: <strong>{pesoDisponible.toFixed(2)}%</strong>
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                                La suma de los pesos de todas las tareas debe ser igual a 100%
                            </Typography>
                        </Alert>

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Título de la Tarea"
                                    name="titulo"
                                    value={formData.titulo}
                                    onChange={handleChange}
                                    error={!!errors.titulo}
                                    helperText={errors.titulo}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Descripción"
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    error={!!errors.descripcion}
                                    helperText={errors.descripcion}
                                    multiline
                                    rows={4}
                                    placeholder="Instrucciones detalladas, criterios de evaluación..."
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Tipo de Tarea"
                                    name="tipo_tarea"
                                    value={formData.tipo_tarea}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="tarea">Tarea</MenuItem>
                                    <MenuItem value="examen">Examen</MenuItem>
                                    <MenuItem value="proyecto">Proyecto</MenuItem>
                                    <MenuItem value="quiz">Quiz</MenuItem>
                                    <MenuItem value="laboratorio">Laboratorio</MenuItem>
                                    <MenuItem value="exposicion">Exposición</MenuItem>
                                    <MenuItem value="investigacion">Investigación</MenuItem>
                                    <MenuItem value="participacion">Participación</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Peso Porcentual"
                                    name="peso_porcentual"
                                    value={formData.peso_porcentual}
                                    onChange={handleChange}
                                    error={!!errors.peso_porcentual}
                                    helperText={errors.peso_porcentual}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    }}
                                    inputProps={{
                                        step: "0.01",
                                        min: "0",
                                        max: pesoDisponible
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <DateTimePicker
                                    label="Fecha de Publicación"
                                    value={formData.fecha_publicacion}
                                    onChange={(value) => handleDateChange('fecha_publicacion', value)}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error: !!errors.fecha_publicacion,
                                            helperText: errors.fecha_publicacion
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <DateTimePicker
                                    label="Fecha de Vencimiento"
                                    value={formData.fecha_vencimiento}
                                    onChange={(value) => handleDateChange('fecha_vencimiento', value)}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error: !!errors.fecha_vencimiento,
                                            helperText: errors.fecha_vencimiento
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Nota Máxima"
                                    name="nota_maxima"
                                    value={formData.nota_maxima}
                                    onChange={handleChange}
                                    error={!!errors.nota_maxima}
                                    helperText={errors.nota_maxima}
                                    inputProps={{ min: "0", step: "0.01" }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Permite Entrega Tardía"
                                    name="permite_entrega_tardia"
                                    value={formData.permite_entrega_tardia}
                                    onChange={handleChange}
                                >
                                    <MenuItem value={true}>Sí</MenuItem>
                                    <MenuItem value={false}>No</MenuItem>
                                </TextField>
                            </Grid>

                            {formData.permite_entrega_tardia && (
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Penalización por Tardanza"
                                        name="penalizacion_tardia"
                                        value={formData.penalizacion_tardia}
                                        onChange={handleChange}
                                        error={!!errors.penalizacion_tardia}
                                        helperText={errors.penalizacion_tardia || "Porcentaje de descuento"}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                        }}
                                        inputProps={{ min: "0", max: "100", step: "0.01" }}
                                    />
                                </Grid>
                            )}

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Requiere Archivo Adjunto"
                                    name="requiere_archivo"
                                    value={formData.requiere_archivo}
                                    onChange={handleChange}
                                >
                                    <MenuItem value={true}>Sí</MenuItem>
                                    <MenuItem value={false}>No</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
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
                        {isLoading ? 'Creando...' : 'Crear Tarea'}
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
};
