import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './modules/Usuarios';
import { UsuariosRoutes } from './modules/Usuarios';
import { AcademicosRoutes } from './modules/Academicos';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {UsuariosRoutes()}
        {AcademicosRoutes()}
        
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
