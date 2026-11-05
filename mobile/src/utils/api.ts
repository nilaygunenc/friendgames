import axios from 'axios';

// No server is required for the single-phone MVP.
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
export const apiEnabled = Boolean(BASE_URL);

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

// Inject auth token automatically
let _token: string | null = null;
export function setAuthToken(token: string | null) {
  _token = token;
}

apiClient.interceptors.request.use(config => {
  if (!apiEnabled) return Promise.reject(new Error('Çevrimdışı mod'));
  if (_token) {
    config.headers.Authorization = `Bearer ${_token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      setAuthToken(null);
    }
    return Promise.reject(err);
  }
);

// ─── API calls ────────────────────────────────────────────────────────────

export const AuthAPI = {
  register: (email: string, password: string, displayName: string) =>
    apiClient.post('/auth/register', { email, password, displayName }),
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
};

export const GamesAPI = {
  list: (params?: { category?: string; group_size?: number }) =>
    apiClient.get('/games', { params }),
  get: (id: string) =>
    apiClient.get(`/games/${id}`),
  randomQuestion: (pool: string) =>
    apiClient.get(`/games/questions/${pool}`),
  randomTabuCard: () =>
    apiClient.get('/games/tabu/card'),
};

export const UserAPI = {
  me: () => apiClient.get('/users/me'),
  favorites: () => apiClient.get('/users/me/favorites'),
  toggleFavorite: (gameId: string) =>
    apiClient.post(`/users/me/favorites/${gameId}`),
};
