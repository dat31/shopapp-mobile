import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { QUERY_KEY } from '@/query/queries/products';
import { service } from '@/services';
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
      client.setQueryData<Category[]>(
        QUERY_KEY,
        produce(categories => {
          if (!categories) {
            return;
          }
          const idx = categories?.findIndex(cat =>
            cat.products.some(prod => prod.id === prodId),
          );
          if (idx === -1) {
            return;
          }
          categories[idx as number].products = categories[
            idx as number
          ].products.filter(p => p.id !== prodId);
        }),
      );
    },
  });
}
