import { Order, Status } from '@/models/Order';
import { QUERY_KEY } from '@/query/queries/orders';
import { service } from '@/services';
import { AxiosError, AxiosResponse } from 'axios';
import { produce } from 'immer';
import { useMutation, useQueryClient } from 'react-query';

export default function useUpdateStatusMutation() {
  const client = useQueryClient();
  return useMutation<AxiosResponse<Order>, AxiosError, Partial<Order>>({
    mutationFn({ id, status }) {
      if (status === Status.CANCELED) {
        return service.patch(`/orders/cancel/${id}`);
      }
      return service.patch(`/orders/complete/${id}`);
    },
    onSuccess({ data }, { id }) {
      client.setQueryData<Order[]>(
        QUERY_KEY,
        produce(orders => {
          if (!orders) {
            return;
          }
          const idx = orders.findIndex(od => od.id === id);
          if (idx === -1) {
            return;
          }
          orders[idx].status = data.status;
        }),
      );
      client.setQueryData(
        [QUERY_KEY, id],
        produce(od => {
          od.status = data.status;
        }),
      );
    },
  });
}
