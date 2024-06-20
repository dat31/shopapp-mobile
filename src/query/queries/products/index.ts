import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { service } from '@/services';
import { UseQueryOptions, useQuery } from 'react-query';

export const QUERY_KEY = 'products';

export function useProductsQuery(options: UseQueryOptions<Category[]>) {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () =>
      service.get<Category[]>('/categories').then(({ data }) => data),
    ...options,
  });
}

export function useProductDetailQuery(id: Product['id']) {
  return useQuery(['products', id], () =>
    service.get<Product>(`/products/${id}`).then(resp => resp.data),
  );
}
