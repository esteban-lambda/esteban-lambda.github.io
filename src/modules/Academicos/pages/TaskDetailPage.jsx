import { Box, Typography, Chip, Button, Paper, Divider, Stack, Avatar, IconButton, Container, CircularProgress, Alert } from '@mui/material';
import { ArrowBack, Download, Upload, InsertDriveFile, CalendarMonth, School, BarChart, Edit } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout, DownloadPanel, UploadFile, RoleGate } from '../../../core';
import { useTask, useEntregarTarea } from '../hooks/useTasks';
import { ROLES } from '../../../core/constants/roles';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const TaskDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: tarea, isLoading, error } = useTask(id);
    const entregarTarea = useEntregarTarea();

    const handleUploadEntrega = async (files) => {
        if (!files || files.length === 0) return;

        const formData = new FormData();
        files.forEach((file) => {
            formData.append('archivos', file);
        });

        try {
            await entregarTarea.mutateAsync({
                tareaId: id,
                entregaData: formData,
            });
        } catch (error) {
            console.error('Error al entregar tarea:', error);
        }
    };

    if (isLoading) {
        return (
            <Layout>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <CircularProgress size={60} sx={{ color: '#8b5cf6' }} />
                </Box>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <Container maxWidth="xl" sx={{ py: 4 }}>
                    <Alert severity="error">
                        Error al cargar la tarea: {error.message || 'Por favor, intenta nuevamente'}
                    </Alert>
                </Container>
            </Layout>
        );
    }

    if (!tarea) {
        return (
            <Layout>
                <Container maxWidth="xl" sx={{ py: 4 }}>
                    <Alert severity="warning">Tarea no encontrada</Alert>
                </Container>
            </Layout>
        );
    }

    return (
        <Layout>
            {/* Dark Hero Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%)',
                    pt: 6,
                    pb: 8,
                    mb: 4,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '10%',
                        left: '5%',
                        width: '300px',
                        height: '300px',
                        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(60px)',
                        animation: 'float 8s ease-in-out infinite',
                    },
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: '10%',
                        right: '5%',
                        width: '250px',
                        height: '250px',
                        background: 'radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(50px)',
                        animation: 'float 10s ease-in-out infinite reverse',
                    },
                }}
            >
                <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
                    {/* Breadcrumb mejorado */}
                    <Box
                        sx={{
                            mb: 4,
                            p: 2.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 2,
                        }}
                    >
                        <IconButton
                            onClick={() => navigate('/tareas')}
                            sx={{
                                bgcolor: 'rgba(139, 92, 246, 0.2)',
                                border: '1px solid rgba(139, 92, 246, 0.3)',
                                '&:hover': {
                                    bgcolor: 'rgba(139, 92, 246, 0.3)',
                                    transform: 'scale(1.05)',
                                },
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                        >
                            <ArrowBack sx={{ color: '#8b5cf6' }} />
                        </IconButton>
                        <Box>
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }} display="block">
                                {tarea.curso} / {tarea.materia}
                            </Typography>
                            <Typography variant="body2" fontWeight={700} sx={{ color: 'white' }}>
                                {tarea.asignatura}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Header de la tarea con glassmorphism */}
                    <Box
                        sx={{
                            p: 4,
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: 3,
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '2px',
                                background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.8), transparent)',
                                animation: 'shimmer 3s ease-in-out infinite',
                            },
                        }}
                    >
                        <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                            <Chip
                                label={tarea.estado}
                                sx={{
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                    color: 'white',
                                    border: 'none',
                                }}
                                size="small"
                            />
                            <Chip
                                icon={<School sx={{ color: '#8b5cf6 !important' }} />}
                                label={tarea.asignatura}
                                sx={{
                                    fontWeight: 600,
                                    bgcolor: 'rgba(139, 92, 246, 0.2)',
                                    color: '#c4b5fd',
                                    border: '1px solid rgba(139, 92, 246, 0.3)',
                                }}
                                size="small"
                            />
                        </Stack>

                        <Typography
                            variant="h3"
                            fontWeight={800}
                            gutterBottom
                            sx={{
                                color: 'white',
                                letterSpacing: '-0.02em',
                                background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            {tarea.titulo}
                        </Typography>

                        {/* Metadata */}
                        <Stack direction="row" spacing={3} sx={{ mt: 3 }} flexWrap="wrap">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                                    }}
                                >
                                    {tarea.profesor?.[0] || 'P'}
                                </Avatar>
                                <Box>
                                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }} display="block">
                                        Profesor
                                    </Typography>
                                    <Typography variant="body2" fontWeight={700} sx={{ color: 'white' }}>
                                        {tarea.profesor}
                                    </Typography>
                                </Box>
                            </Box>
                            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                            <Box>
                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }} display="block">
                                    Fecha de entrega
                                </Typography>
                                <Typography variant="body2" fontWeight={700} sx={{ color: '#f87171' }}>
                                    {format(new Date(tarea.fechaEntrega), "d 'de' MMMM, yyyy", { locale: es })}
                                </Typography>
                            </Box>
                            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                            <Box>
                                <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)' }} display="block">
                                    Puntuación máxima
                                </Typography>
                                <Typography
                                    variant="body2"
                                    fontWeight={700}
                                    sx={{ fontFamily: 'monospace', color: '#22c55e' }}
                                >
                                    {tarea.notaMaxima} pts
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="xl">
                <Box sx={{ display: 'flex', gap: 4, flexWrap: { xs: 'wrap', lg: 'nowrap' } }}>
                    {/* Contenido principal */}
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        {/* Descripción*/}
                        <Box
                            sx={{
                                p: 4,
                                mb: 3,
                                bgcolor: 'rgba(255, 255, 255, 0.02)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                borderRadius: 2,
                            }}
                        >
                            <Typography
                                variant="h6"
                                fontWeight={700}
                                gutterBottom
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    color: 'text.primary',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 4,
                                        height: 24,
                                        background: 'linear-gradient(180deg, #8b5cf6 0%, #6d28d9 100%)',
                                        borderRadius: 1,
                                        boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)',
                                    }}
                                />
                                Descripción de la tarea
                            </Typography>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ lineHeight: 1.8, mt: 2, whiteSpace: 'pre-line' }}
                            >
                                {tarea.descripcion}
                            </Typography>
                        </Box>

                        {/* Materiales Adjuntos*/}
                        <Box
                            sx={{
                                p: 3,
                                bgcolor: 'rgba(255, 255, 255, 0.02)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                borderRadius: 2,
                            }}
                        >
                            <DownloadPanel
                                files={tarea.materialesAdjuntos}
                                title="Materiales Adjuntos"
                                showSize={true}
                            />
                        </Box>
                    </Box>

                    {/* Sidebar */}
                    <Box sx={{ width: { xs: '100%', lg: 380 }, flexShrink: 0 }}>
                        {/* Entrega */}
                        <Box
                            sx={{
                                p: 3,
                                mb: 3,
                                bgcolor: 'rgba(255, 255, 255, 0.02)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                borderRadius: 2,
                            }}
                        >
                            <Typography
                                variant="h6"
                                fontWeight={700}
                                gutterBottom
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    color: 'text.primary',
                                }}
                            >
                                <Upload sx={{ color: '#8b5cf6' }} />
                                Tu Entrega
                            </Typography>

                            {!tarea.entrega ? (
                                <>
                                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Box sx={{ width: '100%', maxWidth: 340 }}>
                                            <UploadFile
                                                acceptedFormats={['.pdf', '.doc', '.docx', '.zip']}
                                                maxSize={10}
                                                helperText="PDF, Word o ZIP hasta 10MB"
                                                onUpload={handleUploadEntrega}
                                                disabled={entregarTarea.isPending}
                                            />
                                        </Box>
                                        <Chip
                                            label="No entregado"
                                            size="small"
                                            sx={{
                                                mt: 2,
                                                fontWeight: 600,
                                                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                                color: 'white',
                                            }}
                                        />
                                    </Box>
                                </>
                            ) : (
                                <Box sx={{ mt: 2 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Chip
                                            label="Entregado"
                                            size="small"
                                            sx={{
                                                mb: 2,
                                                fontWeight: 600,
                                                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                                                color: 'white',
                                            }}
                                        />
                                        <Paper
                                            variant="outlined"
                                            sx={{
                                                p: 2,
                                                bgcolor: 'rgba(34, 197, 94, 0.05)',
                                                borderColor: 'rgba(34, 197, 94, 0.2)',
                                                width: '100%',
                                                maxWidth: 340,
                                            }}
                                        >
                                            <Typography variant="body2" fontWeight={600}>
                                                {tarea.entrega}
                                            </Typography>
                                        </Paper>
                                    </Box>
                                </Box>
                            )}
                        </Box>

                        {/* Calificación con diseño único */}
                        <Box
                            sx={{
                                p: 4,
                                textAlign: 'center',
                                background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%)',
                                border: '1px solid rgba(139, 92, 246, 0.3)',
                                borderRadius: 2,
                                position: 'relative',
                                overflow: 'hidden',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background:
                                        'radial-gradient(circle at top right, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'relative',
                                    zIndex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 1,
                                    mb: 2,
                                }}
                            >
                                <BarChart sx={{ color: '#8b5cf6' }} />
                                <Typography variant="h6" fontWeight={700} sx={{ color: 'white' }}>
                                    Calificación
                                </Typography>
                            </Box>

                            {!tarea.calificacion ? (
                                <Box sx={{ py: 3, position: 'relative', zIndex: 1 }}>
                                    <Typography
                                        variant="h1"
                                        fontWeight={800}
                                        gutterBottom
                                        sx={{
                                            color: 'rgba(255, 255, 255, 0.3)',
                                            fontFamily: 'monospace',
                                        }}
                                    >
                                        - / {tarea.notaMaxima}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                        Aún no calificado
                                    </Typography>
                                </Box>
                            ) : (
                                <Box sx={{ py: 3, position: 'relative', zIndex: 1 }}>
                                    <Typography
                                        variant="h1"
                                        fontWeight={800}
                                        gutterBottom
                                        sx={{
                                            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text',
                                            fontFamily: 'monospace',
                                        }}
                                    >
                                        {tarea.calificacion}
                                    </Typography>
                                    <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                        de {tarea.notaMaxima} puntos
                                    </Typography>
                                    <Chip
                                        label="Calificado"
                                        sx={{
                                            mt: 2,
                                            bgcolor: 'rgba(34, 197, 94, 0.2)',
                                            color: '#22c55e',
                                            fontWeight: 700,
                                            border: '1px solid rgba(34, 197, 94, 0.3)',
                                        }}
                                    />
                                </Box>
                            )}

                            <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)', position: 'relative', zIndex: 1 }} />

                            <Box
                                sx={{
                                    textAlign: 'left',
                                    bgcolor: 'rgba(255, 255, 255, 0.03)',
                                    backdropFilter: 'blur(10px)',
                                    p: 2.5,
                                    borderRadius: 2,
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    position: 'relative',
                                    zIndex: 1,
                                }}
                            >
                                <Typography variant="body2" fontWeight={700} gutterBottom sx={{ color: 'white' }}>
                                    Comentarios del profesor
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontStyle: 'italic' }}>
                                    {tarea.calificacion
                                        ? 'Excelente trabajo, muy bien fundamentado.'
                                        : 'Aún no hay comentarios disponibles.'}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Layout>
    );
};