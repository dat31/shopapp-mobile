import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { QUERY_KEY } from '@/query/queries/products';
import { service } from '@/services/axios';
import { AxiosError, AxiosResponse } from 'axios';
import { produce } from 'immer';
import { useMutation, useQueryClient } from 'react-query';

export default function useDeleteProdMutation() {
  const client = useQueryClient();
  return useMutation<AxiosResponse<Product>, AxiosError, Product['id']>({
    mutationFn(id) {
      return service.delete(`/products/${id}`);
    },
    onSuccess(_, prodId) {
      client.setQueryData<Product[]>(QUERY_KEY, (products = []) =>
        products?.filter(product => product.id !== prodId),
      );
    },
  });
}
