import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  IconButton,
  Chip,
  Paper,
  Divider,
} from '@mui/material';
import {
  InsertDriveFile as FileIcon,
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  Description as DocIcon,
  Image as ImageIcon,
  Archive as ZipIcon,
  VideoLibrary as VideoIcon,
} from '@mui/icons-material';
import PropTypes from 'prop-types';

const DownloadPanel = ({
  files = [],
  title = 'Archivos disponibles',
  onDownload,
  showSize = true,
  emptyMessage = 'No hay archivos disponibles',
}) => {
  const getFileIcon = (type) => {
    const fileType = type?.toLowerCase() || '';
    if (fileType.includes('pdf')) return <PdfIcon color="error" />;
    if (fileType.includes('doc') || fileType.includes('word'))
      return <DocIcon color="primary" />;
    if (fileType.includes('image') || fileType.includes('jpg') || fileType.includes('png'))
      return <ImageIcon color="success" />;
    if (fileType.includes('zip') || fileType.includes('rar'))
      return <ZipIcon color="warning" />;
    if (fileType.includes('video') || fileType.includes('mp4'))
      return <VideoIcon color="secondary" />;
    return <FileIcon />;
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDownload = (file) => {
    if (onDownload) {
      onDownload(file);
    } else if (file.url) {
      // Descarga por defecto
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (files.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          textAlign: 'center',
          backgroundColor: 'background.default',
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        <Typography color="text.secondary">{emptyMessage}</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
        {showSize && (
          <Typography variant="caption" color="text.secondary">
            {files.length} archivo{files.length !== 1 ? 's' : ''}
          </Typography>
        )}
      </Box>
      <Divider />
      <List sx={{ py: 0 }}>
        {files.map((file, index) => (
          <ListItem
            key={file.id || index}
            disablePadding
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="descargar"
                onClick={() => handleDownload(file)}
                sx={{
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'primary.dark',
                  },
                }}
              >
                <DownloadIcon />
              </IconButton>
            }
          >
            <ListItemButton onClick={() => handleDownload(file)}>
              <ListItemIcon>{getFileIcon(file.type)}</ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" fontWeight={500}>
                    {file.name}
                  </Typography>
                }
                secondary={
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                    {showSize && file.size && (
                      <Chip
                        label={formatBytes(file.size)}
                        size="small"
                        variant="outlined"
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                    )}
                    {file.type && (
                      <Chip
                        label={file.type}
                        size="small"
                        color="default"
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

DownloadPanel.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string.isRequired,
      url: PropTypes.string,
      size: PropTypes.number,
      type: PropTypes.string,
    })
  ),
  title: PropTypes.string,
  onDownload: PropTypes.func,
  showSize: PropTypes.bool,
  emptyMessage: PropTypes.string,
};

export default DownloadPanel;
