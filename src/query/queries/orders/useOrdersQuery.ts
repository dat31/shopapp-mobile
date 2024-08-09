import { PaginatedResponse } from '@/models/common';
import { Order, OrderFilter } from '@/models/Order';
import { ORDER_QUERY_KEY } from '@/query';
import orderService from '@/services/order-service';
import { useInfiniteQuery, UseQueryOptions } from 'react-query';

export default function useOrdersQuery(
  filter: OrderFilter,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Order>>,
    'queryKey' | 'queryFn'
  >,
) {
  return useInfiniteQuery<PaginatedResponse<Order>>(
    [ORDER_QUERY_KEY, filter],
    async ({ pageParam = 0 }) => {
      const { data } = await orderService.paginate({
        ...filter,
        page: pageParam,
      });
      return data;
    },
    {
      getNextPageParam(last) {
        return last.next;
      },
      getPreviousPageParam(first) {
        return first.previous;
      },
    },
  );
}
