import { useState } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  Grid,
  Avatar,
  Button,
  TextField,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Edit as EditIcon,
  VpnKey as VpnKeyIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { Layout } from '@/core/components/Layout';
import { useMiPerfil, useUpdatePerfil, useChangePassword } from '../hooks';
import { useAuth } from '../hooks/useAuth';

export const ProfilePage = () => {
  const { user } = useAuth();
  const { data: perfil, isLoading, error } = useMiPerfil();
  const { mutate: updatePerfil, isPending: isUpdating } = useUpdatePerfil();
  const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword();

  const [editMode, setEditMode] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    codigo: '',
  });
  const [passwordData, setPasswordData] = useState({
    contrasena_actual: '',
    nueva_contrasena: '',
    confirmar_contrasena: '',
  });

  const handleEdit = () => {
    setFormData({
      nombre: perfil?.nombre || '',
      email: perfil?.email || '',
      telefono: perfil?.telefono || '',
      codigo: perfil?.codigo || '',
    });
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      codigo: '',
    });
  };

  const handleSave = () => {
    updatePerfil(formData, {
      onSuccess: () => {
        setEditMode(false);
      },
    });
  };

  const handleOpenPasswordDialog = () => {
    setPasswordDialogOpen(true);
  };

  const handleClosePasswordDialog = () => {
    setPasswordDialogOpen(false);
    setPasswordData({
      contrasena_actual: '',
      nueva_contrasena: '',
      confirmar_contrasena: '',
    });
  };

  const handleChangePasswordSubmit = () => {
    if (passwordData.nueva_contrasena !== passwordData.confirmar_contrasena) {
      alert('Las contraseñas no coinciden');
      return;
    }

    changePassword(
      {
        id: user?.id,
        data: {
          contrasena_actual: passwordData.contrasena_actual,
          nueva_contrasena: passwordData.nueva_contrasena,
        },
      },
      {
        onSuccess: handleClosePasswordDialog,
      }
    );
  };

  const getInitials = (nombre) => {
    if (!nombre) return '?';
    const parts = nombre.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return nombre[0].toUpperCase();
  };

  if (isLoading) {
    return (
      <Layout>
        <Container maxWidth="md">
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
        <Container maxWidth="md">
          <Box py={4}>
            <Alert severity="error">Error al cargar el perfil: {error.message}</Alert>
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="md">
        <Box py={4}>
          {/* Header */}
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Mi Perfil
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4}>
            Gestiona tu información personal y configuración de cuenta
          </Typography>

          {/* Información principal */}
          <Paper sx={{ p: 4, mb: 3 }}>
            <Box display="flex" alignItems="center" gap={3} mb={3}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: 'primary.main',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                }}
              >
                {getInitials(perfil?.nombre)}
              </Avatar>
              <Box flexGrow={1}>
                <Typography variant="h5" fontWeight="bold">
                  {perfil?.nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {perfil?.email}
                </Typography>
                <Box display="flex" gap={1} mt={1}>
                  <Chip label={perfil?.rol?.toUpperCase()} color="primary" size="small" />
                  <Chip
                    label={perfil?.estado?.toUpperCase()}
                    color={perfil?.estado === 'activo' ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
              </Box>
              {!editMode && (
                <Box>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={handleEdit}
                    sx={{ mb: 1 }}
                    fullWidth
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<VpnKeyIcon />}
                    onClick={handleOpenPasswordDialog}
                    fullWidth
                  >
                    Cambiar Contraseña
                  </Button>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Formulario */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nombre completo"
                  value={editMode ? formData.nombre : perfil?.nombre || ''}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  fullWidth
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Código"
                  value={editMode ? formData.codigo : perfil?.codigo || 'N/A'}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  fullWidth
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  value={editMode ? formData.email : perfil?.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  fullWidth
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Teléfono"
                  value={editMode ? formData.telefono : perfil?.telefono || 'N/A'}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  fullWidth
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Rol" value={perfil?.rol || ''} fullWidth disabled />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Estado" value={perfil?.estado || ''} fullWidth disabled />
              </Grid>
            </Grid>

            {editMode && (
              <Box display="flex" gap={2} justifyContent="flex-end" mt={3}>
                <Button onClick={handleCancel}>Cancelar</Button>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </Box>
            )}
          </Paper>

          {/* Información adicional */}
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Información de la Cuenta
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Fecha de registro
                </Typography>
                <Typography variant="body1">
                  {perfil?.date_joined
                    ? new Date(perfil.date_joined).toLocaleDateString()
                    : 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Último acceso
                </Typography>
                <Typography variant="body1">
                  {perfil?.last_login
                    ? new Date(perfil.last_login).toLocaleDateString()
                    : 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Dialog de cambio de contraseña */}
          <Dialog
            open={passwordDialogOpen}
            onClose={handleClosePasswordDialog}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Cambiar Contraseña</DialogTitle>
            <DialogContent>
              <Box pt={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Contraseña actual"
                      type="password"
                      value={passwordData.contrasena_actual}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, contrasena_actual: e.target.value })
                      }
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Nueva contraseña"
                      type="password"
                      value={passwordData.nueva_contrasena}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, nueva_contrasena: e.target.value })
                      }
                      fullWidth
                      required
                      helperText="Mínimo 8 caracteres"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Confirmar nueva contraseña"
                      type="password"
                      value={passwordData.confirmar_contrasena}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, confirmar_contrasena: e.target.value })
                      }
                      fullWidth
                      required
                    />
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClosePasswordDialog}>Cancelar</Button>
              <Button
                onClick={handleChangePasswordSubmit}
                variant="contained"
                disabled={isChangingPassword}
              >
                {isChangingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Container>
    </Layout>
  );
};
