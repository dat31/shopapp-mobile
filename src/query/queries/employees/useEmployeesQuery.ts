import { User } from '@/models/User';
import { service } from '@/services';
import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';

export const QUERY_KEY = 'employees';

export default function useEmployeesQuery() {
  return useQuery<User[]>(QUERY_KEY, () =>
    service.get('/users/employees').then(({ data }) => data),
  );
}
