import { SignInRequest, User } from '@/models/User';
import { QUERY_KEY } from '@/query/queries/auth/useUser';
import { service } from '@/services';
import storage from '@/services/storage';
import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';

export default function useSignInMutation() {
  const client = useQueryClient();
  return useMutation<User, AxiosError, SignInRequest>({
    async mutationFn(request) {
      const data = await service.post<{ token: string }>(
        '/auth/login',
        request,
      );
      const { token } = data.data;
      storage.setToken(token);
      const profileResp = await service.get('/auth/profile');
      console.log('login response', profileResp.data);
      return profileResp.data;
    },
    onSuccess(data) {
      client.setQueryData(QUERY_KEY, data);
    },
  });
}
