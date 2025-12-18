import { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  CheckCircle,
  Cancel,
  PersonAdd,
  School,
  AccessTime,
  People
} from '@mui/icons-material';

const getEstadoColor = (estado) => {
  const colores = {
    activa: 'success',
    inactiva: 'default',
    planificacion: 'warning',
    suspendida: 'error',
  };
  return colores[estado] || 'default';
};

const getEstadoLabel = (estado) => {
  const labels = {
    activa: 'Activa',
    inactiva: 'Inactiva',
    planificacion: 'En Planificación',
    suspendida: 'Suspendida',
  };
  return labels[estado] || estado;
};

export const CourseManagementCard = ({ 
  course, 
  onEdit, 
  onDelete, 
  onActivate, 
  onDeactivate,
  onAssignTeacher,
  canManage = false 
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action) => {
    handleMenuClose();
    action();
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: canManage ? 'translateY(-4px)' : 'none',
          boxShadow: canManage ? '0 12px 24px rgba(0,0,0,0.1)' : 1,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, position: 'relative' }}>
        {/* Botón de Menú */}
        {canManage && (
          <IconButton
            onClick={handleMenuOpen}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          >
            <MoreVert />
          </IconButton>
        )}

        {/* Código */}
        <Box
          sx={{
            display: 'inline-flex',
            px: 1.5,
            py: 0.5,
            bgcolor: 'primary.50',
            borderRadius: 1,
            mb: 2,
          }}
        >
          <Typography
            variant="caption"
            fontWeight={700}
            color="primary.main"
            sx={{ letterSpacing: 0.5 }}
          >
            {course.codigo}
          </Typography>
        </Box>

        {/* Nombre */}
        <Typography variant="h6" fontWeight={700} gutterBottom>
          {course.nombre}
        </Typography>

        {/* Descripción */}
        {course.descripcion && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {course.descripcion}
          </Typography>
        )}

        {/* Información */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {/* Período */}
          <Chip
            size="small"
            icon={<AccessTime />}
            label={course.periodo_academico_nombre || 'Sin período'}
            variant="outlined"
          />

          {/* Créditos */}
          {course.creditos > 0 && (
            <Chip
              size="small"
              icon={<School />}
              label={`${course.creditos} crédito${course.creditos !== 1 ? 's' : ''}`}
              variant="outlined"
            />
          )}

          {/* Cupo */}
          <Chip
            size="small"
            icon={<People />}
            label={`Cupo: ${course.cupo_maximo}`}
            variant="outlined"
          />
        </Box>

        {/* Docente Responsable */}
        {course.docente_responsable_nombre ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 1.5,
              bgcolor: 'grey.50',
              borderRadius: 1,
              mb: 2,
            }}
          >
            <School sx={{ fontSize: 20, color: 'text.secondary' }} />
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Docente Responsable
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {course.docente_responsable_nombre}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              p: 1.5,
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 1,
              mb: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary" align="center">
              Sin docente asignado
            </Typography>
          </Box>
        )}

        {/* Estado */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip
            label={getEstadoLabel(course.estado)}
            color={getEstadoColor(course.estado)}
            size="small"
          />
          <Typography variant="caption" color="text.secondary">
            {new Date(course.fecha_creacion).toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>

      {/* Menú de acciones */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: { minWidth: 200 }
        }}
      >
        <MenuItem onClick={() => handleAction(onEdit)}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleAction(onAssignTeacher)}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          <ListItemText>Asignar Docente</ListItemText>
        </MenuItem>

        {course.estado === 'inactiva' || course.estado === 'planificacion' ? (
          <MenuItem onClick={() => handleAction(onActivate)}>
            <ListItemIcon>
              <CheckCircle fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText>Activar</ListItemText>
          </MenuItem>
        ) : (
          <MenuItem onClick={() => handleAction(onDeactivate)}>
            <ListItemIcon>
              <Cancel fontSize="small" color="warning" />
            </ListItemIcon>
            <ListItemText>Desactivar</ListItemText>
          </MenuItem>
        )}

        <MenuItem onClick={() => handleAction(onDelete)} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Eliminar</ListItemText>
        </MenuItem>
      </Menu>
    </Card>
  );
};
