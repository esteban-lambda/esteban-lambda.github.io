import { useState, useEffect } from 'react';
import { Box, Grid, TextField, Button, Typography, InputAdornment, IconButton, Checkbox, FormControlLabel, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import { Visibility, VisibilityOff, Email, Lock, SchoolOutlined } from '@mui/icons-material';
import { useLogin } from '../hooks/useLogin';

export const LoginForm = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
    const { login, isLoading } = useLogin();

    const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

    // Cargar script de reCAPTCHA v3
    useEffect(() => {
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
        script.async = true;
        script.defer = true;
        script.onload = () => setRecaptchaLoaded(true);
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, [RECAPTCHA_SITE_KEY]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Ejecutar reCAPTCHA v3 (invisible)
        if (recaptchaLoaded && window.grecaptcha) {
            try {
                const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'login' });
                await login({ ...credentials, captchaToken: token });
            } catch (error) {
                console.error('Error al obtener token de reCAPTCHA:', error);
                await login({ ...credentials });
            }
        } else {
            await login({ ...credentials });
        }
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* Left Side - Hero Section */}
            <Box 
                sx={{
                    flex: 1,
                    position: 'relative',
                    backgroundImage: 'url(https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=80)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: { xs: 'none', md: 'flex' },
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    px: 6,
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: 'rgba(255, 255, 255, 0.85)',
                        zIndex: 0,
                    }
                }}
            >
                <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 550 }}>
                    {/* Logo */}
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', mb: 4 }}>
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: 2.5,
                                bgcolor: '#4169FF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mr: 2,
                            }}
                        >
                            <SchoolOutlined sx={{ color: 'white', fontSize: 32 }} />
                        </Box>
                        <Typography variant="h5" sx={{ color: '#1A202C', fontWeight: 700, fontSize: '24px' }}>
                            EduPro 360
                        </Typography>
                    </Box>

                    {/* Tagline */}
                    <Typography 
                        sx={{ 
                            color: '#1A202C',
                            fontWeight: 700, 
                            fontSize: { md: '38px', lg: '44px' },
                            mb: 2.5,
                            lineHeight: 1.2,
                        }}
                    >
                        Simplificando la gestión académica.
                    </Typography>
                    <Typography 
                        sx={{ 
                            color: '#4A5568',
                            fontSize: '17px',
                            lineHeight: 1.6,
                        }}
                    >
                        Una plataforma integral para estudiantes, profesores y administradores.
                    </Typography>
                </Box>
            </Box>

            {/* Right Side - Login Form */}
            <Box 
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: '#FAFBFC',
                    px: { xs: 3, sm: 6, md: 8 },
                    py: 8,
                }}
            >
                <Box sx={{ width: '100%', maxWidth: 440 }}>
                    {/* Mobile Logo */}
                    <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', justifyContent: 'center', mb: 5 }}>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 2,
                                bgcolor: '#4169FF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mr: 1.5,
                            }}
                        >
                            <SchoolOutlined sx={{ color: 'white', fontSize: 28 }} />
                        </Box>
                        <Typography variant="h5" sx={{ color: '#1A202C', fontWeight: 700, fontSize: '22px' }}>
                            EduPro 360
                        </Typography>
                    </Box>

                    {/* Form Header */}
                    <Box sx={{ mb: 4 }}>
                        <Typography 
                            variant="h4" 
                            sx={{ 
                                color: '#1A202C', 
                                fontWeight: 700,
                                fontSize: '28px',
                                mb: 1 
                            }}
                        >
                            Bienvenido de nuevo
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#718096', fontSize: '15px' }}>
                            Inicia sesión para acceder a tu panel.
                        </Typography>
                    </Box>

                    {/* Login Form */}
                    <Box component="form" onSubmit={handleSubmit}>
                        <Box sx={{ mb: 2.5 }}>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: '#1A202C', 
                                    fontWeight: 600,
                                    fontSize: '14px',
                                    mb: 1 
                                }}
                            >
                                Correo Electrónico
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="tu@email.com"
                                type="email"
                                value={credentials.email}
                                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email sx={{ color: '#A0AEC0', fontSize: 20 }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        <Box sx={{ mb: 2 }}>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: '#1A202C', 
                                    fontWeight: 600,
                                    fontSize: '14px',
                                    mb: 1 
                                }}
                            >
                                Contraseña
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="••••••••"
                                type={showPassword ? 'text' : 'password'}
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock sx={{ color: '#A0AEC0', fontSize: 20 }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                                size="small"
                                                sx={{ color: '#A0AEC0' }}
                                            >
                                                {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox 
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        size="small"
                                        sx={{ 
                                            color: '#CBD5E0',
                                            '&.Mui-checked': {
                                                color: '#4169FF',
                                            }
                                        }}
                                    />
                                }
                                label={
                                    <Typography variant="body2" sx={{ color: '#4A5568', fontSize: '14px' }}>
                                        Recordar sesión
                                    </Typography>
                                }
                            />
                            <Link 
                                to="/forgot-password"
                                style={{ 
                                    color: '#4169FF',
                                    textDecoration: 'none',
                                    fontWeight: 500,
                                    fontSize: '14px'
                                }}
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </Box>

                        {/* reCAPTCHA v3 badge (invisible, automático) */}
                        <Typography 
                            variant="caption" 
                            sx={{ 
                                color: '#718096', 
                                fontSize: '11px',
                                mb: 3,
                                display: 'block',
                                textAlign: 'center'
                            }}
                        >
                            Este sitio está protegido por reCAPTCHA y se aplican la{' '}
                            <Link href="https://policies.google.com/privacy" target="_blank" sx={{ color: '#4169FF' }}>
                                Política de Privacidad
                            </Link>
                            {' '}y los{' '}
                            <Link href="https://policies.google.com/terms" target="_blank" sx={{ color: '#4169FF' }}>
                                Términos de Servicio
                            </Link>
                            {' '}de Google.
                        </Typography>

                        <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={isLoading}
                            sx={{
                                py: 1.75,
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '16px',
                                borderRadius: 2.5,
                                bgcolor: '#4169FF',
                                boxShadow: 'none',
                                '&:hover': {
                                    bgcolor: '#2948CC',
                                    boxShadow: '0 4px 12px rgba(65, 105, 255, 0.25)',
                                },
                                '&:disabled': {
                                    bgcolor: '#CBD5E0',
                                    color: '#A0AEC0',
                                }
                            }}
                        >
                            {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
                        </Button>

                        <Typography variant="body2" sx={{ mt: 3, textAlign: 'center', color: '#718096', fontSize: '13px' }}>
                            Para crear nuevos usuarios, contacta al administrador del sistema.
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};