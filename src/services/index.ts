import axios, { HttpStatusCode } from 'axios';
import storage from './storage';

export const service = axios.create({
  baseURL: 'http://10.0.2.2:3000',
});

service.interceptors.request.use(req => {
  const token = storage.getToken();

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

service.interceptors.response.use(
  reps => reps,
  error => {
    if (error.response?.status === HttpStatusCode.Unauthorized) {
      storage.removeUser();
      storage.removeToken();
    }

    return Promise.reject(error);
  },
);
