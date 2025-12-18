import { Card, CardContent, Typography, Box, Chip, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { MoreVert, Edit, Visibility, PersonAdd } from '@mui/icons-material';
import { useState } from 'react';
import { useAuth } from '../../Usuarios';
import { useNavigate } from 'react-router-dom';

export const CourseCard = ({ curso, onEdit, onAssignTeacher }) => {
    const { can, user } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    
    const canManageCourse = can.canEditAsignatura(curso);
    const canAssignTeacher = can.hasPermission('academicos.asignar_docente');
    const isResponsibleTeacher = curso.docente_responsable_id === user?.user_id;

    const handleMenuOpen = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleViewDetails = () => {
        handleMenuClose();
        navigate(`/cursos/${curso.id}`);
    };

    const handleEdit = () => {
        handleMenuClose();
        onEdit?.(curso);
    };

    const handleAssignTeacher = () => {
        handleMenuClose();
        onAssignTeacher?.(curso);
    };

    return (
        <Card 
            sx={{ 
                height: '100%',
                cursor: 'pointer',
                '&:hover': {
                    boxShadow: 3
                }
            }}
            onClick={handleViewDetails}
        >
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" component="h2">
                        {curso.nombre}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                            label={curso.estado || 'Activa'}
                            color={curso.estado === 'activa' ? 'success' : 'default'}
                            size="small"
                        />
                        {canManageCourse && (
                            <IconButton 
                                size="small" 
                                onClick={handleMenuOpen}
                                sx={{ ml: 1 }}
                            >
                                <MoreVert />
                            </IconButton>
                        )}
                    </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {curso.descripcion || curso.codigo}
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" display="block">
                        Código: {curso.codigo}
                    </Typography>
                    <Typography variant="caption" display="block">
                        Docente: {curso.docente_responsable_nombre || 'Sin asignar'}
                    </Typography>
                    <Typography variant="caption" display="block">
                        Período: {curso.periodo_academico_nombre || 'N/A'}
                    </Typography>
                </Box>
            </CardContent>

            {/* Menú de acciones según permisos */}
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleViewDetails}>
                    <ListItemIcon>
                        <Visibility fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Ver Detalles</ListItemText>
                </MenuItem>

                {canAssignTeacher && (
                    <>
                        <MenuItem onClick={handleEdit}>
                            <ListItemIcon>
                                <Edit fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Editar</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleAssignTeacher}>
                            <ListItemIcon>
                                <PersonAdd fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Asignar Docente</ListItemText>
                        </MenuItem>
                    </>
                )}

                {canManageCourse && isResponsibleTeacher && !canAssignTeacher && (
                    <MenuItem onClick={handleEdit}>
                        <ListItemIcon>
                            <Edit fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Gestionar Curso</ListItemText>
                    </MenuItem>
                )}
            </Menu>
        </Card>
    );
};
