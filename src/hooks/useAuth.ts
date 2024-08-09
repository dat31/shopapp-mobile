import { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import storage from '@/services/storage';
import { User } from '@/models/User';

export default function useAuth() {
  const [user, setUser] = useState<User | null>();
  useEffect(() => {
    return auth().onAuthStateChanged(auth => {
      setUser(auth);
      console.log('auth', auth);
      storage.setUser(auth);

      if (!auth) {
        storage.removeToken();
      }

      auth?.getIdTokenResult().then(idtoken => {
        console.log('auth idtoken', idtoken);
        storage.setToken(idtoken);
      });
    });
  }, []);

  return { user };
}
