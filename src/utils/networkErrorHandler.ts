/**
 * Network Error Handler Utilities
 * Provides consistent error detection and messaging across the application
 */

/**
 * Checks if an error is a network-related error (Failed to fetch)
 */
export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof TypeError) {
    return error.message === 'Failed to fetch' || error.message.includes('fetch');
  }
  return false;
};

/**
 * Gets a user-friendly error message from any error type
 */
export const getErrorMessage = (error: unknown): string => {
  if (isNetworkError(error)) {
    return 'Unable to connect. Please check your internet connection and try again.';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Logs error with context for debugging
 */
export const logError = (context: string, error: unknown): void => {
  console.error(`[${context}]`, error);
  if (isNetworkError(error)) {
    console.warn('Network error detected - user may be offline or server is unreachable');
  }
};
