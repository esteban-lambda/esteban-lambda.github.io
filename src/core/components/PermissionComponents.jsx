import { Box, Tooltip, IconButton } from '@mui/material';
import { usePermissions } from '../hooks/usePermissions';

/**
 * Componente para mostrar/ocultar elementos según permisos
 * @param {Object} props
 * @param {string|string[]} props.roles - Rol(es) requerido(s)
 * @param {string} props.permission - Permiso específico requerido
 * @param {React.ReactNode} props.children - Contenido a mostrar si tiene permisos
 * @param {React.ReactNode} props.fallback - Contenido alternativo si no tiene permisos
 */
export const Can = ({ roles, permission, children, fallback = null }) => {
  const { hasRole, can } = usePermissions();

  let hasPermission = true;

  if (roles) {
    hasPermission = hasRole(roles);
  }

  if (permission && hasPermission) {
    hasPermission = can(permission);
  }

  return hasPermission ? children : fallback;
};

/**
 * Componente para deshabilitar elementos según permisos
 */
export const DisabledIfNot = ({ 
  roles, 
  permission, 
  children, 
  tooltipText = 'No tienes permisos para realizar esta acción' 
}) => {
  const { hasRole, can } = usePermissions();

  let hasPermission = true;

  if (roles) {
    hasPermission = hasRole(roles);
  }

  if (permission && hasPermission) {
    hasPermission = can(permission);
  }

  if (!hasPermission) {
    return (
      <Tooltip title={tooltipText}>
        <Box component="span" sx={{ cursor: 'not-allowed', opacity: 0.5 }}>
          {children}
        </Box>
      </Tooltip>
    );
  }

  return children;
};

/**
 * Badge de rol para mostrar el rol del usuario
 */
export const RoleBadge = ({ rol }) => {
  const getRoleConfig = (role) => {
    const configs = {
      administrador: { label: 'Admin', color: 'error' },
      docente: { label: 'Docente', color: 'success' },
      estudiante: { label: 'Estudiante', color: 'info' },
    };
    return configs[role] || { label: role, color: 'default' };
  };

  const config = getRoleConfig(rol);

  return (
    <Box
      component="span"
      sx={{
        px: 1.5,
        py: 0.5,
        borderRadius: 1,
        fontSize: '0.75rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        bgcolor: `${config.color}.main`,
        color: 'white',
      }}
    >
      {config.label}
    </Box>
  );
};
