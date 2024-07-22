import { Category } from '@/models/Category';
import { Product } from '@/models/Product';
import { QUERY_KEY } from '@/query/queries/products';
import { service } from '@/services/axios';
import { AxiosError } from 'axios';
import { produce } from 'immer';
import { cloneDeep } from 'lodash';
import { useMutation, useQueryClient } from 'react-query';

export default function useCreateProdMutation() {
  const client = useQueryClient();
  return useMutation<Product, AxiosError, Product>({
    async mutationFn(form) {
      const body = cloneDeep(form);
      if (form.imageUrl) {
        const formData = new FormData();
        formData.append('image', form.imageUrl);
        const { data: imageUrl } = await service.post(
          '/products/upload/image',
          formData,
        );
        body.imageUrl = imageUrl;
      }
      const { data: product } = await service.post('/products', body);
      return product;
    },
    onSuccess(data) {
      client.setQueryData(
        QUERY_KEY,
        produce<Category[]>(categories => {
          if (!data.category) {
            categories.find(cat => !cat.id)?.products.push(data);
            return;
          }
          const category = categories.find(cat => cat.id === data.category.id);
          if (!category) {
            return;
          }
          category.products.push(data);
        }),
      );
    },
  });
}
