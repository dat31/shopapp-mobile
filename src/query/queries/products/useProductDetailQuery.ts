import { ErrorResponse } from '@/models/common';
import { Product } from '@/models/Product';
import productService from '@/services/product-service';
import { useQuery, UseQueryOptions } from 'react-query';
import { PRODUCT_QUERY_KEY } from '@/query';

export default function useProductDetailQuery(
  id: Product['id'],
  options?: Omit<
    UseQueryOptions<Product, ErrorResponse, Product>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery(
    [PRODUCT_QUERY_KEY, id],
    () => productService.getById(id).then(resp => resp.data),
    options,
  );
}
