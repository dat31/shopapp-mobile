import { User } from '@/models/User';
import { QUERY_KEY } from '@/query/queries/employees/useEmployeesQuery';
import { service } from '@/services';
import { AxiosError } from 'axios';
import { produce } from 'immer';
import { useMutation, useQueryClient } from 'react-query';

export default function useUpdateEmployeeMutation() {
  const client = useQueryClient();
  return useMutation<User, AxiosError, User>({
    mutationFn(employee) {
      return service
        .patch(`users/employees/${employee.id}`, employee)
        .then(({ data }) => data);
    },
    onSuccess(data, variables) {
      client.setQueryData(
        QUERY_KEY,
        produce<User[]>(employees => {
          if (!employees) {
            return;
          }
          const index = employees.findIndex(e => e.id === variables.id);
          if (index === -1) {
            return;
          }
          employees[index as number] = data;
        }),
      );
      client.setQueryData([QUERY_KEY, variables.id], () => data);
    },
  });
}
