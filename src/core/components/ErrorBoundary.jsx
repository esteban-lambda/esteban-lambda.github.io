import { Component } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(_error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error capturado por ErrorBoundary:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        
        // Verificar si hay un token de sesión activo
        const token = localStorage.getItem('accessToken');
        
        if (token) {
            // Si está logueado, redirigir al dashboard
            window.location.href = '/dashboard';
        } else {
            // Si no está logueado, redirigir al login
            window.location.href = '/login';
        }
    };

    render() {
        if (this.state.hasError) {
            return (
                <Container maxWidth="sm">
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '100vh',
                            textAlign: 'center',
                            gap: 3
                        }}
                    >
                        <ErrorOutlineIcon
                            sx={{
                                fontSize: 80,
                                color: 'error.main',
                                opacity: 0.8
                            }}
                        />

                        <Typography variant="h4" component="h1" gutterBottom>
                            ¡Algo salió mal!
                        </Typography>

                        <Typography variant="body1" color="text.secondary" paragraph>
                            Lo sentimos, ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.
                        </Typography>

                        {import.meta.env.DEV && this.state.error && (
                            <Box
                                sx={{
                                    width: '100%',
                                    mt: 2,
                                    p: 2,
                                    bgcolor: 'grey.100',
                                    borderRadius: 1,
                                    textAlign: 'left',
                                    overflow: 'auto'
                                }}
                            >
                                <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </Typography>
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                            <Button
                                variant="contained"
                                onClick={this.handleReset}
                                size="large"
                            >
                                Volver al inicio
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => window.location.reload()}
                                size="large"
                            >
                                Recargar página
                            </Button>
                        </Box>
                    </Box>
                </Container>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
