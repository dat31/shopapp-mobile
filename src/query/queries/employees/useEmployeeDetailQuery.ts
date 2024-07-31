import { User } from '@/models/User';
import { UseQueryOptions, useQuery } from 'react-query';
import { QUERY_KEY } from './useEmployeesQuery';
import { service } from '@/services/axios';

export default function useEmployeeDetailQuery(
  uid: User['uid'],
  options?: Omit<UseQueryOptions<User>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<User>(
    [QUERY_KEY, uid],
    () => service.get(`/users/employees/${uid}`).then(({ data }) => data),
    options,
  );
}
