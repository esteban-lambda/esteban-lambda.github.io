import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Alert,
    Box,
    Autocomplete,
    CircularProgress
} from '@mui/material';
import { Save, Close } from '@mui/icons-material';
import { asignaturasService } from '../../services/asignaturasService';
import { periodosService } from '../../services/periodosService';

const ESTADOS = [
    { value: 'planificacion', label: 'En Planificación' },
    { value: 'activa', label: 'Activa' },
    { value: 'inactiva', label: 'Inactiva' },
    { value: 'suspendida', label: 'Suspendida' },
];

export const CourseFormDialog = ({ open, onClose, course = null, onSuccess }) => {
        const [formData, setFormData] = useState({
            nombre: '',
            codigo: '',
            descripcion: '',
            estado: 'planificacion',
            periodo_academico_id: '',
            docente_responsable_id: '',
            creditos: 0,
            horas_semanales: 0,
            cupo_maximo: 30,
        });
        const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [periodos, setPeriodos] = useState([]);
    const [docentes, setDocentes] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    const loadInitialData = async () => {
        try {
            setLoadingData(true);
            const [periodosData, docentesData] = await Promise.all([
                periodosService.getPeriodos(),
                // Aquí deberías tener un servicio para obtener usuarios con rol Docente
                fetch(`${import.meta.env.VITE_API_URL}/usuarios/usuarios/?rol=Docente`).then(res => res.json()).catch(() => ({ results: [] }))
            ]);

            setPeriodos(periodosData.results || periodosData || []);
            setDocentes(docentesData.results || []);
        } catch (err) {
            console.error('Error cargando datos:', err);
        } finally {
            setLoadingData(false);
        }
    };

    const resetForm = () => {
        setFormData({
            nombre: '',
            codigo: '',
            descripcion: '',
            estado: 'planificacion',
            periodo_academico_id: '',
            docente_responsable_id: '',
            creditos: 0,
            horas_semanales: 0,
            cupo_maximo: 30,
        });
        setErrors({});
        setError('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Limpiar error del campo
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
        if (!formData.codigo.trim()) newErrors.codigo = 'El código es requerido';
        if (!formData.periodo_academico_id) newErrors.periodo_academico_id = 'El período académico es requerido';
        if (formData.creditos < 0) newErrors.creditos = 'Los créditos deben ser positivos';
        if (formData.horas_semanales < 0) newErrors.horas_semanales = 'Las horas deben ser positivas';
        if (formData.cupo_maximo < 1) newErrors.cupo_maximo = 'El cupo debe ser al menos 1';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        setError('');

        try {
            const dataToSend = {
                ...formData,
                docente_responsable_id: formData.docente_responsable_id || null,
            };

            if (course) {
                await asignaturasService.update(course.id, dataToSend);
            } else {
                await asignaturasService.create(dataToSend);
            }

            onSuccess?.();
            onClose();
        } catch (err) {
            console.error('Error al guardar asignatura:', err);

            if (err.response?.data) {
                const errorData = err.response.data;
                if (typeof errorData === 'object') {
                    setErrors(errorData);
                    setError('Por favor corrige los errores en el formulario');
                } else {
                    setError(errorData.detail || errorData.message || 'Error al guardar la asignatura');
                }
            } else {
                setError('Error al guardar la asignatura. Por favor intenta de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
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
                {course ? 'Editar Asignatura' : 'Nueva Asignatura'}
            </DialogTitle>

            <form onSubmit={handleSubmit}>
                <DialogContent sx={{ pt: 3 }}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    {loadingData ? (
                        <Box display="flex" justifyContent="center" py={4}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {/* Nombre */}
                            <Grid item xs={12} md={8}>
                                <TextField
                                    fullWidth
                                    label="Nombre de la Asignatura"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    error={!!errors.nombre}
                                    helperText={errors.nombre}
                                    required
                                    placeholder="Ej: Matemáticas Avanzadas"
                                />
                            </Grid>

                            {/* Código */}
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Código"
                                    name="codigo"
                                    value={formData.codigo}
                                    onChange={handleChange}
                                    error={!!errors.codigo}
                                    helperText={errors.codigo}
                                    required
                                    placeholder="Ej: MAT301"
                                    inputProps={{ style: { textTransform: 'uppercase' } }}
                                />
                            </Grid>

                            {/* Descripción */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Descripción"
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    multiline
                                    rows={3}
                                    placeholder="Descripción detallada de la asignatura..."
                                />
                            </Grid>

                            {/* Período Académico */}
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth error={!!errors.periodo_academico_id} required>
                                    <InputLabel>Período Académico</InputLabel>
                                    <Select
                                        name="periodo_academico_id"
                                        value={formData.periodo_academico_id}
                                        onChange={handleChange}
                                        label="Período Académico"
                                    >
                                        {periodos.map(periodo => (
                                            <MenuItem key={periodo.id} value={periodo.id}>
                                                {periodo.nombre} {periodo.es_actual && '(Actual)'}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.periodo_academico_id && (
                                        <FormHelperText>{errors.periodo_academico_id}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            {/* Estado */}
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Estado</InputLabel>
                                    <Select
                                        name="estado"
                                        value={formData.estado}
                                        onChange={handleChange}
                                        label="Estado"
                                    >
                                        {ESTADOS.map(estado => (
                                            <MenuItem key={estado.value} value={estado.value}>
                                                {estado.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Docente Responsable */}
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Docente Responsable (Opcional)</InputLabel>
                                    <Select
                                        name="docente_responsable_id"
                                        value={formData.docente_responsable_id}
                                        onChange={handleChange}
                                        label="Docente Responsable (Opcional)"
                                    >
                                        <MenuItem value="">
                                            <em>Sin asignar</em>
                                        </MenuItem>
                                        {docentes.map(docente => (
                                            <MenuItem key={docente.id} value={docente.id}>
                                                {docente.first_name} {docente.last_name} ({docente.email})
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Créditos */}
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
                                    inputProps={{ min: 0, max: 10 }}
                                />
                            </Grid>

                            {/* Horas Semanales */}
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
                                    inputProps={{ min: 0, max: 40 }}
                                />
                            </Grid>

                            {/* Cupo Máximo */}
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
                                    inputProps={{ min: 1, max: 100 }}
                                />
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>

                <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider', justifyContent: 'center' }}>
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
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                        disabled={loading || loadingData}
                        sx={{ ml: 2 }}
                    >
                        {course ? 'Actualizar' : 'Crear Asignatura'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
