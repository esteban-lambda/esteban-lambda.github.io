import { useState } from 'react';
import { 
    Box, 
    Container, 
    Paper, 
    TextField, 
    Button, 
    Typography, 
    InputAdornment,
    IconButton,
    Alert
} from '@mui/material';
import { Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { authService } from '../services/authService';

export const ChangePasswordPage = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        if (!formData.currentPassword) {
            newErrors.currentPassword = 'La contraseña actual es requerida';
        }

        if (!formData.newPassword) {
            newErrors.newPassword = 'La nueva contraseña es requerida';
        } else if (formData.newPassword.length < 8) {
            newErrors.newPassword = 'La contraseña debe tener al menos 8 caracteres';
        } else if (formData.newPassword === formData.currentPassword) {
            newErrors.newPassword = 'La nueva contraseña debe ser diferente a la actual';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirma tu nueva contraseña';
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar error del campo
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setIsLoading(true);
        try {
            await authService.changePassword({
                contrasena_actual: formData.currentPassword,
                nueva_contrasena: formData.newPassword,
                confirmar_contrasena: formData.confirmPassword
            });
            
            enqueueSnackbar('Contraseña cambiada exitosamente', { variant: 'success' });
            navigate('/perfil');
        } catch (error) {
            console.error('Error al cambiar contraseña:', error);
            
            const errorMessage = error.response?.data?.error || 
                               error.response?.data?.contrasena_actual?.[0] ||
                               'Error al cambiar la contraseña';
            
            if (errorMessage.includes('actual') || errorMessage.includes('incorrecta')) {
                setErrors({ currentPassword: errorMessage });
            } else {
                enqueueSnackbar(errorMessage, { variant: 'error' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: '#FAFBFC',
                display: 'flex',
                alignItems: 'center',
                py: 4
            }}
        >
            <Container maxWidth="sm">
                <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        Cambiar Contraseña
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#718096', mb: 4 }}>
                        Actualiza tu contraseña de forma segura
                    </Typography>

                    <Alert severity="info" sx={{ mb: 3 }}>
                        La nueva contraseña debe tener al menos 8 caracteres y ser diferente a la actual.
                    </Alert>

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Contraseña Actual"
                            name="currentPassword"
                            type={showPasswords.current ? 'text' : 'password'}
                            value={formData.currentPassword}
                            onChange={handleChange}
                            error={!!errors.currentPassword}
                            helperText={errors.currentPassword}
                            sx={{ mb: 3 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock sx={{ color: '#A0AEC0' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => togglePasswordVisibility('current')}
                                            edge="end"
                                        >
                                            {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Nueva Contraseña"
                            name="newPassword"
                            type={showPasswords.new ? 'text' : 'password'}
                            value={formData.newPassword}
                            onChange={handleChange}
                            error={!!errors.newPassword}
                            helperText={errors.newPassword || 'Mínimo 8 caracteres'}
                            sx={{ mb: 3 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock sx={{ color: '#A0AEC0' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => togglePasswordVisibility('new')}
                                            edge="end"
                                        >
                                            {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Confirmar Nueva Contraseña"
                            name="confirmPassword"
                            type={showPasswords.confirm ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                            sx={{ mb: 3 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock sx={{ color: '#A0AEC0' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => togglePasswordVisibility('confirm')}
                                            edge="end"
                                        >
                                            {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => navigate('/perfil')}
                                disabled={isLoading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                disabled={isLoading}
                                sx={{
                                    bgcolor: '#4169FF',
                                    '&:hover': { bgcolor: '#2948CC' }
                                }}
                            >
                                {isLoading ? 'Cambiando...' : 'Cambiar Contraseña'}
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};
