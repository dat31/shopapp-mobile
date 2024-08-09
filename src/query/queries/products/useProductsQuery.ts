import { Product } from '@/models/Product';
import { useQuery, UseQueryOptions } from 'react-query';
import productService from '@/services/product-service';
import { PRODUCT_QUERY_KEY } from '@/query';

export default function useProductsQuery(options: UseQueryOptions<Product[]>) {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEY,
    queryFn: () => productService.getAll().then(({ data }) => data),
    ...options,
  });
}
