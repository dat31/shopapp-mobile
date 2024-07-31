import { User } from '@/models/User';
import { QUERY_KEY } from '@/query/queries/employees/useEmployeesQuery';
import { service } from '@/services/axios';
import { AxiosError } from 'axios';
import { produce } from 'immer';
import { useMutation, useQueryClient } from 'react-query';
import { useUploadS3Mutation, useUploadStorageMutation } from '../common';
import { Asset } from 'react-native-image-picker';

export default function useUpdateEmployeeMutation() {
  const client = useQueryClient();
  const { mutateAsync } = useUploadStorageMutation();
  return useMutation<User, AxiosError, User>({
    async mutationFn(employee) {
      const { phoneNumber, photoURL: img, displayName } = employee;
      const photoURL = await mutateAsync(img as Asset);
      const { data } = await service.patch(`users/${employee.uid}`, {
        photoURL,
        phoneNumber,
        displayName,
      });
      return data;
    },
    onSuccess(data, variables) {
      client.setQueryData(
        QUERY_KEY,
        produce<User[]>(employees => {
          if (!employees) {
            return;
          }
          const index = employees.findIndex(e => e.uid === variables.uid);
          if (index === -1) {
            return;
          }
          employees[index as number] = data;
        }),
      );
      client.setQueryData([QUERY_KEY, variables.uid], () => data);
    },
  });
}
