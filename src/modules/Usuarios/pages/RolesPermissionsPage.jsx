import { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    TextField,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Checkbox,
    Tabs,
    Tab,
    Alert,
    Divider
} from '@mui/material';
import {
    Edit,
    Search,
    Security,
    Person,
    VpnKey
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { Layout } from '../../../core';
import { usuariosService } from '../services/usuariosService';
import { permisosService } from '../services/permisosService';

export const RolesPermissionsPage = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [usuarios, setUsuarios] = useState([]);
    const [permisos, setPermisos] = useState([]);
    const [roles, setRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [usuarioPermisos, setUsuarioPermisos] = useState([]);
    const [selectedPermisos, setSelectedPermisos] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [tabValue, setTabValue] = useState(0);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [usuariosData, permisosData, rolesData] = await Promise.all([
                usuariosService.getAll(),
                permisosService.getAll(),
                permisosService.getRoles()
            ]);
            
            setUsuarios(usuariosData.results || usuariosData);
            setPermisos(permisosData.results || permisosData);
            setRoles(rolesData.results || rolesData);
        } catch (error) {
            console.error('Error cargando datos:', error);
            enqueueSnackbar('Error al cargar datos', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [enqueueSnackbar]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleOpenDialog = async (usuario) => {
        setSelectedUsuario(usuario);
        setIsLoading(true);
        
        try {
            const permisos = await permisosService.getUsuarioPermisos(usuario.id);
            setUsuarioPermisos(permisos);
            
            // Pre-seleccionar permisos y roles actuales
            const permisosEspeciales = permisos.permisos_especiales || [];
            const rolesUsuario = permisos.permisos_roles || [];
            
            setSelectedPermisos(permisosEspeciales.map(p => p.id));
            setSelectedRoles(rolesUsuario.map(r => r.group_id));
        } catch (error) {
            console.error('Error cargando permisos del usuario:', error);
            enqueueSnackbar('Error al cargar permisos', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
        
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedUsuario(null);
        setUsuarioPermisos([]);
        setSelectedPermisos([]);
        setSelectedRoles([]);
        setTabValue(0);
    };

    const handleTogglePermiso = (permisoId) => {
        setSelectedPermisos(prev =>
            prev.includes(permisoId)
                ? prev.filter(id => id !== permisoId)
                : [...prev, permisoId]
        );
    };

    const handleToggleRol = (rolId) => {
        setSelectedRoles(prev =>
            prev.includes(rolId)
                ? prev.filter(id => id !== rolId)
                : [...prev, rolId]
        );
    };

    const handleSavePermisos = async () => {
        if (!selectedUsuario) return;

        setIsLoading(true);
        try {
            // Permisos actuales especiales
            const permisosActuales = usuarioPermisos.permisos_especiales?.map(p => p.id) || [];
            
            // Determinar qué permisos asignar y revocar
            const permisosAsignar = selectedPermisos.filter(id => !permisosActuales.includes(id));
            const permisosRevocar = permisosActuales.filter(id => !selectedPermisos.includes(id));

            // Ejecutar operaciones
            if (permisosAsignar.length > 0) {
                await permisosService.asignarPermisos(selectedUsuario.id, permisosAsignar);
            }
            if (permisosRevocar.length > 0) {
                await permisosService.revocarPermisos(selectedUsuario.id, permisosRevocar);
            }

            enqueueSnackbar('Permisos actualizados exitosamente', { variant: 'success' });
            handleCloseDialog();
            loadData();
        } catch (error) {
            console.error('Error actualizando permisos:', error);
            enqueueSnackbar('Error al actualizar permisos', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveRoles = async () => {
        if (!selectedUsuario) return;

        setIsLoading(true);
        try {
            // Roles actuales
            const rolesActuales = usuarioPermisos.permisos_roles?.map(r => r.group_id) || [];
            
            // Determinar qué roles asignar y revocar
            const rolesAsignar = selectedRoles.filter(id => !rolesActuales.includes(id));
            const rolesRevocar = rolesActuales.filter(id => !selectedRoles.includes(id));

            // Ejecutar operaciones
            if (rolesAsignar.length > 0) {
                await permisosService.asignarRoles(selectedUsuario.id, rolesAsignar);
            }
            if (rolesRevocar.length > 0) {
                await permisosService.revocarRoles(selectedUsuario.id, rolesRevocar);
            }

            enqueueSnackbar('Roles actualizados exitosamente', { variant: 'success' });
            handleCloseDialog();
            loadData();
        } catch (error) {
            console.error('Error actualizando roles:', error);
            enqueueSnackbar('Error al actualizar roles', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const filteredUsuarios = usuarios.filter(u =>
        u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Agrupar permisos por app
    const permisosGrouped = permisos.reduce((acc, permiso) => {
        const app = permiso.content_type_app || 'otros';
        if (!acc[app]) acc[app] = [];
        acc[app].push(permiso);
        return acc;
    }, {});

    return (
        <Layout>
            <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        Gestión de Permisos de Usuario
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Administra los permisos de cada usuario del sistema.
                    </Typography>
                </Box>
            </Box>

{/*             <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                    <strong>Sistema basado en permisos:</strong> Los usuarios reciben acceso únicamente mediante permisos específicos. Asigna permisos individuales según lo que puede o no puede hacer cada usuario.
                </Typography>
            </Alert> */}


            <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder="Buscar usuarios por nombre, email o username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
            </Paper>

            <TableContainer component={Paper} elevation={0}>
                <Table>
                    <TableHead sx={{ bgcolor: '#F7FAFC' }}>
                        <TableRow>
                            <TableCell><strong>Usuario</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Permisos Especiales</strong></TableCell>
                            <TableCell><strong>Estado</strong></TableCell>
                            <TableCell align="center"><strong>Acciones</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsuarios.map((usuario) => (
                            <TableRow key={usuario.id} hover>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Person sx={{ mr: 1, color: 'text.secondary' }} />
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                {usuario.first_name} {usuario.last_name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                @{usuario.username}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>{usuario.email}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={usuario.user_permissions?.length || 0}
                                        size="small"
                                        color="info"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={usuario.is_active ? 'Activo' : 'Inactivo'}
                                        color={usuario.is_active ? 'success' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        size="small"
                                        onClick={() => handleOpenDialog(usuario)}
                                        color="primary"
                                    >
                                        <Edit />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog de edición de permisos */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Security sx={{ mr: 1, color: '#4169FF' }} />
                        <Box>
                            <Typography variant="h6">
                                Gestionar Permisos
                            </Typography>
                            {selectedUsuario && (
                                <Typography variant="body2" color="text.secondary">
                                    {selectedUsuario.first_name} {selectedUsuario.last_name} (@{selectedUsuario.username})
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Selecciona permisos específicos para este usuario
                        </Alert>
                        {Object.entries(permisosGrouped).map(([app, permisosApp]) => (
                            <Box key={app} sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, textTransform: 'capitalize' }}>
                                    {app}
                                </Typography>
                                <Divider sx={{ mb: 1 }} />
                                <List dense>
                                    {permisosApp.map((permiso) => (
                                        <ListItem
                                            key={permiso.id}
                                            button
                                            onClick={() => handleTogglePermiso(permiso.id)}
                                        >
                                            <ListItemIcon>
                                                <Checkbox
                                                    edge="start"
                                                    checked={selectedPermisos.includes(permiso.id)}
                                                    tabIndex={-1}
                                                    disableRipple
                                                />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={permiso.name}
                                                secondary={permiso.codename}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button
                        onClick={handleSavePermisos}
                        variant="contained"
                        disabled={isLoading}
                        sx={{ bgcolor: '#4169FF' }}
                    >
                        {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
        </Layout>
    );
};
