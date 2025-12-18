import { useState, useRef } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Close as CloseIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import PropTypes from 'prop-types';

export const UploadFile = ({
  onUpload,
  acceptedFormats = ['*'],
  maxSize = 10,
  multiple = false,
  disabled = false,
  helperText,
}) => {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const validateFile = (file) => {
    // Validar tamaño
    if (file.size > maxSize * 1024 * 1024) {
      return `El archivo supera el tamaño máximo de ${maxSize}MB`;
    }

    // Validar formato
    if (acceptedFormats[0] !== '*') {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const isValid = acceptedFormats.some(format => 
        format.toLowerCase().includes(fileExtension)
      );
      if (!isValid) {
        return `Formato no permitido. Formatos aceptados: ${acceptedFormats.join(', ')}`;
      }
    }

    return null;
  };

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList);
    setError(null);

    // Validar cada archivo
    for (const file of newFiles) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    if (multiple) {
      setFiles((prev) => [...prev, ...newFiles]);
    } else {
      setFiles(newFiles);
    }

    if (onUpload) {
      setUploading(true);
      Promise.resolve(onUpload(multiple ? newFiles : newFiles[0]))
        .finally(() => setUploading(false));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setError(null);
  };

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click();
    }
  };

  return (
    <Box>
      <Box
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        sx={{
          border: '2px dashed',
          borderColor: error
            ? 'error.main'
            : dragActive
            ? 'primary.main'
            : 'divider',
          borderRadius: 3,
          padding: 4,
          textAlign: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          backgroundColor: dragActive ? 'action.hover' : 'background.paper',
          transition: 'all 0.2s',
          opacity: disabled ? 0.5 : 1,
          '&:hover': {
            borderColor: disabled ? 'divider' : 'primary.main',
            backgroundColor: disabled ? 'background.paper' : 'action.hover',
          },
        }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          onChange={handleChange}
          accept={acceptedFormats.join(',')}
          style={{ display: 'none' }}
          disabled={disabled}
        />

        <UploadIcon
          sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
        />

        <Typography variant="h6" gutterBottom>
          {dragActive
            ? 'Suelta los archivos aquí'
            : 'Arrastra archivos o haz clic para seleccionar'}
        </Typography>

        {helperText && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {helperText}
          </Typography>
        )}

        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
          {acceptedFormats[0] !== '*' && `Formatos: ${acceptedFormats.join(', ')} • `}
          Máximo {maxSize}MB
        </Typography>
      </Box>

      {uploading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {files.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Archivos seleccionados:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {files.map((file, index) => (
              <Chip
                key={index}
                icon={<FileIcon />}
                label={`${file.name} (${formatBytes(file.size)})`}
                onDelete={() => removeFile(index)}
                deleteIcon={<CloseIcon />}
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

UploadFile.propTypes = {
  onUpload: PropTypes.func,
  acceptedFormats: PropTypes.arrayOf(PropTypes.string),
  maxSize: PropTypes.number,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  helperText: PropTypes.string,
};

export default UploadFile;
