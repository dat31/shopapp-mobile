import { service } from '@/services';
import storage from '@/services/storage';
import { useQuery } from 'react-query';

export const QUERY_KEY = 'auth';

export default function useUser() {
  return useQuery(
    QUERY_KEY,
    () => service.get('/auth/profile').then(({ data }) => data),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      initialData: storage.getUser,
      onError() {
        storage.removeUser();
      },
      onSuccess(data) {
        storage.setUser(data);
      },
    },
  );
}
