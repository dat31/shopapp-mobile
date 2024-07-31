import { ErrorResponse } from '@/models/common';
import { isString } from 'lodash';
import { Asset } from 'react-native-image-picker';
import { useMutation } from 'react-query';
import storage from '@react-native-firebase/storage';

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
      const { uri, originalPath } = image;
      if (!uri) {
        return;
      }
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const reference = storage().ref(`/user-images/${filename}`);
      await reference.putFile(originalPath as string);
      return reference.getDownloadURL();
    },
  });
}
