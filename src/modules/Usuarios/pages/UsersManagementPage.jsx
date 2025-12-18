import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Avatar,
  Alert,
  CircularProgress,
  Tooltip,
  Pagination,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  VpnKey as VpnKeyIcon,
} from '@mui/icons-material';
import { Layout } from '@/core/components/Layout';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../hooks';
import { useAuth } from '../hooks/useAuth';
import { isAdmin as checkIsAdmin } from '../utils/roleHelpers';
import { permisosService } from '../services/permisosService';

const ROLES = [
  { value: 'estudiante', label: 'Estudiante', color: 'info' },
  { value: 'docente', label: 'Docente', color: 'success' },
  { value: 'administrador', label: 'Administrador', color: 'error' },
];

const ESTADOS = [
  { value: 'activo', label: 'Activo', color: 'success' },
  { value: 'inactivo', label: 'Inactivo', color: 'default' },
  { value: 'bloqueado', label: 'Bloqueado', color: 'error' },
];

export const UsersManagementPage = () => {
  const { user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('todos');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // 'create' | 'edit'
  const [rolesBackend, setRolesBackend] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // Solicitar todos los usuarios con paginación grande del backend
  const { data: users, isLoading, error } = useUsers({ tamano_pagina: 100 });
  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutate: deleteUser, isPending: _isDeleting } = useDeleteUser();

  // Cargar roles del backend
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await permisosService.getRoles();
        const rolesData = data.results || data || [];
        console.log('Roles cargados del backend:', rolesData);
        setRolesBackend(rolesData);
      } catch (error) {
        console.error('Error loading roles:', error);
      }
    };
    fetchRoles();
  }, []);

  // Extraer el array de usuarios de la respuesta (puede ser paginada o directa)
  const usersArray = Array.isArray(users) ? users : (users?.results || []);
  
  // Debug: ver qué usuarios se están recibiendo
  useEffect(() => {
    if (usersArray && usersArray.length > 0) {
      console.log('Usuarios cargados:', usersArray.length);
      console.log('Primer usuario:', usersArray[0]);
      console.log('Roles del primer usuario:', usersArray[0]?.roles);
    }
  }, [usersArray]);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    correo_personal: '',
    password: '',
    codigo: '',
    telefono: '',
    rol: 'estudiante',
    estado: 'activo',
  });

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDialog = (mode, user = null) => {
    setDialogMode(mode);
    if (mode === 'edit' && user) {
      const userData = getUserData(user);
      const nombreParts = userData.nombre.split(' ');
      setFormData({
        nombre: nombreParts[0] || '',
        apellido: nombreParts.slice(1).join(' ') || '',
        email: userData.email,
        correo_personal: userData.correo_personal || '',
        password: '',
        codigo: userData.codigo,
        telefono: userData.telefono,
        rol: userData.rol,
        estado: userData.estado,
      });
      setSelectedUser(user);
    } else {
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        correo_personal: '',
        password: '',
        codigo: '',
        telefono: '',
        rol: 'estudiante',
        estado: 'activo',
      });
    }
    setDialogOpen(true);
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUser(null);
    setFormData({
      nombre: '',
      apellido: '',
      email: '',
      correo_personal: '',
      password: '',
      codigo: '',
      telefono: '',
      rol: 'estudiante',
      estado: 'activo',
    });
  };

  const mapFormDataToBackend = (data) => {
    // Encontrar el ID del rol seleccionado
    // Mapear los valores del frontend a nombres del backend
    const rolMapping = {
      'estudiante': ['Estudiantes', 'Estudiante', 'estudiante', 'alumno'],
      'docente': ['Docentes', 'Docente', 'docente', 'profesor'],
      'administrador': ['Administradores', 'Administrador', 'administrador', 'admin']
    };
    
    const nombresBusqueda = rolMapping[data.rol] || [data.rol];
    const rolSeleccionado = rolesBackend.find(r => 
      nombresBusqueda.some(nombre => r.nombre?.toLowerCase() === nombre.toLowerCase())
    );
    
    // El campo email del formulario es realmente el username
    // Extraer solo el username (sin @dominio si lo tiene)
    let nombreUsuario = data.email?.trim() || '';
    if (nombreUsuario.includes('@')) {
      nombreUsuario = nombreUsuario.split('@')[0];
    }
    nombreUsuario = nombreUsuario.toLowerCase();
    
    // El correo se genera automáticamente con dominio fijo en el backend
    const correoCompleto = `${nombreUsuario}@edupro.com.co`;
    
    const mapped = {
      nombre_usuario: nombreUsuario,
      correo: correoCompleto,
      correo_personal: data.correo_personal?.trim() || null,
      nombre: data.nombre?.trim() || '',
      apellido: data.apellido?.trim() || '',
      id_empleado: data.codigo?.trim() || '',
      telefono: data.telefono?.trim() || '',
      activo: data.estado === 'activo',
    };

    // Incluir rol si se encontró
    if (rolSeleccionado) {
      mapped.roles_ids = [rolSeleccionado.id];
      console.log('Rol asignado:', rolSeleccionado.nombre, 'ID:', rolSeleccionado.id);
    } else {
      console.warn('No se encontró rol para:', data.rol, 'Roles disponibles:', rolesBackend);
    }

    // Solo incluir contraseña si se proporcionó y no está vacía
    if (data.password && data.password.trim()) {
      mapped.password = data.password.trim();
    }

    console.log('Datos mapeados para backend:', mapped);
    return mapped;
  };

  const handleSubmit = () => {
    // Validar campos obligatorios
    const errores = [];
    
    if (!formData.nombre?.trim()) {
      errores.push('El nombre es obligatorio');
    }
    
    if (!formData.apellido?.trim()) {
      errores.push('El apellido es obligatorio');
    }
    
    if (!formData.email?.trim()) {
      errores.push('El nombre de usuario es obligatorio');
    } else if (formData.email.trim().length < 3) {
      errores.push('El nombre de usuario debe tener al menos 3 caracteres');
    } else if (!/^[a-zA-Z0-9._-]+$/.test(formData.email.trim())) {
      errores.push('El nombre de usuario solo puede contener letras, números, puntos, guiones y guiones bajos');
    }
    
    if (dialogMode === 'create') {
      if (!formData.password?.trim()) {
        errores.push('La contraseña es obligatoria');
      } else if (formData.password.length < 8) {
        errores.push('La contraseña debe tener al menos 8 caracteres');
      } else if (!/[A-Z]/.test(formData.password)) {
        errores.push('La contraseña debe contener al menos una letra mayúscula');
      } else if (!/[a-z]/.test(formData.password)) {
        errores.push('La contraseña debe contener al menos una letra minúscula');
      } else if (!/[0-9]/.test(formData.password)) {
        errores.push('La contraseña debe contener al menos un número');
      }
    }
    
    if (errores.length > 0) {
      alert('Por favor corrija los siguientes errores:\n\n' + errores.join('\n'));
      return;
    }
    
    const backendData = mapFormDataToBackend(formData);
    
    if (dialogMode === 'create') {
      createUser(backendData, {
        onSuccess: handleCloseDialog,
      });
    } else {
      updateUser(
        { id: selectedUser.id, data: backendData },
        {
          onSuccess: handleCloseDialog,
        }
      );
    }
  };

  const handleDelete = () => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
      deleteUser(selectedUser.id);
      handleMenuClose();
    }
  };

  const handleChangeStatus = (status) => {
    // El backend espera 'activo' como boolean, no 'estado' como string
    const activo = status === 'activo';
    updateUser(
      { id: selectedUser.id, data: { activo } },
      {
        onSuccess: handleMenuClose,
      }
    );
  };

  // Helper para obtener datos del usuario en diferentes formatos
  const getUserData = (user) => {
    // El backend devuelve roles como array de objetos {id, nombre}
    const roles = user.roles || [];
    
    // Mapear nombre de rol a los valores que usa el frontend
    let rolNormalizado = 'estudiante'; // valor por defecto
    
    if (roles.length > 0) {
      const nombreRol = roles[0].nombre?.toLowerCase() || '';
      
      // Mapear nombres del backend a valores del frontend
      if (nombreRol.includes('admin')) {
        rolNormalizado = 'administrador';
      } else if (nombreRol.includes('docent') || nombreRol.includes('profesor')) {
        rolNormalizado = 'docente';
      } else if (nombreRol.includes('estudiant') || nombreRol.includes('alumno')) {
        rolNormalizado = 'estudiante';
      } else {
        // Si no coincide con ninguno, usar el nombre directamente si está en nuestro ROLES
        const rolEncontrado = ROLES.find(r => r.label.toLowerCase() === nombreRol);
        if (rolEncontrado) {
          rolNormalizado = rolEncontrado.value;
        }
      }
    }
    
    return {
      nombre: user.nombre_completo || `${user.nombre || user.first_name || ''} ${user.apellido || user.last_name || ''}`.trim() || user.nombre_usuario || user.username || '',
      email: user.correo_institucional || user.correo || user.email || '',
      correo_personal: user.correo_personal || '',
      codigo: user.id_empleado || '',
      telefono: user.telefono || '',
      rol: rolNormalizado,
      estado: user.activo !== undefined ? (user.activo ? 'activo' : 'inactivo') : (user.is_active !== undefined ? (user.is_active ? 'activo' : 'inactivo') : 'activo'),
    };
  };

  const filteredUsers = usersArray?.filter((user) => {
    const userData = getUserData(user);
    
    const matchesSearch =
      userData.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userData.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userData.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'todos' || userData.rol === roleFilter;
    return matchesSearch && matchesRole;
  }) || [];

  // Calcular paginación
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset page cuando cambian los filtros
  useEffect(() => {
    setPage(1);
  }, [searchTerm, roleFilter]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const getRolChipColor = (rol) => {
    return ROLES.find((r) => r.value === rol)?.color || 'default';
  };

  const getEstadoChipColor = (estado) => {
    return ESTADOS.find((e) => e.value === estado)?.color || 'default';
  };

  const getInitials = (nombre) => {
    if (!nombre) return '?';
    const parts = nombre.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return nombre[0].toUpperCase();
  };

  // Verificar si el usuario actual es administrador
  const userIsAdmin = checkIsAdmin(currentUser);

  if (!userIsAdmin) {
    return (
      <Layout>
        <Container maxWidth="xl">
          <Box py={4}>
            <Alert severity="error">
              No tienes permisos para acceder a esta página. Solo los administradores pueden
              gestionar usuarios.
            </Alert>
          </Box>
        </Container>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <Container maxWidth="xl">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress size={60} />
          </Box>
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Container maxWidth="xl">
          <Box py={4}>
            <Alert severity="error">Error al cargar usuarios: {error.message}</Alert>
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="xl">
        <Box py={4}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Box>
              <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                Gestión de Usuarios
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Administra usuarios, roles y permisos del sistema
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('create')}
            >
              Nuevo Usuario
            </Button>
          </Box>

          {/* Filtros */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <TextField
                  placeholder="Buscar por nombre, email o código..."
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Filtrar por rol</InputLabel>
                  <Select
                    value={roleFilter}
                    label="Filtrar por rol"
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <MenuItem value="todos">Todos los roles</MenuItem>
                    {ROLES.map((rol) => (
                      <MenuItem key={rol.value} value={rol.value}>
                        {rol.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Estadísticas */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {usersArray?.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Usuarios
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color="info.main">
                  {usersArray?.filter((u) => getUserData(u).rol === 'estudiante').length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Estudiantes (total)
                </Typography>
                <Typography variant="body2" color="success.main">
                  Activos: {usersArray?.filter((u) => getUserData(u).rol === 'estudiante' && (u.activo || u.is_active)).length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Inactivos: {usersArray?.filter((u) => getUserData(u).rol === 'estudiante' && !(u.activo || u.is_active)).length || 0}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {usersArray?.filter((u) => getUserData(u).rol === 'docente').length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Docentes (total)
                </Typography>
                <Typography variant="body2" color="success.main">
                  Activos: {usersArray?.filter((u) => getUserData(u).rol === 'docente' && (u.activo || u.is_active)).length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Inactivos: {usersArray?.filter((u) => getUserData(u).rol === 'docente' && !(u.activo || u.is_active)).length || 0}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color="error.main">
                  {usersArray?.filter((u) => getUserData(u).rol === 'administrador').length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Administradores (total)
                </Typography>
                <Typography variant="body2" color="success.main">
                  Activos: {usersArray?.filter((u) => getUserData(u).rol === 'administrador' && (u.activo || u.is_active)).length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Inactivos: {usersArray?.filter((u) => getUserData(u).rol === 'administrador' && !(u.activo || u.is_active)).length || 0}
                </Typography>
              </Paper>
            </Grid>
                      <Grid item xs={6} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="h4" fontWeight="bold" color="warning.main">
                            {usersArray?.filter((u) => getUserData(u).rol === 'coordinador').length || 0}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Coordinadores (total)
                          </Typography>
                          <Typography variant="body2" color="success.main">
                            Activos: {usersArray?.filter((u) => getUserData(u).rol === 'coordinador' && (u.activo || u.is_active)).length || 0}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Inactivos: {usersArray?.filter((u) => getUserData(u).rol === 'coordinador' && !(u.activo || u.is_active)).length || 0}
                          </Typography>
                        </Paper>
                      </Grid>
          </Grid>

          {/* Tabla de usuarios */}
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Usuario</TableCell>
                    <TableCell>Código</TableCell>
                    <TableCell>Email Institucional</TableCell>
                    <TableCell>Email Personal</TableCell>
                    <TableCell>Rol</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Teléfono</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography color="text.secondary">No se encontraron usuarios</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedUsers.map((user) => {
                      const userData = getUserData(user);
                      return (
                      <TableRow key={user.id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              {getInitials(userData.nombre)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {userData.nombre}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ID: {user.id}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{userData.codigo || 'N/A'}</TableCell>
                        <TableCell>{userData.email}</TableCell>
                        <TableCell>{userData.correo_personal || 'N/A'}</TableCell>
                        <TableCell>
                          <Chip
                            label={userData.rol?.toUpperCase()}
                            color={getRolChipColor(userData.rol)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={userData.estado?.toUpperCase()}
                            color={getEstadoChipColor(userData.estado)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{userData.telefono || 'N/A'}</TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={(e) => handleMenuOpen(e, user)}>
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Paginación */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  shape="rounded"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </Paper>

          {/* Menu contextual */}
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={() => handleOpenDialog('edit', selectedUser)}>
              <EditIcon fontSize="small" sx={{ mr: 1 }} />
              Editar
            </MenuItem>
            {selectedUser && getUserData(selectedUser).estado === 'inactivo' && (
              <MenuItem onClick={() => handleChangeStatus('activo')}>
                <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} />
                Activar
              </MenuItem>
            )}
            {selectedUser && getUserData(selectedUser).estado === 'activo' && (
              <MenuItem onClick={() => handleChangeStatus('inactivo')}>
                <BlockIcon fontSize="small" sx={{ mr: 1 }} />
                Desactivar
              </MenuItem>
            )}
            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
              Eliminar
            </MenuItem>
          </Menu>

          {/* Dialog de crear/editar */}
          <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
            <DialogTitle>
              {dialogMode === 'create' ? 'Crear Nuevo Usuario' : 'Editar Usuario'}
            </DialogTitle>
            <DialogContent>
              <Box pt={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Nombre *"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Apellido *"
                      value={formData.apellido}
                      onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Nombre de Usuario *"
                      type="text"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      fullWidth
                      required
                      helperText="Se generará automáticamente: {nombre}{numero}@edupro.com.co"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Correo Personal"
                      type="email"
                      value={formData.correo_personal}
                      onChange={(e) => setFormData({ ...formData, correo_personal: e.target.value })}
                      fullWidth
                      placeholder="ejemplo@gmail.com"
                      helperText="Correo personal del usuario (opcional)"
                    />
                  </Grid>
                  {dialogMode === 'create' && (
                    <Grid item xs={12}>
                      <TextField
                        label="Contraseña *"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        fullWidth
                        required
                        helperText="Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número"
                      />
                    </Grid>
                  )}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Código"
                      value={formData.codigo}
                      onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Teléfono"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Rol</InputLabel>
                      <Select
                        value={formData.rol}
                        label="Rol"
                        onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                      >
                        {ROLES.map((rol) => (
                          <MenuItem key={rol.value} value={rol.value}>
                            {rol.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Estado</InputLabel>
                      <Select
                        value={formData.estado}
                        label="Estado"
                        onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                      >
                        {ESTADOS.map((estado) => (
                          <MenuItem key={estado.value} value={estado.value}>
                            {estado.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancelar</Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={isCreating || isUpdating}
              >
                {dialogMode === 'create'
                  ? isCreating
                    ? 'Creando...'
                    : 'Crear Usuario'
                  : isUpdating
                  ? 'Guardando...'
                  : 'Guardar Cambios'}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Container>
    </Layout>
  );
};
