import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/core/components';
import { authService } from '../services/authService';
import { useAuth } from './useAuth';

export const useLogin = () => {
  const navigate = useNavigate();
  const { login: setAuth } = useAuth();

  const mutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAuth(data);
      toast.success('¡Bienvenido! Has iniciado sesión correctamente', 'Inicio de sesión exitoso');
      navigate('/dashboard');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Credenciales inválidas', 'Error al iniciar sesión');
    },
  });

  return {
    login: mutation.mutate,
    isLoading: mutation.isPending,
  };
};
