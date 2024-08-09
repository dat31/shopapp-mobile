import axios from 'axios';
import storage from '../storage';
import auth from '@react-native-firebase/auth';
import {
  BaseModel,
  PaginatedRequest,
  PaginatedResponse,
} from '@/models/common';
import Config from 'react-native-config';

export const service = axios.create({
  baseURL: Config.API_URL,
});

service.interceptors.request.use(async req => {
  const token = storage.getToken();
  if (!token) {
    return req;
  }

  if (Date.now() >= token.claims.exp * 1000) {
    console.log('refresh token');
    const idToken = await auth().currentUser?.getIdTokenResult(true);
    if (!idToken) {
      return req;
    }
    storage.setToken(idToken);
    req.headers.Authorization = `Bearer ${idToken.token}`;
    return req;
  }

  if (token) {
    req.headers.Authorization = `Bearer ${token.token}`;
  }

  if (req.url?.includes('/upload/image') && req.method === 'post') {
    req.headers['Content-Type'] = 'multipart/form-data';
  }
  return req;
});

export function createCRUDService<T extends BaseModel>(url: string) {
  return {
    getAll() {
      return service.get<T[]>(url);
    },
    getById(id: T['id']) {
      return service.get<T>(`${url}/${id}`);
    },
    paginate<TFilter>(body: PaginatedRequest<T> & TFilter) {
      return service.post<PaginatedResponse<T>>(`${url}/filter`, body);
    },
    create(body: Partial<T>) {
      return service.post<T>(`${url}`, body);
    },
    delete(id: T['id']) {
      return service.delete<void>(`${url}/${id}`);
    },
    update(id: T['id'], body: Partial<T>) {
      return service.patch<Partial<T>>(`${url}/${id}`, body);
    },
  };
}
