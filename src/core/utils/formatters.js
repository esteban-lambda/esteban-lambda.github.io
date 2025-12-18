export const formatCurrency = (amount, currency = 'USD', locale = 'es-ES') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatDate = (date, format = 'medium', locale = 'es-ES') => {
  if (!date) return '';
  
  const d = new Date(date);
  const options = {
    short: { dateStyle: 'short' },
    medium: { dateStyle: 'medium' },
    long: { dateStyle: 'long' },
    full: { dateStyle: 'full' },
  };

  return new Intl.DateTimeFormat(locale, options[format] || options.medium).format(d);
};

export const formatDateTime = (date, locale = 'es-ES') => {
  if (!date) return '';
  
  const d = new Date(date);
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d);
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) return 'hace unos segundos';
  if (diffMin < 60) return `hace ${diffMin} minuto${diffMin !== 1 ? 's' : ''}`;
  if (diffHour < 24) return `hace ${diffHour} hora${diffHour !== 1 ? 's' : ''}`;
  if (diffDay < 30) return `hace ${diffDay} día${diffDay !== 1 ? 's' : ''}`;
  if (diffMonth < 12) return `hace ${diffMonth} mes${diffMonth !== 1 ? 'es' : ''}`;
  return `hace ${diffYear} año${diffYear !== 1 ? 's' : ''}`;
};

export const formatNumber = (number, locale = 'es-ES') => {
  return new Intl.NumberFormat(locale).format(number);
};

export const formatPercentage = (value, decimals = 0) => {
  const percentage = value > 1 ? value : value * 100;
  return `${percentage.toFixed(decimals)}%`;
};

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

export const capitalize = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export const toTitleCase = (string) => {
  if (!string) return '';
  return string
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const truncateText = (text, maxLength = 50, suffix = '...') => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + suffix;
};

export const formatFullName = (firstName, lastName) => {
  return [firstName, lastName].filter(Boolean).join(' ').trim();
};

export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

export const removeAccents = (text) => {
  if (!text) return '';
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export const getInitials = (name, maxInitials = 2) => {
  if (!name) return '';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, maxInitials)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
};

export default {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatNumber,
  formatPercentage,
  formatBytes,
  capitalize,
  toTitleCase,
  truncateText,
  formatFullName,
  formatPhone,
  removeAccents,
  getInitials,
};
