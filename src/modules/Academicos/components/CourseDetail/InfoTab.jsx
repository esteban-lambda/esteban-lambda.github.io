import { Box, Typography, Grid, Divider } from '@mui/material';

export const InfoTab = ({ asignatura }) => {
  return (
    <Box px={3}>
      <Grid container spacing={3}>
        {/* Descripción */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Descripción
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {asignatura.descripcion || 'Sin descripción disponible'}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        {/* Información general */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Información General
          </Typography>
          <Box>
            <InfoRow label="Código" value={asignatura.codigo || 'N/A'} />
            <InfoRow label="Créditos" value={asignatura.creditos || 0} />
            <InfoRow label="Horas semanales" value={asignatura.horas_semanales || 0} />
            <InfoRow label="Estado" value={asignatura.estado?.toUpperCase() || 'ACTIVO'} />
          </Box>
        </Grid>

        {/* Información académica */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Información Académica
          </Typography>
          <Box>
            <InfoRow
              label="Docente"
              value={asignatura.docente?.nombre || 'Sin asignar'}
            />
            <InfoRow
              label="Período"
              value={asignatura.periodo?.nombre || 'Sin período'}
            />
            <InfoRow
              label="Total estudiantes"
              value={asignatura.total_estudiantes || 0}
            />
            <InfoRow
              label="Fecha de inicio"
              value={asignatura.fecha_inicio
                ? new Date(asignatura.fecha_inicio).toLocaleDateString()
                : 'N/A'}
            />
            <InfoRow
              label="Fecha de fin"
              value={asignatura.fecha_fin
                ? new Date(asignatura.fecha_fin).toLocaleDateString()
                : 'N/A'}
            />
          </Box>
        </Grid>

        {/* Objetivos */}
        {asignatura.objetivos && (
          <>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Objetivos
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {asignatura.objetivos}
              </Typography>
            </Grid>
          </>
        )}

        {/* Contenidos */}
        {asignatura.contenidos && (
          <>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Contenidos
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {asignatura.contenidos}
              </Typography>
            </Grid>
          </>
        )}

        {/* Metodología */}
        {asignatura.metodologia && (
          <>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Metodología
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {asignatura.metodologia}
              </Typography>
            </Grid>
          </>
        )}

        {/* Evaluación */}
        {asignatura.evaluacion && (
          <>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Sistema de Evaluación
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {asignatura.evaluacion}
              </Typography>
            </Grid>
          </>
        )}

        {/* Bibliografía */}
        {asignatura.bibliografia && (
          <>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Bibliografía
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {asignatura.bibliografia}
              </Typography>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

const InfoRow = ({ label, value }) => (
  <Box display="flex" justifyContent="space-between" py={1}>
    <Typography variant="body2" color="text.secondary">
      {label}:
    </Typography>
    <Typography variant="body2" fontWeight="medium">
      {value}
    </Typography>
  </Box>
);
