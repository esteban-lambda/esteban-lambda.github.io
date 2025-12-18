import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Box,
    CircularProgress,
    Typography
} from '@mui/material';
import { PersonAdd, Close } from '@mui/icons-material';
import { asignaturasService } from '../../services/asignaturasService';

export const AssignTeacherDialog = ({ open, onClose, course, teachers = [], onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        docente_id: '',
        notificar: true,
        mensaje_personalizado: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.docente_id) {
            setError('Debes seleccionar un docente');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await asignaturasService.asignarDocente(course.id, {
                docente_id: formData.docente_id,
                notificar: formData.notificar,
                mensaje_personalizado: formData.mensaje_personalizado,
            });

            onSuccess?.();
            onClose();
        } catch (err) {
            console.error('Error al asignar docente:', err);
            setError(err.response?.data?.error || 'Error al asignar el docente. Por favor intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
                }
            }}
        >
            <DialogTitle sx={{
                pb: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                fontWeight: 700
            }}>
                Asignar Docente
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent sx={{ pt: 3 }}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Asignatura
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                            {course?.nombre} ({course?.codigo})
                        </Typography>
                    </Box>

                    {/* Seleccionar Docente */}
                    <FormControl fullWidth sx={{ mb: 3 }} required>
                        <InputLabel>Docente Responsable</InputLabel>
                        <Select
                            name="docente_id"
                            value={formData.docente_id}
                            onChange={handleChange}
                            label="Docente Responsable"
                        >
                            {teachers.map(docente => (
                                <MenuItem key={docente.id} value={docente.id}>
                                    {docente.first_name} {docente.last_name} - {docente.email}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Mensaje Personalizado */}
                    <TextField
                        fullWidth
                        label="Mensaje Personalizado (Opcional)"
                        name="mensaje_personalizado"
                        value={formData.mensaje_personalizado}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        placeholder="Mensaje adicional para el docente..."
                        helperText="Este mensaje se incluirá en la notificación al docente"
                    />
                </DialogContent>

                <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Button
                        onClick={onClose}
                        startIcon={<Close />}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAdd />}
                        disabled={loading}
                    >
                        Asignar Docente
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
