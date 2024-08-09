import { Order } from '@/models/Order';
import { ORDER_QUERY_KEY } from '@/query';
import orderService from '@/services/order-service';
import { isEqual } from 'lodash';
import { useQuery, UseQueryOptions } from 'react-query';

export default function useOrderDetailQuery(
  id: Order['id'],
  options?: Omit<UseQueryOptions<Order>, 'queryKey' | 'queryFn'>,
) {
  return useQuery(
    [ORDER_QUERY_KEY, id],
    () => orderService.getById(id).then(({ data }) => data),
    {
      enabled: Boolean(id),
      ...options,
      isDataEqual(oldData, newData) {
        return isEqual(oldData, newData);
      },
    } as Omit<UseQueryOptions<Order>, 'queryKey' | 'queryFn'>,
  );
}
