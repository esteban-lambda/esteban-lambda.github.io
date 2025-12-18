import { useState, useEffect } from 'react';
import { 
    Box, 
    Container, 
    Paper, 
    TextField, 
    Button, 
    Typography, 
    Link,
    MenuItem,
    InputAdornment,
    IconButton,
    Alert,
    Stepper,
    Step,
    StepLabel
} from '@mui/material';
import { 
    Visibility, 
    VisibilityOff, 
    Person, 
    Email, 
    Lock, 
    SchoolOutlined 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { authService } from '../services/authService';

// Nota: El registro de usuarios solo puede ser realizado por Administradores
// Los permisos específicos se asignan posteriormente a través del módulo de gestión

export const RegisterPage = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [activeStep, setActiveStep] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: '',
        numero_identificacion: ''
        // Nota: Los permisos se asignan después del registro por un administrador
    });

    const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

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

    const steps = ['Información Básica', 'Datos Personales', 'Credenciales'];

    const validateStep = (step) => {
        const newErrors = {};

        if (step === 0) {
            if (!formData.email) newErrors.email = 'El correo electrónico es requerido';
            else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Correo electrónico inválido';
            if (!formData.username) newErrors.username = 'El nombre de usuario es requerido';
        }

        if (step === 1) {
            if (!formData.first_name) newErrors.first_name = 'El nombre es requerido';
            if (!formData.last_name) newErrors.last_name = 'El apellido es requerido';
            if (!formData.numero_identificacion) newErrors.numero_identificacion = 'El número de identificación es requerido';
        }

        if (step === 2) {
            if (!formData.password) newErrors.password = 'La contraseña es requerida';
            else if (formData.password.length < 8) newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
            if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirme la contraseña';
            else if (formData.password !== formData.confirmPassword) 
                newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(activeStep)) {
            setActiveStep((prevStep) => prevStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
        setErrors({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar error del campo al empezar a escribir
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async () => {
        if (!validateStep(2)) return;

        setIsLoading(true);
        try {
            // Obtener token de reCAPTCHA v3
            let captchaToken = null;
            if (recaptchaLoaded && window.grecaptcha) {
                captchaToken = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'register' });
            }

            // Preparar datos sin confirmPassword
            const { confirmPassword: _confirmPassword, ...registerData } = formData;
            
            await authService.register({
                ...registerData,
                captchaToken
            });

            enqueueSnackbar('Registro exitoso. Por favor inicia sesión.', { variant: 'success' });
            navigate('/login');
        } catch (error) {
            console.error('Error en registro:', error);
            enqueueSnackbar(
                error.response?.data?.error || 'Error al registrarse. Intenta nuevamente.',
                { variant: 'error' }
            );
        } finally {
            setIsLoading(false);
        }
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Los permisos de acceso serán asignados por un administrador después del registro.
                        </Alert>
                        <TextField
                            fullWidth
                            label="Correo Electrónico"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email || 'Debe ser único en el sistema'}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email sx={{ color: '#A0AEC0' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Nombre de Usuario"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            error={!!errors.username}
                            helperText={errors.username}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person sx={{ color: '#A0AEC0' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                );

            case 1:
                return (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <TextField
                            fullWidth
                            label="Nombre"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            error={!!errors.first_name}
                            helperText={errors.first_name}
                        />
                        <TextField
                            fullWidth
                            label="Apellido"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            error={!!errors.last_name}
                            helperText={errors.last_name}
                        />
                        <TextField
                            fullWidth
                            label="Número de Identificación"
                            name="numero_identificacion"
                            value={formData.numero_identificacion}
                            onChange={handleChange}
                            error={!!errors.numero_identificacion}
                            helperText={errors.numero_identificacion}
                        />
                    </Box>
                );

            case 2:
                return (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <TextField
                            fullWidth
                            label="Contraseña"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            error={!!errors.password}
                            helperText={errors.password || 'Mínimo 8 caracteres'}
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
                    </Box>
                );
            default:
                return null;
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
            <Container maxWidth="md">
                {/* Logo */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                        <Typography variant="h5" sx={{ color: '#1A202C', fontWeight: 700 }}>
                            EduPro 360
                        </Typography>
                    </Box>
                </Box>

                <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>
                        Crear Cuenta
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#718096', mb: 4, textAlign: 'center' }}>
                        Completa el formulario para registrarte
                    </Typography>

                    <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {renderStepContent(activeStep)}

                    <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                        <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ flex: 1 }}
                        >
                            Atrás
                        </Button>
                        {activeStep === steps.length - 1 ? (
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={isLoading}
                                sx={{ flex: 1, bgcolor: '#4169FF' }}
                            >
                                {isLoading ? 'Registrando...' : 'Registrarse'}
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                sx={{ flex: 1, bgcolor: '#4169FF' }}
                            >
                                Siguiente
                            </Button>
                        )}
                    </Box>

                    <Typography variant="body2" sx={{ mt: 3, textAlign: 'center', color: '#718096' }}>
                        ¿Ya tienes cuenta?{' '}
                        <Link 
                            href="/login" 
                            sx={{ 
                                color: '#4169FF', 
                                fontWeight: 600,
                                textDecoration: 'none',
                                '&:hover': { textDecoration: 'underline' }
                            }}
                        >
                            Inicia sesión
                        </Link>
                    </Typography>

                    <Typography 
                        variant="caption" 
                        sx={{ 
                            color: '#718096', 
                            fontSize: '11px',
                            mt: 2,
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
                </Paper>
            </Container>
        </Box>
    );
};
