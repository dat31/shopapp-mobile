import { Order } from '@/models/Order';
import { service } from '@/services';
import { useQuery } from 'react-query';

export const QUERY_KEY = 'orders';

export function useOrdersQuery() {
  return useQuery(QUERY_KEY, () =>
    service.get('/orders').then(({ data }) => data),
  );
}

export function useOrderDetailQuery(id: Order['id']) {
  return useQuery(
    [QUERY_KEY, id],
    () => service.get<Order>(`/orders/${id}`).then(({ data }) => data),
    { enabled: Boolean(id) },
  );
}
