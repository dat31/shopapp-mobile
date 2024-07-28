import { FullScreenLoading, IconButton, SquareImg, View } from '@/components';
import { Product } from '@/models/Product';
import { StackParamList } from '@/navigator/product-stacks';
import {
  useCreateProdMutation,
  useUpdateProdMutation,
} from '@/query/mutations/products';
import { useProductDetailQuery } from '@/query/queries/products';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Input, makeStyles, useTheme } from '@rneui/themed';
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
import { Category } from '@/models/Category';
import { useCategoriesQuery } from '@/query/queries/category';
import { Picker } from '@/components';

type Props = {} & NativeStackScreenProps<StackParamList, 'ProductEdit'>;

export default function ProductEdit({ route, navigation }: Props) {
  const { productId } = route.params || {};
  const { t } = useTranslation();
  const { mutate: updateProdMutate, isLoading: isLoadingUpdateProd } =
    useUpdateProdMutation();
  const { mutate: createProdMutate, isLoading: isLoadingCreateProd } =
    useCreateProdMutation();
  const { data: categories = [] } = useCategoriesQuery();
  const {
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    values,
    errors,
    touched,
    submitCount,
    setFieldValue,
  } = useFormik<Product>({
    initialValues: {} as Product,
    validationSchema: yup.object().shape({
      name: yup.string().required(t('errors.required_error')),
      price: yup.string().required(t('errors.required_error')),
    }),
    onSubmit(values) {
      if (values.id) {
        updateProdMutate(values, {
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
      if (data.imageUrl) {
        console.log('data.image', data.imageUrl);
        setUri(data.imageUrl);
      }
    },
    enabled: Boolean(productId),
  });
  const [uri, setUri] = useState('');
  const styles = useStyles();
  const { theme } = useTheme();

  const editImage = (
    e: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>,
  ) => {
    const fn = e.nativeEvent.index === 0 ? launchCamera : launchImageLibrary;
    fn({ mediaType: 'photo' }, result => {
      const [img] = result?.assets || [];
      if (!img) {
        return;
      }
      const upload = {
        uri: img.uri,
        name: img.fileName,
        type: img.type,
      };
      setFieldValue('imageUrl', upload);
      setUri(img.uri as string);
    });
  };

  function getFieldError(field: keyof Product) {
    return submitCount > 0 || touched[field] ? errors[field] : '';
  }

  if (isLoading) {
    return <FullScreenLoading />;
  }

  const { name, description, price, category } = values;

  return (
    <ScrollView>
      <SquareImg
        containerStyle={styles.imgContainer}
        style={styles.img}
        {...((uri ? { source: { uri } } : {}) as any)}>
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
      </SquareImg>
      <View bg-white ph-lg pv-xl style={styles.form}>
        <Input
          onBlur={handleBlur('name')}
          onChangeText={handleChange('name')}
          label="Name"
          value={name}
          errorMessage={getFieldError('name') as string}
        />
        <Input
          onBlur={handleBlur('description')}
          onChangeText={handleChange('description')}
          label="Description"
          value={description}
          errorMessage={getFieldError('description') as string}
        />
        <Input
          onBlur={handleBlur('price')}
          onChangeText={handleChange('price')}
          label="Price"
          keyboardType="decimal-pad"
          value={price?.toString()}
          errorMessage={getFieldError('price') as string}
        />
        <Picker<Category>
          value={category}
          label={t('category.label')}
          data={categories}
          getValue={item => item}
          getLabel={item => item.name}
          onChange={value => setFieldValue('category', value)}
        />
        <View ph-md pv-md pb-sm>
          <Button
            containerStyle={styles.submitBtn}
            loading={isLoadingUpdateProd || isLoadingCreateProd}
            disabled={isLoadingUpdateProd}
            onPress={handleSubmit as any}>
            Submit
          </Button>
          <Button
            disabled={isLoadingUpdateProd || isLoadingCreateProd}
            titleStyle={{ color: styles.discardBtn.color }}
            type="clear">
            Cancel
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
    },
    imgContainer: {
      backgroundColor: theme.colors.grey2,
    },
    submitBtn: {
      marginBottom: theme.spacing.lg,
    },
    discardBtn: {
      color: theme.colors.error,
    },
    form: {
      gap: theme.spacing.lg,
    },
  };
});
