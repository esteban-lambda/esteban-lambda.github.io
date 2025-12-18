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
import { Email, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { authService } from '../services/authService';

export const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('El correo electrónico es requerido');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Correo electrónico inválido');
            return;
        }

        setIsLoading(true);
        try {
            await authService.requestPasswordReset(email);
            setEmailSent(true);
            enqueueSnackbar('Se ha enviado un enlace de recuperación a tu correo', { variant: 'success' });
        } catch (error) {
            console.error('Error al solicitar recuperación:', error);
            setError(
                error.response?.data?.error || 
                'Error al enviar el correo de recuperación. Verifica que el correo esté registrado.'
            );
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
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() => navigate('/login')}
                        sx={{ mb: 3, color: '#4169FF' }}
                    >
                        Volver al inicio de sesión
                    </Button>

                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        Recuperar Contraseña
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#718096', mb: 4 }}>
                        {emailSent 
                            ? 'Revisa tu correo electrónico' 
                            : 'Ingresa tu correo para recibir un enlace de recuperación'
                        }
                    </Typography>

                    {emailSent ? (
                        <Box>
                            <Alert severity="success" sx={{ mb: 3 }}>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    Hemos enviado un enlace de recuperación a <strong>{email}</strong>
                                </Typography>
                                <Typography variant="body2">
                                    El enlace expirará en 24 horas. Si no recibes el correo, revisa tu carpeta de spam.
                                </Typography>
                            </Alert>

                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => {
                                    setEmailSent(false);
                                    setEmail('');
                                }}
                                sx={{ mb: 2 }}
                            >
                                Enviar a otro correo
                            </Button>

                            <Button
                                fullWidth
                                variant="contained"
                                onClick={() => navigate('/login')}
                                sx={{ bgcolor: '#4169FF' }}
                            >
                                Volver al inicio de sesión
                            </Button>
                        </Box>
                    ) : (
                        <Box component="form" onSubmit={handleSubmit}>
                            {error && (
                                <Alert severity="error" sx={{ mb: 3 }}>
                                    {error}
                                </Alert>
                            )}

                            <TextField
                                fullWidth
                                label="Correo Electrónico"
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError('');
                                }}
                                error={!!error}
                                sx={{ mb: 3 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email sx={{ color: '#A0AEC0' }} />
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
                                {isLoading ? 'Enviando...' : 'Enviar enlace de recuperación'}
                            </Button>
                        </Box>
                    )}
                </Paper>
            </Container>
        </Box>
    );
};
