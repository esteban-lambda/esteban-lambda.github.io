import { api } from '../../../core';

export const authService = {
  login: async (credentials) => {
    // Transformar campos para que coincidan con el backend
    const { data } = await api.post('/auth/login/', {
      correo: credentials.email,
      contrasena: credentials.password,
      captchaToken: credentials.captchaToken // Agregar token de reCAPTCHA
    });
    return data;
  },

  register: async (userData) => {
    const { data } = await api.post('/auth/register/', userData);
    return data;
  },

  logout: async () => {
    const { data } = await api.post('/auth/logout/');
    return data;
  },

  refreshToken: async (refreshToken) => {
    const { data } = await api.post('/auth/refresh/', { refresh: refreshToken });
    return data;
  },

  getCurrentUser: async () => {
    const { data } = await api.get('/usuarios/usuarios/me/');
    return data;
  },

  changePassword: async (passwords) => {
    const { data } = await api.post('/auth/cambiar-contrasena/', passwords);
    return data;
  },

  requestPasswordReset: async (email) => {
    const { data } = await api.post('/auth/solicitar-recuperacion/', { email });
    return data;
  },

  resetPassword: async (token, newPassword) => {
    const { data } = await api.post('/auth/restablecer-contrasena/', {
      token,
      nueva_contrasena: newPassword,
    });
    return data;
  },
};
