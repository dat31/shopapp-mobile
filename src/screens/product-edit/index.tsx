import { FullScreenLoading, IconButton, Img, View } from '@/components';
import { Product } from '@/models/Product';
import { StackParamList } from '@/navigator/product-stacks';
import {
  useCreateProdMutation,
  useUpdateProdMutation,
} from '@/query/mutations/products';
import { useProductDetailQuery } from '@/query/queries/products';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Input, makeStyles } from '@rneui/themed';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { NativeSyntheticEvent, ScrollView } from 'react-native';
import Toast from 'react-native-root-toast';
import * as yup from 'yup';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useState } from 'react';
import ContextMenu, {
  ContextMenuOnPressNativeEvent,
} from 'react-native-context-menu-view';

type Props = {} & NativeStackScreenProps<StackParamList, 'ProductEdit'>;

export default function ProductEdit({ route, navigation }: Props) {
  const { productId } = route.params || {};
  const { t } = useTranslation();
  const { mutate, isLoading: isLoadingUpdateProd } = useUpdateProdMutation();
  const { mutate: createProdMutate, isLoading: isLoadingCreateProd } =
    useCreateProdMutation();
  const {
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    values,
    errors,
    touched,
  } = useFormik<Product>({
    initialValues: {} as Product,
    validationSchema: yup.object().shape({
      name: yup.string().required(t('errors.required_error')),
      description: yup.string().required(t('errors.required_error')),
      price: yup.string().required(t('errors.required_error')),
    }),
    onSubmit(values) {
      if (values.id) {
        mutate(values, {
          onSuccess() {
            navigation.popToTop();
            Toast.show('Update success');
          },
        });
        return;
      }
      createProdMutate(values, {
        onSuccess() {
          navigation.popToTop();
          Toast.show('Create success');
        },
      });
    },
  });

  const { isLoading } = useProductDetailQuery(productId as number, {
    onSuccess(data) {
      setValues(data);
    },
    enabled: Boolean(productId),
  });
  const [uri, setUri] = useState(
    'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg',
  );

  const styles = useStyles();

  const editImage = (
    e: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>,
  ) => {
    const fn = e.nativeEvent.index === 0 ? launchCamera : launchImageLibrary;
    fn({ mediaType: 'photo' }, result => {
      const [img] = result?.assets || [];
      if (!img) {
        return;
      }
      setUri(img.uri as string);
    });
  };

  if (isLoading) {
    return <FullScreenLoading />;
  }

  const { name, description, price } = values;

  return (
    <ScrollView>
      <Img
        containerStyle={styles.imgContainer}
        style={styles.img}
        source={{ uri }}>
        <ContextMenu
          onPress={editImage}
          dropdownMenuMode
          actions={[{ title: 'hello' }, { title: 'hello2' }]}>
          <IconButton
            onLongPress={() => {}}
            color={styles.editImgBtn.color}
            name="pencil"
            containerStyle={styles.editImgBtn}
          />
        </ContextMenu>
      </Img>
      <View white ph-lg pv-xl style={{ gap: 16 }}>
        <Input
          onBlur={handleBlur('name')}
          onChangeText={handleChange('name')}
          label="Name"
          value={name}
          errorMessage={touched.name ? errors.name : ''}
        />
        <Input
          onBlur={handleBlur('description')}
          onChangeText={handleChange('description')}
          label="Description"
          value={description}
          errorMessage={touched.description ? errors.description : ''}
        />
        <Input
          onBlur={handleBlur('price')}
          onChangeText={handleChange('price')}
          label="Price"
          keyboardType="decimal-pad"
          value={price?.toString()}
          errorMessage={touched.price ? errors.price : ''}
        />
        <View ph-md>
          <Button
            disabled={isLoadingUpdateProd || isLoadingCreateProd}
            color={'error'}
            containerStyle={styles.discardBtn}>
            Discard
          </Button>
          <Button
            loading={isLoadingUpdateProd || isLoadingCreateProd}
            disabled={isLoadingUpdateProd}
            onPress={handleSubmit as any}>
            Submit
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
const useStyles = makeStyles(theme => {
  return {
    editImgBtn: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.white,
      margin: theme.spacing.lg,
    },
    img: {
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      objectFit: 'scale-down',
    },
    imgContainer: {
      backgroundColor: theme.colors.grey2,
    },
    discardBtn: {
      marginBottom: theme.spacing.xl,
    },
  };
});
