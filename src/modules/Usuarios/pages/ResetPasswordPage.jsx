import { useState, useEffect } from 'react';
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
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { authService } from '../services/authService';

export const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isValidatingToken, setIsValidatingToken] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setTokenValid(false);
                setIsValidatingToken(false);
                return;
            }

            try {
                // Aquí podrías agregar una llamada al backend para validar el token
                // Por ahora asumimos que si existe el token, procedemos
                setTokenValid(true);
            } catch (error) {
                console.error('Error validando token:', error);
                setTokenValid(false);
                enqueueSnackbar('El enlace de recuperación es inválido o ha expirado', { variant: 'error' });
            } finally {
                setIsValidatingToken(false);
            }
        };

        validateToken();
    }, [token, enqueueSnackbar]);

    const validate = () => {
        const newErrors = {};

        if (!formData.newPassword) {
            newErrors.newPassword = 'La contraseña es requerida';
        } else if (formData.newPassword.length < 8) {
            newErrors.newPassword = 'La contraseña debe tener al menos 8 caracteres';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirma tu contraseña';
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setIsLoading(true);
        try {
            await authService.resetPassword(token, formData.newPassword);
            enqueueSnackbar('Contraseña restablecida exitosamente', { variant: 'success' });
            navigate('/login');
        } catch (error) {
            console.error('Error al restablecer contraseña:', error);
            enqueueSnackbar(
                error.response?.data?.error || 
                'Error al restablecer la contraseña. El enlace puede haber expirado.',
                { variant: 'error' }
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (isValidatingToken) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    bgcolor: '#FAFBFC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Typography>Validando enlace...</Typography>
            </Box>
        );
    }

    if (!tokenValid) {
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
                        <Alert severity="error" sx={{ mb: 3 }}>
                            El enlace de recuperación es inválido o ha expirado.
                        </Alert>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => navigate('/forgot-password')}
                            sx={{ bgcolor: '#4169FF' }}
                        >
                            Solicitar nuevo enlace
                        </Button>
                    </Paper>
                </Container>
            </Box>
        );
    }

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
                        Restablecer Contraseña
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#718096', mb: 4 }}>
                        Ingresa tu nueva contraseña
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Nueva Contraseña"
                            name="newPassword"
                            type={showPassword ? 'text' : 'password'}
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
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Confirmar Contraseña"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
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
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={isLoading}
                            sx={{
                                py: 1.75,
                                bgcolor: '#4169FF',
                                '&:hover': { bgcolor: '#2948CC' }
                            }}
                        >
                            {isLoading ? 'Restableciendo...' : 'Restablecer Contraseña'}
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};
