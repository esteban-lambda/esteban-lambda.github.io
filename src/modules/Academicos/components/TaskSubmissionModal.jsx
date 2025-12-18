import { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
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
    LinearProgress
} from '@mui/material';
import { Assignment, CalendarToday, CloudUpload, AttachFile } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { entregasService } from '../services/entregasService';
import dayjs from 'dayjs';

// Constants
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_FILE_TYPES = '.pdf,.doc,.docx,.txt,.zip,.rar,.jpg,.jpeg,.png';
const FILE_FORMATS_TEXT = 'PDF, DOC, DOCX, TXT, ZIP, RAR, JPG, PNG';
const HOURS_IN_WEEK = 168;
const PRIMARY_COLOR = '#4169FF';
const BACKGROUND_COLOR = '#F7FAFC';

// Utility functions
const calculateTimeRemaining = (vencimiento) => {
    const horasRestantes = dayjs(vencimiento).diff(dayjs(), 'hour');
    const diasRestantes = Math.floor(horasRestantes / 24);
    return { horasRestantes, diasRestantes };
};

const formatTimeRemaining = (diasRestantes, horasRestantes) => {
    if (diasRestantes > 0) {
        return `${diasRestantes} día${diasRestantes > 1 ? 's' : ''}`;
    }
    return `${horasRestantes} hora${horasRestantes !== 1 ? 's' : ''}`;
};

const calculateProgressValue = (horasRestantes) => {
    return Math.min(100, Math.max(0, 100 - (horasRestantes / HOURS_IN_WEEK) * 100));
};

const getProgressColor = (diasRestantes) => {
    if (diasRestantes > 2) return 'success';
    if (diasRestantes > 0) return 'warning';
    return 'error';
};

const validateFileSize = (file) => {
    return file.size <= MAX_FILE_SIZE_BYTES;
};

const getErrorMessage = (error) => {
    return error.response?.data?.error || 
           error.response?.data?.detail ||
           'Error al entregar la tarea';
};

