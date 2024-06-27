import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { QUERY_KEY } from '@/query/queries/products';
import { service } from '@/services';
import { AxiosError } from 'axios';
import { produce } from 'immer';
import { useMutation, useQueryClient } from 'react-query';

export default function useCreateProdMutation() {
  const client = useQueryClient();
  return useMutation<Product, AxiosError, Product>({
    mutationFn(data) {
      return (
        service
          //TODO: FIX HARDCODE
          .post('/products', { ...data, category: { id: 1 } })
          .then(({ data }) => data)
      );
    },
    onSuccess(data) {
      client.setQueryData(
        QUERY_KEY,
        produce<Category[]>(categories => {
          const cat = categories.find(cat => cat.id === data.category.id);
          cat?.products.push(data);
        }),
      );
    },
  });
}
