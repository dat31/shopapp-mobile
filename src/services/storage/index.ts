import { User } from '@/models/User';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { MMKV } from 'react-native-mmkv';

export const mmkv = new MMKV();

export default {
  setUser(user: User | null) {
    return mmkv.set('user', JSON.stringify(user));
  },
  removeUser() {
    return mmkv.delete('user');
  },
  getUser() {
    const user = mmkv.getString('user');
    if (!user) {
      return;
    }
    return JSON.parse(user);
  },
  getToken() {
    return mmkv.getString('token');
  },
  removeToken() {
    return mmkv.delete('token');
  },
  setToken(token: FirebaseAuthTypes.IdTokenResult['token']) {
    return mmkv.set('token', token);
  },
};
