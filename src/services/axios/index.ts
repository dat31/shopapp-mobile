import axios from 'axios';
import storage from '../storage';
import auth from '@react-native-firebase/auth';

export const service = axios.create({
  baseURL: 'http://10.0.2.2:3000',
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

  if (req.url?.includes('/products/upload/image') && req.method === 'post') {
    req.headers['Content-Type'] = 'multipart/form-data';
  }
  return req;
});
