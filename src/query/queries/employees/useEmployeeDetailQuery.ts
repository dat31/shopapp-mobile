import { User } from '@/models/User';
import { UseQueryOptions, useQuery } from 'react-query';
import { QUERY_KEY } from './useEmployeesQuery';
import { service } from '@/services';

export default function useEmployeeDetailQuery(
  id: User['id'],
  options?: Omit<UseQueryOptions<User>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<User>(
    [QUERY_KEY, id],
    () => service.get(`/users/employees/${id}`).then(({ data }) => data),
    options,
  );
}
