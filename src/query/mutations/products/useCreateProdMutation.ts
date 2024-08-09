import { ErrorResponse } from '@/models/common';
import { Product } from '@/models/Product';
import { PRODUCT_QUERY_KEY } from '@/query';
import { service } from '@/services/axios';
import productService from '@/services/product-service';
import { cloneDeep } from 'lodash';
import { useMutation, useQueryClient } from 'react-query';

export default function useCreateProdMutation() {
  const client = useQueryClient();
  return useMutation<Product, ErrorResponse, Product>({
    async mutationFn(form) {
      const body = cloneDeep(form);
      if (form.imageUrl) {
        const formData = new FormData();
        formData.append('image', form.imageUrl);
        const { data: imageUrl } = await service.post(
          '/s3/upload/image',
          formData,
        );
        body.imageUrl = imageUrl;
      }
      const { data: product } = await productService.create(body);
      return product;
    },
    onSuccess() {
      console.log('success');
      client.invalidateQueries({
        queryKey: PRODUCT_QUERY_KEY,
      });
    },
  });
}
