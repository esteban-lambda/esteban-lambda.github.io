/**
 * Logger utility for development and production environments
 * Provides consistent logging with timestamps and environment-aware behavior
 */

const isDevelopment = import.meta.env.MODE === 'development';
const isProduction = import.meta.env.MODE === 'production';

// Log levels
const LogLevel = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
};

// Colors for console output (development only)
// Colores para navegador (usando %c)
const colors = {
  DEBUG: 'color:#0ea5e9;font-weight:bold', // azul claro
  INFO: 'color:#22c55e;font-weight:bold',  // verde
  WARN: 'color:#f59e42;font-weight:bold',  // naranja
  ERROR: 'color:#dc2626;font-weight:bold', // rojo
  RESET: '',
};

/**
 * Format timestamp for log entries
 */
const getTimestamp = () => {
  const now = new Date();
  return now.toISOString();
};

/**
 * Format log message with timestamp and level
 */
const formatMessage = (level, message, data) => {
  const timestamp = getTimestamp();
  // En desarrollo, usamos %c para colorear el prefijo
  const prefix = isDevelopment
    ? [`%c[${level}] ${timestamp}`, colors[level]]
    : [`[${level}] ${timestamp}`];
  return { prefix, timestamp, level, message, data };
};

/**
 * Core logging function
 */
const log = (level, message, data = null) => {
  const formatted = formatMessage(level, message, data);

  // En producción, solo WARN y ERROR
  if (isProduction && (level === LogLevel.DEBUG || level === LogLevel.INFO)) {
    return;
  }

  // Salida en consola con color
  if (isDevelopment) {
    if (data) {
      console.log(...formatted.prefix, message, data);
    } else {
      console.log(...formatted.prefix, message);
    }
  } else {
    // Producción: sin color
    if (data) {
      console.log(...formatted.prefix, message, data);
    } else {
      console.log(...formatted.prefix, message);
    }
  }

  // En producción, podrías enviar logs a un servicio externo aquí
  if (isProduction && level === LogLevel.ERROR) {
    // Example: sendToLogService(formatted);
  }
};

/**
 * Logger object with convenience methods
 */
export const logger = {
  /**
   * Debug logs - only in development
   * @param {string} message - Log message
   * @param {any} data - Optional data to log
   */
  debug: (message, data) => {
    log(LogLevel.DEBUG, message, data);
  },

  /**
   * Info logs - general information
   * @param {string} message - Log message
   * @param {any} data - Optional data to log
   */
  info: (message, data) => {
    log(LogLevel.INFO, message, data);
  },

  /**
   * Warning logs - potential issues
   * @param {string} message - Log message
   * @param {any} data - Optional data to log
   */
  warn: (message, data) => {
    log(LogLevel.WARN, message, data);
  },

  /**
   * Error logs - critical issues
   * @param {string} message - Log message
   * @param {any} data - Optional error data or Error object
   */
  error: (message, data) => {
    // If data is an Error object, extract useful information
    if (data instanceof Error) {
      log(LogLevel.ERROR, message, {
        name: data.name,
        message: data.message,
        stack: data.stack,
      });
    } else {
      log(LogLevel.ERROR, message, data);
    }
  },

  /**
   * Log API requests (development only)
   * @param {string} method - HTTP method
   * @param {string} url - Request URL
   * @param {any} data - Request data
   */
  api: (method, url, data) => {
    if (isDevelopment) {
      log(LogLevel.DEBUG, `API ${method.toUpperCase()} ${url}`, data);
    }
  },

  /**
   * Log API responses (development only)
   * @param {number} status - HTTP status code
   * @param {string} url - Request URL
   * @param {any} data - Response data
   */
  apiResponse: (status, url, data) => {
    if (isDevelopment) {
      const level = status >= 400 ? LogLevel.ERROR : LogLevel.DEBUG;
      log(level, `API Response ${status} ${url}`, data);
    }
  },

  /**
   * Log component lifecycle events (development only)
   * @param {string} component - Component name
   * @param {string} event - Lifecycle event
   * @param {any} data - Optional data
   */
  component: (component, event, data) => {
    if (isDevelopment) {
      log(LogLevel.DEBUG, `[${component}] ${event}`, data);
    }
  },

  /**
   * Group related logs together
   * @param {string} label - Group label
   * @param {Function} fn - Function containing logs to group
   */
  group: (label, fn) => {
    if (isDevelopment) {
      console.group(label);
      fn();
      console.groupEnd();
    } else {
      fn();
    }
  },
};

// Export log levels for external use
export { LogLevel };

export default logger;
