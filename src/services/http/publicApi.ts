import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';

/** Cliente sem credenciais: só para o conteúdo público. */
export const publicApi = axios.create({ baseURL: API_BASE_URL, timeout: 15_000 });
