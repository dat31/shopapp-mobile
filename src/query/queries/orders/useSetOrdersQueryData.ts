import { Order } from '@/models/Order';
import { ORDER_QUERY_KEY } from '@/query';
import { useOrderStore } from '@/screens/orders/store';
import { SetDataOptions, useQueryClient } from 'react-query';
import { Updater } from 'react-query/types/core/utils';

export default function useSetOrdersQueryData() {
  const { filter } = useOrderStore();
  const client = useQueryClient();
  return (
    updater: Updater<Order[] | undefined, Order[]>,
    options?: SetDataOptions,
  ) => {
    return client.setQueryData<Order[]>(
      [ORDER_QUERY_KEY, filter],
      updater,
      options,
    );
  };
}
