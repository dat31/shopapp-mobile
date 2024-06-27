import { Product } from '@/models/Product';
import { QUERY_KEY } from '@/query/queries/products';
import { service } from '@/services';
import { AxiosError, AxiosResponse } from 'axios';
import { UseMutationOptions, useMutation, useQueryClient } from 'react-query';

export default function useUpdateProdMutation(
  options?: UseMutationOptions<
    AxiosResponse<Product>,
    AxiosError,
    Partial<Product>
  >,
) {
  const client = useQueryClient();
  return useMutation<AxiosResponse<Product>, AxiosError, Partial<Product>>({
    mutationFn({ id, ...prod }) {
      return service.patch(`/products/${id}`, prod);
    },
    onSuccess() {
      client.invalidateQueries(QUERY_KEY);
    },
  });
}
