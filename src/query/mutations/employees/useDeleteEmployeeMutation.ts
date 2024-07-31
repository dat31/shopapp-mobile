import { User } from '@/models/User';
import { QUERY_KEY } from '@/query/queries/employees/useEmployeesQuery';
import { service } from '@/services/axios';
import { useMutation, useQueryClient } from 'react-query';

export default function useDeleteEmployeeMutation() {
  const client = useQueryClient();
  return useMutation(
    QUERY_KEY,
    (id: User['uid']) => service.delete(`/users/employees/${id}`),
    {
      onSuccess(_, empId) {
        client.setQueryData<User[]>(QUERY_KEY, employees =>
          employees ? employees.filter(e => e.uid !== empId) : [],
        );
      },
    },
  );
}
