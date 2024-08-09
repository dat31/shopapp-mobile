import { Product } from '@/models/Product';
import { PRODUCT_QUERY_KEY } from '@/query';
import { service } from '@/services/axios';
import { AxiosError, AxiosResponse } from 'axios';
import { isObject, isString } from 'lodash';
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
    async mutationFn({ id, imageUrl, ...prod }) {
      if (isString(imageUrl) && imageUrl?.includes('s3.us-east-1')) {
        //case1: image already upload on s3
        return service.patch(`/products/${id}`, prod);
      }

      if (isObject(imageUrl)) {
        //case2: upload image
        const formData = new FormData();
        formData.append('image', imageUrl);
        const { data: url } = await service.post('/upload/image', formData);
        return service.patch(`/products/${id}`, { ...prod, imageUrl: url });
      }

      //case3: imageUrl is null or undefined
      return service.patch(`/products/${id}`, prod);
    },
    onSuccess({ data }) {
      client.invalidateQueries([PRODUCT_QUERY_KEY]);
      // client.setQueryData<Product[]>(
      //   QUERY_KEY,
      //   produce<Product[]>(products => {
      //     if (!products) {
      //       return;
      //     }
      //     const index = products?.findIndex(prod => prod.id === data.id);
      //     if (index === -1) {
      //       return;
      //     }
      //     products[index] = data;
      //   }),
      // );
    },
  });
}
