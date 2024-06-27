import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { service } from '@/services';
import { AxiosError } from 'axios';
import { UseQueryOptions, useQuery } from 'react-query';

export const QUERY_KEY = 'products';

export function useProductsQuery(options: UseQueryOptions<Category[]>) {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () =>
      service.get<Category[]>('/categories/products').then(({ data }) => data),
    ...options,
  });
}

export function useProductDetailQuery(
  id: Product['id'],
  options?: Omit<
    UseQueryOptions<Product, AxiosError, Product>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery(
    ['products', id],
    () => service.get<Product>(`/products/${id}`).then(resp => resp.data),
    options,
  );
}
