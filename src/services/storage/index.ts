import { User } from '@/models/User';
import { MMKV } from 'react-native-mmkv';

export const mmkv = new MMKV();

export default {
  setUser(user: User) {
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
  setToken(token: string) {
    return mmkv.set('token', token);
  },
};
