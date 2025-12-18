import { Navigate } from 'react-router-dom';
import { useAuth } from '../../modules/Usuarios';
import { Alert, Box, Container } from '@mui/material';
import { Layout } from '../components/Layout';

/**
 * HOC para proteger rutas según roles
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente hijo a renderizar
 * @param {string[]} props.allowedRoles - Array de roles permitidos (ej: ['administrador', 'docente'])
 * @param {boolean} props.requireAuth - Si requiere autenticación (default: true)
 */
export const RoleBasedRoute = ({ 
  children, 
  allowedRoles = [], 
  requireAuth = true 
}) => {
  const { user, isAuthenticated } = useAuth();

  // Si requiere autenticación y no está autenticado, redirigir al login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si no hay roles especificados, permitir acceso a todos los usuarios autenticados
  if (allowedRoles.length === 0) {
    return children;
  }

  // Verificar si el usuario tiene alguno de los roles permitidos
  const hasRequiredRole = allowedRoles.includes(user?.rol);

  if (!hasRequiredRole) {
    return (
      <Layout>
        <Container maxWidth="xl">
          <Box py={4}>
            <Alert severity="error">
              No tienes permisos para acceder a esta página. Se requiere uno de los siguientes roles: {allowedRoles.join(', ')}
            </Alert>
          </Box>
        </Container>
      </Layout>
    );
  }

  return children;
};
