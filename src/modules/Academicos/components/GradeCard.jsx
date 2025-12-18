import { Card, CardContent, Typography, Box, CircularProgress, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { TrendingUp, TrendingDown, Remove, MoreVert, Edit, Visibility } from '@mui/icons-material';
import { useState } from 'react';
import { useAuth } from '../../Usuarios';
import { useNavigate } from 'react-router-dom';

export const GradeCard = ({ calificacion }) => {
    const { can } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        handleMenuClose();
        navigate(`/academicos/calificaciones/${calificacion.id}/editar`);
    };

    const canEdit = can.canGrade(calificacion.asignatura_data);

    const nota = calificacion.nota || calificacion.calificacion || 0;
    const notaMaxima = calificacion.notaMaxima || calificacion.nota_maxima || 100;
    const materia = calificacion.materia || calificacion.nombre_materia || calificacion.asignatura || 'Sin nombre';
    
    const percentage = (nota / notaMaxima) * 100;
    const getColor = () => {
        if (percentage >= 80) return '#22c55e';
        if (percentage >= 60) return '#f59e0b';
        return '#ef4444';
    };

    const getTrendIcon = () => {
        if (percentage >= 80) return <TrendingUp sx={{ color: '#22c55e', fontSize: 20 }} />;
        if (percentage >= 60) return <Remove sx={{ color: '#f59e0b', fontSize: 20 }} />;
        return <TrendingDown sx={{ color: '#ef4444', fontSize: 20 }} />;
    };

    const color = calificacion.color || getColor();

    return (
        <Box
            sx={{
                height: '320px',
                minHeight: '320px',
                maxHeight: '320px',
                position: 'relative',
                bgcolor: `linear-gradient(135deg, ${color}22 0%, #fff 100%)`,
                border: `2px solid ${color}55`,
                borderRadius: 3,
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                boxShadow: `0 8px 32px ${color}22`,
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                    transform: 'translateY(-8px) scale(1.03)',
                    border: `2px solid ${color}`,
                    boxShadow: `0 20px 40px ${color}44`,
                },
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '5px',
                    background: `linear-gradient(90deg, ${color}, ${color}dd)`,
                    boxShadow: `0 0 15px ${color}60`,
                },
            }}
        >
            <CardContent sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                minHeight: 0,
            }}>
                {/* Header con materia y trend */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, minHeight: 32, flexShrink: 0 }}>
                    <Typography
                        variant="subtitle2"
                        noWrap
                        sx={{
                            color: 'text.secondary',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            maxWidth: '170px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {materia}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        {getTrendIcon()}
                        {canEdit && (
                            <>
                                <IconButton
                                    size="small"
                                    onClick={handleMenuOpen}
                                    sx={{
                                        color: 'text.secondary',
                                        '&:hover': { color: color },
                                    }}
                                >
                                    <MoreVert fontSize="small" />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleMenuClose}
                                >
                                    {canEdit && (
                                        <MenuItem onClick={handleEdit}>
                                            <ListItemIcon>
                                                <Edit fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText>Editar calificación</ListItemText>
                                        </MenuItem>
                                    )}
                                </Menu>
                            </>
                        )}
                    </Box>
                </Box>

                {/* Circular Progress en el centro */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1,
                        minHeight: 0,
                        mb: 2,
                    }}
                >
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                        {/* Background circle */}
                        <CircularProgress
                            variant="determinate"
                            value={100}
                            size={120}
                            thickness={3}
                            sx={{
                                color: 'rgba(255, 255, 255, 0.05)',
                                position: 'absolute',
                            }}
                        />
                        {/* Progress circle */}
                        <CircularProgress
                            variant="determinate"
                            value={percentage}
                            size={120}
                            thickness={3}
                            sx={{
                                color: color,
                                filter: `drop-shadow(0 0 8px ${color}60)`,
                                '& .MuiCircularProgress-circle': {
                                    strokeLinecap: 'round',
                                },
                            }}
                        />
                        {/* Score in center */}
                        <Box
                            sx={{
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                                position: 'absolute',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                            }}
                        >
                            <Typography
                                variant="h3"
                                component="div"
                                fontWeight={800}
                                sx={{
                                    color: color,
                                    fontFamily: 'monospace',
                                    lineHeight: 1,
                                }}
                            >
                                {nota}
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: 'rgba(255, 255, 255, 0.4)',
                                    fontFamily: 'monospace',
                                    fontSize: '0.7rem',
                                }}
                            >
                                / {notaMaxima}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Percentage bar at bottom */}
                <Box
                    sx={{
                        p: 2,
                        bgcolor: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: 1.5,
                        border: '1px solid rgba(255, 255, 255, 0.03)',
                        textAlign: 'center',
                        flexShrink: 0,
                    }}
                >
                    <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{
                            color: color,
                            fontFamily: 'monospace',
                        }}
                    >
                        {percentage.toFixed(1)}%
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            color: 'rgba(255, 255, 255, 0.5)',
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                            fontSize: '0.65rem',
                        }}
                    >
                        Rendimiento
                    </Typography>
                </Box>
            </CardContent>
        </Box>
    );
};
