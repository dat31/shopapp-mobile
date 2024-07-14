import { Order } from '@/models/Order';
import { service } from '@/services/axios';
import { useQuery, UseQueryOptions } from 'react-query';

export const QUERY_KEY = 'orders';

export function useOrdersQuery() {
  return useQuery(QUERY_KEY, () =>
    service.get('/orders').then(({ data }) => data),
  );
}

export function useOrderDetailQuery(
  id: Order['id'],
  options?: Omit<UseQueryOptions<Order>, 'queryKey' | 'queryFn'>,
) {
  console.log('id', id);

  return useQuery(
    [QUERY_KEY, id],
    () => service.get<Order>(`/orders/${id}`).then(({ data }) => data),
    { enabled: Boolean(id), ...options } as Omit<
      UseQueryOptions<Order>,
      'queryKey' | 'queryFn'
    >,
  );
}
