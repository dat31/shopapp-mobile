import { ErrorResponse } from '@/models/common';
import { isString } from 'lodash';
import { Asset } from 'react-native-image-picker';
import { useMutation } from 'react-query';
import storage from '@react-native-firebase/storage';
import { service } from '@/services/axios';

export default function useUploadStorageMutation() {
  return useMutation<
    string | undefined,
    ErrorResponse,
    Asset | string | undefined
  >({
    async mutationFn(image) {
      if (!image) {
        return;
      }
      if (isString(image)) {
        return image;
      }
      const { uri } = image;
      if (!uri) {
        return;
      }
      const payload = {
        uri: image.uri,
        name: image.fileName,
        type: image.type,
      };
      const formData = new FormData();
      formData.append('image', payload);
      const { data } = await service.post('/storage/upload/image', formData);
      return data;
    },
  });
}
