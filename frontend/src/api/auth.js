import api from './axios'

export const authAPI = {
  login: (data) => api.post('auth/login/', data),
  refresh: (refresh) => api.post('auth/refresh/', { refresh }),
}