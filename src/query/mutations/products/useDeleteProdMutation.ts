import { Product } from '@/models/Product';
import { PRODUCT_QUERY_KEY } from '@/query';
import productService from '@/services/product-service';
import { AxiosError, AxiosResponse } from 'axios';
import { useMutation, useQueryClient } from 'react-query';

export default function useDeleteProdMutation() {
  const client = useQueryClient();
  return useMutation<AxiosResponse<Product>, AxiosError, Product['id']>({
    mutationFn(id) {
      return productService.delete(id) as any;
    },
    onSuccess(_, prodId) {
      client.setQueryData<Product[]>(PRODUCT_QUERY_KEY, (products = []) =>
        products?.filter(product => product.id !== prodId),
      );
    },
  });
}
