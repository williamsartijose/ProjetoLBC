import axios from 'axios';

interface BackendErrorResponse {
  message?: string;
}

/**
 * Extrai uma mensagem legível a partir de um erro do Axios, dando prioridade
 * ao campo `message` devolvido pelo `GlobalExceptionHandler` do backend.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<BackendErrorResponse>(error)) {
    return error.response?.data?.message ?? error.message ?? fallback;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}
