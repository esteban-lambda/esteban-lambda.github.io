import { Box, CircularProgress, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const Loader = ({
  size = 'medium',
  message = 'Cargando...',
  fullScreen = false,
  color = 'primary',
  showMessage = true,
}) => {
  const sizeMap = {
    small: 30,
    medium: 40,
    large: 60,
  };

  const spinnerSize = sizeMap[size] || sizeMap.medium;

  const containerStyles = fullScreen
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
      };

  return (
    <Box sx={containerStyles}>
      <CircularProgress size={spinnerSize} color={color} />
      {showMessage && message && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mt: 2, fontWeight: 500 }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

Loader.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  message: PropTypes.string,
  fullScreen: PropTypes.bool,
  color: PropTypes.string,
  showMessage: PropTypes.bool,
};

export default Loader;
