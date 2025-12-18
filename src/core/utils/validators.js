export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

export const minLength = (value, min) => {
  return value && value.length >= min;
};

export const maxLength = (value, max) => {
  return value && value.length <= max;
};

export const isNumeric = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

export const isInRange = (value, min, max) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= min && num <= max;
};

export const isValidPhone = (phone) => {
  const phoneRegex = /^[\d\s\-+()]{8,15}$/;
  return phoneRegex.test(phone);
};

export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidDate = (date) => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

export const isFutureDate = (date) => {
  return new Date(date) > new Date();
};

export const isPastDate = (date) => {
  return new Date(date) < new Date();
};

export const isStrongPassword = (password) => {
  // Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número, 1 símbolo
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  return strongRegex.test(password);
};

export const isEqual = (value1, value2) => {
  return value1 === value2;
};

export const validateForm = (values, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const value = values[field];
    const fieldRules = rules[field];

    fieldRules.forEach((rule) => {
      if (errors[field]) return; // Ya hay un error en este campo

      if (rule.type === 'required' && !isRequired(value)) {
        errors[field] = rule.message || 'Este campo es requerido';
      } else if (rule.type === 'email' && value && !isValidEmail(value)) {
        errors[field] = rule.message || 'Email inválido';
      } else if (rule.type === 'minLength' && !minLength(value, rule.value)) {
        errors[field] = rule.message || `Mínimo ${rule.value} caracteres`;
      } else if (rule.type === 'maxLength' && !maxLength(value, rule.value)) {
        errors[field] = rule.message || `Máximo ${rule.value} caracteres`;
      } else if (rule.type === 'custom' && rule.validator && !rule.validator(value)) {
        errors[field] = rule.message || 'Valor inválido';
      }
    });
  });

  return errors;
};

export default {
  isValidEmail,
  isRequired,
  minLength,
  maxLength,
  isNumeric,
  isInRange,
  isValidPhone,
  isValidUrl,
  isValidDate,
  isFutureDate,
  isPastDate,
  isStrongPassword,
  isEqual,
  validateForm,
};
