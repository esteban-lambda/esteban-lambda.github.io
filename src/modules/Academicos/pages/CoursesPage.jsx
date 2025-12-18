import { Box, Typography, Card, CardContent, Grid, Chip, Container, CircularProgress, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { PeopleOutline, AssignmentOutlined, School, Settings } from '@mui/icons-material';
import { Layout } from '../../../core';
import { PermissionGate } from '../../../core/components/PermissionGate';
import { useAuth } from '../../Usuarios';
import { useCourses } from '../hooks/useCourses';
import { useNavigate } from 'react-router-dom';

export const CoursesPage = () => {
    const { data: cursos, isLoading, error } = useCourses();
    const { can, isAdmin } = useAuth();
    const navigate = useNavigate();

    // Asignar colores dinámicamente a los cursos
    const colores = ['#2563eb', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4'];
    
    // Extraer el array de cursos de la respuesta (puede ser paginada o directa)
    const cursosArray = Array.isArray(cursos) ? cursos : (cursos?.results || []);
    
    const cursosConColor = cursosArray.map((curso, index) => ({
        ...curso,
        color: curso.color || colores[index % colores.length],
    }));

    return (
        <Layout>
            {/* Dark Hero Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%)',
                    pt: 8,
                    pb: 10,
                    mb: 4,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '20%',
                        right: '10%',
                        width: '400px',
                        height: '400px',
                        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(80px)',
                        animation: 'float 12s ease-in-out infinite',
                    },
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: '20%',
                        left: '10%',
                        width: '300px',
                        height: '300px',
                        background: 'radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(70px)',
                        animation: 'float 10s ease-in-out infinite reverse',
                    },
                }}
            >
                <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                                mb: 3,
                                px: 3,
                                py: 1,
                                bgcolor: 'rgba(139, 92, 246, 0.1)',
                                border: '1px solid rgba(139, 92, 246, 0.2)',
                                borderRadius: 10,
                            }}
                        >
                            <School sx={{ color: '#8b5cf6', fontSize: 20 }} />
                            <Typography variant="caption" sx={{ color: '#c4b5fd', fontWeight: 600, letterSpacing: 1 }}>
                                CURSOS ACADÉMICOS
                            </Typography>
                        </Box>

                        <Typography
                            variant="h2"
                            fontWeight={900}
                            gutterBottom
                            sx={{
                                background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                letterSpacing: '-0.02em',
                                mb: 2,
                            }}
                        >
                            Mis Cursos
                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                maxWidth: 600,
                                mx: 'auto',
                                lineHeight: 1.6,
                                fontWeight: 400,
                            }}
                        >
                            {can.hasPermission('academicos.gestionar_todas_asignaturas') 
                                ? 'Gestiona todas las asignaturas del sistema' 
                                : can.hasPermission('academicos.editar_asignatura') 
                                ? 'Gestiona tus asignaturas asignadas'
                                : 'Consulta tus cursos inscritos y el progreso académico'}
                        </Typography>
                        
                        {/* Botón de Gestión solo para usuarios con permiso */}
                        <PermissionGate requiredPermissions="academicos.gestionar_todas_asignaturas">
                            <Box sx={{ mt: 3 }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<Settings />}
                                    onClick={() => navigate('/cursos/gestion')}
                                    sx={{
                                        bgcolor: 'white',
                                        color: '#667eea',
                                        px: 4,
                                        py: 1.5,
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.9)',
                                        }
                                    }}
                                >
                                    Gestionar Asignaturas
                                </Button>
                            </Box>
                        </PermissionGate>

                        {/* Stats Cards */}
                        <Grid container spacing={3} sx={{ mt: 4 }}>
                            <Grid item xs={12} sm={4}>
                                <Box
                                    sx={{
                                        p: 3,
                                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: 2,
                                    }}
                                >
                                    <Typography
                                        variant="h3"
                                        fontWeight={800}
                                        sx={{
                                            color: '#8b5cf6',
                                            fontFamily: 'monospace',
                                        }}
                                    >
                                        {cursosConColor?.length || 0}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                        Cursos activos
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Box
                                    sx={{
                                        p: 3,
                                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: 2,
                                    }}
                                >
                                    <Typography
                                        variant="h3"
                                        fontWeight={800}
                                        sx={{
                                            color: '#22c55e',
                                            fontFamily: 'monospace',
                                        }}
                                    >
                                        {cursosConColor?.reduce((acc, c) => acc + (c.tareas || c.total_tareas || 0), 0) || 0}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                        Tareas totales
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Box
                                    sx={{
                                        p: 3,
                                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: 2,
                                    }}
                                >
                                    <Typography
                                        variant="h3"
                                        fontWeight={800}
                                        sx={{
                                            color: '#2563eb',
                                            fontFamily: 'monospace',
                                        }}
                                    >
                                        {cursosConColor?.reduce((acc, c) => acc + (c.estudiantes || c.total_estudiantes || 0), 0) || 0}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                                        Compañeros
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ pb: 6 }}>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress size={60} sx={{ color: '#8b5cf6' }} />
                    </Box>
                ) : error ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h6" color="error" gutterBottom>
                            Error al cargar los cursos
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {error.message || 'Por favor, intenta nuevamente más tarde'}
                        </Typography>
                    </Box>
                ) : !cursosConColor || cursosConColor.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            No hay cursos disponibles
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Aún no estás matriculado en ningún curso
                        </Typography>
                    </Box>
                ) : isAdmin ? (
                    <TableContainer component={Paper} sx={{ mt: 4 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Código</TableCell>
                                    <TableCell>Nombre</TableCell>
                                    <TableCell>Profesor</TableCell>
                                    <TableCell>Estudiantes</TableCell>
                                    <TableCell>Tareas</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cursosConColor.map((curso) => (
                                    <TableRow key={curso.id} hover>
                                        <TableCell>{curso.codigo}</TableCell>
                                        <TableCell>{curso.nombre}</TableCell>
                                        <TableCell>{curso.profesor || curso.nombre_profesor || 'Profesor'}</TableCell>
                                        <TableCell>{curso.estudiantes || curso.total_estudiantes || 0}</TableCell>
                                        <TableCell>{curso.tareas || curso.total_tareas || 0}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Grid container spacing={3}>
                        {cursosConColor.map((curso) => (
                            <Grid item xs={12} sm={6} lg={3} key={curso.id}>
                                <Box
                                    sx={{
                                        height: '100%',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        bgcolor: 'rgba(255, 255, 255, 0.02)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.05)',
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            border: `1px solid ${curso.color}40`,
                                            boxShadow: `0 20px 40px ${curso.color}20`,
                                        },
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            height: '2px',
                                            background: `linear-gradient(90deg, transparent, ${curso.color}, transparent)`,
                                            opacity: 0,
                                            transition: 'opacity 0.3s',
                                        },
                                        '&:hover::before': {
                                            opacity: 1,
                                            animation: 'shimmer 2s ease-in-out infinite',
                                        },
                                    }}
                                >
                                    {/* Color accent bar */}
                                    <Box
                                        sx={{
                                            height: 6,
                                            background: `linear-gradient(90deg, ${curso.color}, ${curso.color}dd)`,
                                            boxShadow: `0 0 20px ${curso.color}40`,
                                        }}
                                    />

                                    <CardContent sx={{ p: 3 }}>
                                        <Chip
                                            label={curso.codigo}
                                            size="small"
                                            sx={{
                                                mb: 2,
                                                bgcolor: `${curso.color}15`,
                                                color: curso.color,
                                                fontWeight: 700,
                                                fontFamily: 'monospace',
                                                border: `1px solid ${curso.color}30`,
                                                fontSize: '0.75rem',
                                                letterSpacing: 0.5,
                                            }}
                                        />

                                        <Typography
                                            variant="h6"
                                            fontWeight={700}
                                            gutterBottom
                                            sx={{
                                                color: 'text.primary',
                                                lineHeight: 1.3,
                                                minHeight: 52,
                                            }}
                                        >
                                            {curso.nombre}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'text.secondary',
                                                mb: 3,
                                                fontWeight: 500,
                                            }}
                                        >
                                            {curso.profesor || curso.nombre_profesor || 'Profesor'}
                                        </Typography>

                                        {/* Stats */}
                                        <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1.5,
                                                    p: 1.5,
                                                    bgcolor: 'rgba(255, 255, 255, 0.02)',
                                                    borderRadius: 1.5,
                                                    border: '1px solid rgba(255, 255, 255, 0.03)',
                                                }}
                                            >
                                                <PeopleOutline sx={{ fontSize: 18, color: curso.color }} />
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: 'text.secondary',
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    <Box component="span" sx={{ color: curso.color, fontWeight: 700 }}>
                                                        {curso.estudiantes || curso.total_estudiantes || 0}
                                                    </Box>{' '}
                                                    estudiantes
                                                </Typography>
                                            </Box>

                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1.5,
                                                    p: 1.5,
                                                    bgcolor: 'rgba(255, 255, 255, 0.02)',
                                                    borderRadius: 1.5,
                                                    border: '1px solid rgba(255, 255, 255, 0.03)',
                                                }}
                                            >
                                                <AssignmentOutlined sx={{ fontSize: 18, color: curso.color }} />
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: 'text.secondary',
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    <Box component="span" sx={{ color: curso.color, fontWeight: 700 }}>
                                                        {curso.tareas || curso.total_tareas || 0}
                                                    </Box>{' '}
                                                    tareas
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Layout>
    );
};