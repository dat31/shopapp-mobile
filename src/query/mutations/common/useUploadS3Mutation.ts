import { ErrorResponse } from '@/models/common';
import { service } from '@/services/axios';
import { isObject, isString } from 'lodash';
import { Asset } from 'react-native-image-picker';
import { useMutation } from 'react-query';

export default function useUploadS3Mutation() {
  return useMutation<
    string | undefined,
    ErrorResponse,
    Asset | string | undefined
  >({
    async mutationFn(asset) {
      if (isObject(asset)) {
        const { uri, fileName: name, type } = asset;
        const formData = new FormData();
        formData.append('image', { uri, name, type });
        const { data } = await service.post('/s3/upload/image', formData);
        return data;
      }
      if (isString(asset) && asset.includes('s3.us-east-1')) {
        return asset;
      }
      return;
    },
  });
}
