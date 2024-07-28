import { PaginatedResponse } from '@/models/common';
import { Order, OrderFilter } from '@/models/Order';
import { useOrderStore } from '@/screens/orders/store';
import { service } from '@/services/axios';
import { assign, isEqual, merge } from 'lodash';
import { useCallback } from 'react';
import {
  InfiniteData,
  QueryOptions,
  SetDataOptions,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from 'react-query';
import { Updater } from 'react-query/types/core/utils';

export const QUERY_KEY = 'orders';

export function useOrdersQuery(
  filter: OrderFilter,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Order>>,
    'queryKey' | 'queryFn'
  >,
) {
  return useInfiniteQuery<PaginatedResponse<Order>>(
    [QUERY_KEY, filter],
    async ({ pageParam = 0 }) => {
      const { data } = await service.post<PaginatedResponse<Order>>(
        '/orders/filter',
        { ...filter, page: pageParam },
      );
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

export function useOrderDetailQuery(
  id: Order['id'],
  options?: Omit<UseQueryOptions<Order>, 'queryKey' | 'queryFn'>,
) {
  return useQuery(
    [QUERY_KEY, id],
    () => service.get<Order>(`/orders/${id}`).then(({ data }) => data),
    {
      enabled: Boolean(id),
      ...options,
      isDataEqual(oldData, newData) {
        return isEqual(oldData, newData);
      },
    } as Omit<UseQueryOptions<Order>, 'queryKey' | 'queryFn'>,
  );
}

export function useSetOrdersQueryData() {
  const { filter } = useOrderStore();
  const client = useQueryClient();
  return (
    updater: Updater<Order[] | undefined, Order[]>,
    options?: SetDataOptions,
  ) => {
    return client.setQueryData<Order[]>([QUERY_KEY, filter], updater, options);
  };
}
