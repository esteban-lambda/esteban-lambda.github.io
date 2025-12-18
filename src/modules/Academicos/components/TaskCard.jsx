import { useState } from 'react';
import { Typography, Box, Chip, IconButton, Stack, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarMonth, MoreVert, TrendingUp, CheckCircle, ErrorOutline, Edit, Delete, Visibility, Assignment } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Usuarios';

export const TaskCard = ({ tarea }) => {
    const navigate = useNavigate();
    const { can } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        handleMenuClose();
        navigate(`/academicos/tareas/${tarea.id}/editar`);
    };

    const handleViewSubmissions = (e) => {
        e.stopPropagation();
        handleMenuClose();
        navigate(`/academicos/tareas/${tarea.id}/entregas`);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        handleMenuClose();
        // Implementar lógica de eliminación
    };

    // Verificar si puede gestionar la tarea (editar, eliminar)
    const canManageTask = can.canEditTarea(tarea.asignatura_data);
    const canViewSubmissions = can.hasPermission('academicos.ver_entregas');
    const canDeleteTask = can.hasPermission('academicos.eliminar_tarea');
    const isStudent = !can.hasPermission('academicos.crear_tarea');
    
    // Validar que la fecha de entrega sea válida
    const fechaEntregaValida = tarea.fechaEntrega && !isNaN(new Date(tarea.fechaEntrega).getTime());
    const isOverdue = fechaEntregaValida && new Date(tarea.fechaEntrega) < new Date() && tarea.estado !== 'Entregada';
    // eslint-disable-next-line no-unused-vars
    const daysUntilDue = fechaEntregaValida ? Math.ceil((new Date(tarea.fechaEntrega) - new Date()) / (1000 * 60 * 60 * 24)) : 0;

    const getStatusColor = () => {
        if (tarea.estado === 'Entregada') return 'success';
        if (isOverdue) return 'error';
        return 'warning';
    };

    const getStatusLabel = () => {
        if (tarea.estado === 'Entregada') return 'Entregada';
        if (isOverdue) return 'Vencida';
        return 'Pendiente';
    };

    return (
        <Box
            onClick={() => navigate(`/tareas/${tarea.id}`)}
            sx={{
                height: '270px',
                minHeight: '270px',
                maxHeight: '270px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                position: 'relative',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                border: '2px solid',
                borderColor: getStatusColor() === 'success'
                    ? 'rgba(34, 197, 94, 0.3)'
                    : getStatusColor() === 'error'
                    ? 'rgba(239, 68, 68, 0.3)'
                    : 'rgba(245, 158, 11, 0.3)',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '6px',
                    background: getStatusColor() === 'success'
                        ? 'linear-gradient(90deg, #22c55e, #34d399, #22c55e)'
                        : getStatusColor() === 'error'
                        ? 'linear-gradient(90deg, #ef4444, #f87171, #ef4444)'
                        : 'linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 3s ease-in-out infinite',
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.05), transparent 70%)',
                    opacity: 0,
                    transition: 'opacity 0.4s',
                    pointerEvents: 'none',
                },
                '&:hover': {
                    transform: 'translateY(-12px) scale(1.02)',
                    boxShadow: '0 24px 48px rgba(0, 0, 0, 0.18)',
                    borderColor: getStatusColor() === 'success'
                        ? '#22c55e'
                        : getStatusColor() === 'error'
                        ? '#ef4444'
                        : '#f59e0b',
                    '&::after': {
                        opacity: 1,
                    },
                },
                '@keyframes shimmer': {
                    '0%, 100%': { backgroundPosition: '200% 0' },
                    '50%': { backgroundPosition: '-200% 0' },
                },
            }}
        >
            <Box sx={{ p: 3, pt: 4, position: 'relative', zIndex: 1 }}>
                {/* Header con badge de estado y menú */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Chip
                        icon={getStatusColor() === 'success' ? <CheckCircle /> : getStatusColor() === 'error' ? <ErrorOutline /> : <TrendingUp />}
                        label={getStatusLabel()}
                        size="small"
                        sx={{
                            fontWeight: 800,
                            fontSize: '0.7rem',
                            height: 32,
                            px: 1.5,
                            borderRadius: '10px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            background: getStatusColor() === 'success'
                                ? 'linear-gradient(135deg, #22c55e, #34d399)'
                                : getStatusColor() === 'error'
                                ? 'linear-gradient(135deg, #ef4444, #f87171)'
                                : 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                            color: 'white',
                            border: 'none',
                            boxShadow: getStatusColor() === 'success'
                                ? '0 4px 12px rgba(34, 197, 94, 0.3)'
                                : getStatusColor() === 'error'
                                ? '0 4px 12px rgba(239, 68, 68, 0.3)'
                                : '0 4px 12px rgba(245, 158, 11, 0.3)',
                            '& .MuiChip-icon': {
                                fontSize: 16,
                                color: 'white',
                            },
                        }}
                    />
                    {canManageTask && (
                        <>
                            <IconButton
                                size="small"
                                onClick={handleMenuOpen}
                                sx={{
                                    width: 32,
                                    height: 32,
                                    bgcolor: 'rgba(139, 92, 246, 0.1)',
                                    border: '2px solid rgba(139, 92, 246, 0.2)',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        bgcolor: 'rgba(139, 92, 246, 0.2)',
                                        transform: 'rotate(90deg)',
                                    },
                                }}
                            >
                                <MoreVert fontSize="small" sx={{ color: '#8b5cf6' }} />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleMenuClose}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {canViewSubmissions && (
                                    <MenuItem onClick={handleViewSubmissions}>
                                        <ListItemIcon>
                                            <Assignment fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText>Ver entregas</ListItemText>
                                    </MenuItem>
                                )}
                                {canManageTask && (
                                    <MenuItem onClick={handleEdit}>
                                        <ListItemIcon>
                                            <Edit fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText>Editar</ListItemText>
                                    </MenuItem>
                                )}
                                {canDeleteTask && (
                                    <MenuItem onClick={handleDelete}>
                                        <ListItemIcon>
                                            <Delete fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText>Eliminar</ListItemText>
                                    </MenuItem>
                                )}
                            </Menu>
                        </>
                    )}
                    {isStudent && (
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/academicos/tareas/${tarea.id}`);
                            }}
                            sx={{
                                width: 32,
                                height: 32,
                                bgcolor: 'rgba(139, 92, 246, 0.1)',
                                border: '2px solid rgba(139, 92, 246, 0.2)',
                                transition: 'all 0.3s',
                                '&:hover': {
                                    bgcolor: 'rgba(139, 92, 246, 0.2)',
                                },
                            }}
                        >
                            <Visibility fontSize="small" sx={{ color: '#8b5cf6' }} />
                        </IconButton>
                    )}
                </Box>

                {/* Asignatura con avatar mejorado */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1rem',
                            fontWeight: 900,
                            color: 'white',
                            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                        }}
                    >
                        {tarea.asignatura?.[0] || 'A'}
                    </Box>
                    <Box>
                        <Typography
                            variant="caption"
                            sx={{
                                color: '#8b5cf6',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                fontSize: '0.7rem',
                            }}
                        >
                            {tarea.asignatura || 'Asignatura'}
                        </Typography>
                    </Box>
                </Box>

                {/* Título con estilo único */}
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 800,
                        fontSize: '1.25rem',
                        mb: 2,
                        lineHeight: 1.3,
                        minHeight: 50,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        color: '#0f172a',
                        letterSpacing: '-0.01em',
                    }}
                >
                    {tarea.titulo}
                </Typography>

                {/* Descripción */}
                <Typography
                    variant="body2"
                    sx={{
                        mb: 3,
                        color: '#64748b',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.6,
                        minHeight: 38,
                        fontSize: '0.9rem',
                    }}
                >
                    {tarea.descripcion || 'Sin descripción disponible'}
                </Typography>

                {/* Divider glassmorphism */}
                <Box
                    sx={{
                        height: '2px',
                        background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.3), transparent)',
                        my: 2.5,
                    }}
                />

                {/* Footer con más información */}
                <Stack spacing={2.5}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                px: 2,
                                py: 1.5,
                                borderRadius: '12px',
                                background: isOverdue
                                    ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(248, 113, 113, 0.05))'
                                    : 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(167, 139, 250, 0.05))',
                                border: '2px solid',
                                borderColor: isOverdue ? 'rgba(239, 68, 68, 0.2)' : 'rgba(139, 92, 246, 0.2)',
                            }}
                        >
                            <Box
                                sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: '10px',
                                    background: isOverdue
                                        ? 'linear-gradient(135deg, #ef4444, #f87171)'
                                        : 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: isOverdue
                                        ? '0 4px 12px rgba(239, 68, 68, 0.3)'
                                        : '0 4px 12px rgba(139, 92, 246, 0.3)',
                                }}
                            >
                                <CalendarMonth sx={{ fontSize: 18, color: 'white' }} />
                            </Box>
                            <Box>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: '#64748b',
                                        display: 'block',
                                        lineHeight: 1.2,
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        fontSize: '0.65rem',
                                        letterSpacing: '0.05em',
                                    }}
                                >
                                    {isOverdue ? 'VENCIDA' : 'ENTREGA'}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 800,
                                        color: isOverdue ? '#ef4444' : '#0f172a',
                                        fontSize: '0.95rem',
                                    }}
                                >
                                    {fechaEntregaValida ? format(new Date(tarea.fechaEntrega), 'd MMM', { locale: es }) : 'Sin fecha'}
                                </Typography>
                            </Box>
                        </Box>

                        {tarea.notaMaxima && (
                            <Box
                                sx={{
                                    px: 2.5,
                                    py: 1,
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(52, 211, 153, 0.1))',
                                    border: '2px solid rgba(34, 197, 94, 0.3)',
                                    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.15)',
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 900,
                                        color: '#22c55e',
                                        fontSize: '0.95rem',
                                        fontFamily: 'monospace',
                                    }}
                                >
                                    {tarea.notaMaxima} pts
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    {/* Progress bar mejorado */}
                    {tarea.progreso !== undefined && (
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: '#64748b',
                                        fontWeight: 800,
                                        textTransform: 'uppercase',
                                        fontSize: '0.7rem',
                                        letterSpacing: '0.05em',
                                    }}
                                >
                                    Progreso
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontWeight: 900,
                                        color: '#8b5cf6',
                                        fontFamily: 'monospace',
                                    }}
                                >
                                    {tarea.progreso}%
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    height: 8,
                                    borderRadius: '8px',
                                    background: 'rgba(139, 92, 246, 0.1)',
                                    overflow: 'hidden',
                                    border: '1px solid rgba(139, 92, 246, 0.2)',
                                }}
                            >
                                <Box
                                    sx={{
                                        height: '100%',
                                        width: `${tarea.progreso}%`,
                                        background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)',
                                        borderRadius: '8px',
                                        transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                        boxShadow: '0 0 8px rgba(139, 92, 246, 0.4)',
                                    }}
                                />
                            </Box>
                        </Box>
                    )}
                </Stack>
            </Box>
        </Box>
    );
};