export const TaskSubmissionModal = ({ open, onClose, tarea, onSuccess }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        comentario_estudiante: '',
        archivo_adjunto: null
    });
    const [errors, setErrors] = useState({});
    const [fileName, setFileName] = useState('');

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    }, [errors]);

    const handleFileChange = useCallback((e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!validateFileSize(file)) {
            setErrors(prev => ({
                ...prev,
                archivo_adjunto: `El archivo no debe superar los ${MAX_FILE_SIZE_MB}MB`
            }));
            return;
        }
        
        setFormData(prev => ({
            ...prev,
            archivo_adjunto: file
        }));
        setFileName(file.name);
        
        if (errors.archivo_adjunto) {
            setErrors(prev => ({ ...prev, archivo_adjunto: '' }));
        }
    }, [errors.archivo_adjunto]);

    const handleClose = useCallback(() => {
        setFormData({ comentario_estudiante: '', archivo_adjunto: null });
        setFileName('');
        setErrors({});
        onClose();
    }, [onClose]);

    const validate = useCallback(() => {
        const newErrors = {};
        
        if (tarea?.requiere_archivo && !formData.archivo_adjunto) {
            newErrors.archivo_adjunto = 'Debes adjuntar un archivo para esta tarea';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [tarea?.requiere_archivo, formData.archivo_adjunto]);

    const handleSubmit = useCallback(async () => {
        if (!validate()) return;

        setIsLoading(true);
        try {
            const entregaData = {
                tarea: tarea.id,
                comentario_estudiante: formData.comentario_estudiante,
                ...(formData.archivo_adjunto && { archivo_adjunto: formData.archivo_adjunto })
            };

            await entregasService.create(entregaData);
            enqueueSnackbar('Tarea entregada exitosamente', { variant: 'success' });
            handleClose();
            onSuccess?.();
        } catch (error) {
            console.error('Error entregando tarea:', error);
            enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [validate, tarea?.id, formData, enqueueSnackbar, onSuccess, handleClose]);

    const taskMetrics = useMemo(() => {
        if (!tarea) return null;

        const esVencida = dayjs().isAfter(dayjs(tarea.fecha_vencimiento));
        const { horasRestantes, diasRestantes } = calculateTimeRemaining(tarea.fecha_vencimiento);
        const progressValue = calculateProgressValue(horasRestantes);
        const progressColor = getProgressColor(diasRestantes);
        const timeRemainingText = formatTimeRemaining(diasRestantes, horasRestantes);
        const puedeEntregar = !esVencida || tarea.permite_entrega_tardia;

        return {
            esVencida,
            horasRestantes,
            diasRestantes,
            progressValue,
            progressColor,
            timeRemainingText,
            puedeEntregar
        };
    }, [tarea]);

    if (!tarea || !taskMetrics) return null;

    const { esVencida, progressValue, progressColor, timeRemainingText, puedeEntregar } = taskMetrics;

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>Entregar Tarea</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    {/* Información de la tarea */}
                    <Box sx={{ mb: 3, p: 2, bgcolor: BACKGROUND_COLOR, borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Assignment sx={{ mr: 1, color: PRIMARY_COLOR }} />
                            <Typography variant="h6">{tarea.titulo}</Typography>
                        </Box>

                        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                            {tarea.descripcion}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <Chip
                                label={tarea.tipo_tarea}
                                size="small"
                                color="primary"
                            />
                            <Chip
                                label={`Peso: ${tarea.peso_porcentual}%`}
                                size="small"
                                variant="outlined"
                            />
                            <Chip
                                label={`Nota máxima: ${tarea.nota_maxima}`}
                                size="small"
                                variant="outlined"
                            />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarToday sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                                <strong>Vence:</strong> {dayjs(tarea.fecha_vencimiento).format('DD/MM/YYYY HH:mm')}
                            </Typography>
                        </Box>

                        {/* Indicador de tiempo restante */}
                        {!esVencida && (
                            <Box sx={{ mt: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="caption">Tiempo restante</Typography>
                                    <Typography variant="caption">
                                        {timeRemainingText}
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={progressValue}
                                    color={progressColor}
                                    sx={{ height: 6, borderRadius: 3 }}
                                />
                            </Box>
                        )}
                    </Box>

                    {/* Alertas */}
                    {esVencida && tarea.permite_entrega_tardia ? (
                        <Alert severity="warning" sx={{ mb: 3 }}>
                            <Typography variant="body2">
                                Esta tarea está vencida. Tu entrega tendrá una penalización del {tarea.penalizacion_tardia}%
                            </Typography>
                        </Alert>
                    ) : esVencida && !tarea.permite_entrega_tardia ? (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            <Typography variant="body2">
                                Esta tarea está vencida y ya no acepta entregas.
                            </Typography>
                        </Alert>
                    ) : null}

                    {tarea.instrucciones_archivo && (
                        <Alert severity="info" sx={{ mb: 3 }}>
                            <Typography variant="body2">
                                <strong>Instrucciones:</strong> {tarea.instrucciones_archivo}
                            </Typography>
                        </Alert>
                    )}

                    <Divider sx={{ my: 3 }} />

                    {/* Formulario de entrega */}
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Tu entrega
                    </Typography>

                    {tarea.requiere_archivo && (
                        <Box sx={{ mb: 3 }}>
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<CloudUpload />}
                                fullWidth
                                sx={{ py: 2, mb: 1 }}
                            >
                                {fileName || 'Seleccionar archivo'}
                                <input
                                    type="file"
                                    hidden
                                    onChange={handleFileChange}
                                    accept={ALLOWED_FILE_TYPES}
                                />
                            </Button>
                            {errors.archivo_adjunto && (
                                <Typography variant="caption" color="error">
                                    {errors.archivo_adjunto}
                                </Typography>
                            )}
                            {fileName && (
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    <AttachFile sx={{ fontSize: 16, mr: 0.5, color: 'success.main' }} />
                                    <Typography variant="caption" color="success.main">
                                        Archivo seleccionado: {fileName}
                                    </Typography>
                                </Box>
                            )}
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                Tamaño máximo: {MAX_FILE_SIZE_MB}MB. Formatos permitidos: {FILE_FORMATS_TEXT}
                            </Typography>
                        </Box>
                    )}

                    <TextField
                        fullWidth
                        label="Comentarios"
                        name="comentario_estudiante"
                        value={formData.comentario_estudiante}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        placeholder="Agrega comentarios sobre tu entrega (opcional)..."
                        helperText="Puedes incluir notas, aclaraciones o preguntas para el docente"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} aria-label="Cancelar entrega">
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={isLoading || !puedeEntregar}
                    sx={{ bgcolor: PRIMARY_COLOR }}
                    aria-label="Entregar tarea"
                >
                    {isLoading ? 'Entregando...' : 'Entregar Tarea'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

TaskSubmissionModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    tarea: PropTypes.shape({
        id: PropTypes.number.isRequired,
        titulo: PropTypes.string.isRequired,
        descripcion: PropTypes.string,
        tipo_tarea: PropTypes.string,
        peso_porcentual: PropTypes.number,
        nota_maxima: PropTypes.number,
        fecha_vencimiento: PropTypes.string.isRequired,
        requiere_archivo: PropTypes.bool,
        permite_entrega_tardia: PropTypes.bool,
        penalizacion_tardia: PropTypes.number,
        instrucciones_archivo: PropTypes.string
    }),
    onSuccess: PropTypes.func
};
