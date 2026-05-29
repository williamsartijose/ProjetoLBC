import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

/**
 * Cliente HTTP base da aplicação.
 *
 * A autenticação é simulada através do header `X-User-Id`. O utilizador ativo
 * será definido futuramente por um seletor na interface; por agora o
 * interceptor apenas adiciona o header quando existir um valor guardado.
 */
export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const currentUserId = localStorage.getItem('currentUserId');
  if (currentUserId) {
    config.headers['X-User-Id'] = currentUserId;
  }
  return config;
});
