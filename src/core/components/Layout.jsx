import { Box, AppBar, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem, Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Divider } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu as MenuIcon, 
  Dashboard, 
  Assignment, 
  Grade, 
  Settings, 
  Logout, 
  Person, 
  AssignmentTurnedIn, 
  TrendingUp, 
  Assessment, 
  ManageAccounts, 
  School,
  Notifications,
  Security,
  LibraryBooks,
  AddTask
} from '@mui/icons-material';
import { useAuth, getRoleDisplayName } from '../../modules/Usuarios';
import { PermissionGate } from './PermissionGate';

const drawerWidth = 240;

/**
 * Menú de navegación organizado por roles y permisos
 * Cada usuario solo ve las opciones a las que tiene acceso
 */
const menuItems = [
  // ========================================
  // SECCIÓN COMÚN - Todos los usuarios
  // ========================================
  { 
    text: 'Dashboard', 
    icon: <Dashboard />, 
    path: '/dashboard',
    alwaysShow: true,
    section: 'general'
  },
  
  // ========================================
  // SECCIÓN ADMINISTRACIÓN - Solo Admin
  // ========================================
  { 
    text: 'Gestión de Usuarios', 
    icon: <ManageAccounts />, 
    path: '/usuarios',
    permissions: ['usuarios.gestionar_usuarios'],
    section: 'admin',
    description: 'Crear y gestionar usuarios del sistema'
  },
  
  { 
    text: 'Permisos y Roles', 
    icon: <Security />, 
    path: '/usuarios/permisos',
    permissions: ['usuarios.asignar_roles', 'usuarios.gestionar_usuarios'],
    section: 'admin',
    description: 'Asignar roles y permisos'
  },
  
  { 
    text: 'Gestión de Asignaturas', 
    icon: <LibraryBooks />, 
    path: '/academicos/asignaturas-gestion',
    permissions: ['academicos.crear_asignatura', 'academicos.editar_asignatura'],
    section: 'admin',
    description: 'Administrar asignaturas del sistema'
  },
  
  { 
    text: 'Notificaciones', 
    icon: <Notifications />, 
    path: '/academicos/notificaciones',
    permissions: ['academicos.gestionar_periodos'],
    section: 'admin',
    description: 'Gestionar recordatorios y notificaciones'
  },
  
  { 
    text: 'Reportes del Sistema', 
    icon: <Assessment />, 
    path: '/reportes',
    permissions: ['academicos.ver_estadisticas'],
    section: 'admin',
    description: 'Ver estadísticas y reportes generales'
  },
  
  { 
    text: 'Reportes Mensuales', 
    icon: <Assessment />, 
    path: '/academicos/reportes-mensuales',
    permissions: ['usuarios.recibir_notificacion_estado_mensual'],
    section: 'admin',
    description: 'Reportes mensuales del sistema'
  },
  
  // ========================================
  // SECCIÓN DOCENTE - Profesores
  // ========================================
  { 
    text: 'Mis Asignaturas', 
    icon: <School />, 
    path: '/cursos',
    alwaysShow: true,
    section: 'docente'
  },
  
  { 
    text: 'Nueva Tarea', 
    icon: <AddTask />, 
    path: '/academicos/nueva-tarea',
    permissions: ['academicos.crear_tarea'],
    section: 'docente',
    description: 'Crear tareas para estudiantes'
  },
  
  { 
    text: 'Calificar Entregas', 
    icon: <Grade />, 
    path: '/calificaciones',
    permissions: ['academicos.crear_calificacion'],
    section: 'docente',
    description: 'Revisar y calificar trabajos'
  },
  
  // ========================================
  // SECCIÓN ESTUDIANTE - Alumnos
  // ========================================
  { 
    text: 'Tareas', 
    icon: <Assignment />, 
    path: '/tareas',
    alwaysShow: true,
    section: 'estudiante'
  },
  
  { 
    text: 'Mis Entregas', 
    icon: <AssignmentTurnedIn />, 
    path: '/entregas',
    alwaysShow: true,
    section: 'estudiante'
  },
  
  { 
    text: 'Mis Calificaciones', 
    icon: <Grade />, 
    path: '/calificaciones',
    permissions: ['academicos.ver_calificaciones'],
    section: 'estudiante',
    description: 'Ver mis notas'
  },
  
  { 
    text: 'Mi Progreso', 
    icon: <TrendingUp />, 
    path: '/progreso',
    alwaysShow: true,
    section: 'estudiante'
  },
];

export const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout, role, permissions } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Verificar si un item debe mostrarse
  const shouldShowItem = (item) => {
    // Staff y superuser ven todo (soportar tanto español como inglés)
    if (user?.is_staff || user?.is_superuser || user?.es_staff || user?.es_superusuario) return true;
    
    // Items marcados como alwaysShow
    if (item.alwaysShow) return true;
    
    // Items con permisos específicos
    if (item.permissions) {
      return permissions.hasAnyPermission(item.permissions);
    }
    
    return false;
  };

  const visibleMenuItems = menuItems.filter(shouldShowItem);

  // Agrupar items por sección
  const groupedItems = {
    general: visibleMenuItems.filter(item => item.section === 'general'),
    admin: visibleMenuItems.filter(item => item.section === 'admin'),
    docente: visibleMenuItems.filter(item => item.section === 'docente'),
    estudiante: visibleMenuItems.filter(item => item.section === 'estudiante'),
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Componente para renderizar items del menú
  const renderMenuItems = (items) => (
    items.map((item) => (
      <ListItemButton
        key={item.text}
        onClick={() => navigate(item.path)}
        selected={location.pathname === item.path}
        sx={{
          borderRadius: 1.5,
          mb: 0.5,
          py: 1.5,
          px: 2,
          '&.Mui-selected': {
            bgcolor: '#EBF4FF',
            color: '#4169FF',
            '& .MuiListItemIcon-root': {
              color: '#4169FF',
            },
            '&:hover': {
              bgcolor: '#DBEAFE',
            },
          },
          '&:hover': {
            bgcolor: '#F7FAFC',
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: 40, color: '#718096' }}>
          {item.icon}
        </ListItemIcon>
        <ListItemText 
          primary={item.text}
          primaryTypographyProps={{
            fontSize: '14px',
            fontWeight: location.pathname === item.path ? 600 : 500,
          }}
        />
      </ListItemButton>
    ))
  );

  const drawer = (
    <Box sx={{ height: '100%', bgcolor: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 1.5,
            bgcolor: '#4169FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body1" sx={{ color: 'white', fontWeight: 700, fontSize: '16px' }}>
            EP
          </Typography>
        </Box>
        <Typography variant="h6" fontWeight={700} sx={{ fontSize: '18px', color: '#1A202C' }}>
          EduPro 360
        </Typography>
      </Box>
      
      {/* Rol del usuario */}
      <Box sx={{ px: 3, pb: 2 }}>
        <Box sx={{ bgcolor: '#F7FAFC', borderRadius: 1.5, py: 1, px: 2 }}>
          <Typography variant="caption" sx={{ color: '#718096', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
            Rol actual
          </Typography>
          <Typography variant="body2" sx={{ color: '#1A202C', fontSize: '13px', fontWeight: 600, mt: 0.5 }}>
            {getRoleDisplayName(role)}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', px: 2 }}>
        {/* Sección General */}
        {groupedItems.general.length > 0 && (
          <List sx={{ py: 0 }}>
            {renderMenuItems(groupedItems.general)}
          </List>
        )}

        {/* Sección Administración */}
        {groupedItems.admin.length > 0 && (
          <>
            <Divider sx={{ my: 2, mx: 1 }} />
            <Box sx={{ px: 2, mb: 1 }}>
              <Typography variant="caption" sx={{ color: '#A0AEC0', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Administración
              </Typography>
            </Box>
            <List sx={{ py: 0 }}>
              {renderMenuItems(groupedItems.admin)}
            </List>
          </>
        )}

        {/* Sección Docente */}
        {groupedItems.docente.length > 0 && (
          <>
            <Divider sx={{ my: 2, mx: 1 }} />
            <Box sx={{ px: 2, mb: 1 }}>
              <Typography variant="caption" sx={{ color: '#A0AEC0', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Gestión Docente
              </Typography>
            </Box>
            <List sx={{ py: 0 }}>
              {renderMenuItems(groupedItems.docente)}
            </List>
          </>
        )}

        {/* Sección Estudiante */}
        {groupedItems.estudiante.length > 0 && (
          <>
            <Divider sx={{ my: 2, mx: 1 }} />
            <Box sx={{ px: 2, mb: 1 }}>
              <Typography variant="caption" sx={{ color: '#A0AEC0', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Mis Actividades
              </Typography>
            </Box>
            <List sx={{ py: 0 }}>
              {renderMenuItems(groupedItems.estudiante)}
            </List>
          </>
        )}
      </Box>

      {/* User Profile Footer */}
      <Box sx={{ p: 2, borderTop: '1px solid #E2E8F0' }}>
        <ListItem
          sx={{
            borderRadius: 1.5,
            bgcolor: '#F7FAFC',
            cursor: 'pointer',
            border: '1px solid #E2E8F0',
            '&:hover': {
              bgcolor: '#EBF4FF',
            }
          }}
          onClick={handleMenuOpen}
        >
          <Avatar sx={{ width: 36, height: 36, mr: 1.5, bgcolor: '#4169FF', fontSize: '14px', fontWeight: 700 }}>
            {user?.nombre?.[0] || 'U'}
          </Avatar>
          <ListItemText
            primary={user?.nombre || user?.username || 'Usuario'}
            secondary={getRoleDisplayName(role)}
            primaryTypographyProps={{ fontWeight: 600, fontSize: '14px', color: '#1A202C' }}
            secondaryTypographyProps={{ fontSize: '12px', color: '#718096' }}
          />
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'grey.50' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Gestión Académica
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          bgcolor: '#F5F7FA',
        }}
      >
        {children}
      </Box>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
      >
        <MenuItem onClick={() => { navigate('/perfil'); handleMenuClose(); }}>
          <ListItemIcon><Person fontSize="small" /></ListItemIcon>
          <ListItemText>Mi Perfil</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { navigate('/configuracion'); handleMenuClose(); }}>
          <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
          <ListItemText>Configuración</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
          <ListItemText>Cerrar Sesión</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};
