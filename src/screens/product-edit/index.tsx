import { FullScreenLoading, View } from '@/components';
import { Product } from '@/models/Product';
import { StackParamList } from '@/navigator/product-stacks';
import {
  useCreateProdMutation,
  useUpdateProdMutation,
} from '@/query/mutations/products';
import { useProductDetailQuery } from '@/query/queries/products';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Image, Input, makeStyles } from '@rneui/themed';
import { useFormik } from 'formik';
import { ScrollView, TouchableHighlight } from 'react-native';
import Toast from 'react-native-root-toast';
import * as Yup from 'yup';

type Props = {} & NativeStackScreenProps<StackParamList, 'ProductEdit'>;

const validationSchema = Yup.object().shape({
  name: Yup.string().required(''),
  description: Yup.string().required(''),
  price: Yup.string().required(''),
});

export default function ProductEdit({ route, navigation }: Props) {
  const { productId } = route.params || {};
  const { mutate, isLoading: isLoadingUpdateProd } = useUpdateProdMutation();
  const { mutate: createProdMutate, isLoading: isLoadingCreateProd } =
    useCreateProdMutation();
  const { handleChange, handleBlur, handleSubmit, setValues, values } =
    useFormik<Product>({
      initialValues: {} as Product,
      validationSchema,
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

  const styles = useStyles();

  if (isLoading) {
    return <FullScreenLoading />;
  }

  const { name, description, price } = values;

  return (
    <ScrollView>
      <Image
        style={styles.img}
        source={{
          uri: 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg',
        }}
      />
      <View white ph-lg pv-xl>
        <Input
          onBlur={handleBlur('name')}
          onChangeText={handleChange('name')}
          label="Name"
          style={styles.input}
          value={name}
        />
        <Input
          onBlur={handleBlur('description')}
          onChangeText={handleChange('description')}
          label="Description"
          style={styles.input}
          value={description}
        />
        <Input
          onBlur={handleBlur('price')}
          onChangeText={handleChange('price')}
          label="Price"
          keyboardType="decimal-pad"
          value={price?.toString()}
        />

        <View ph-md>
          <Button
            disabled={isLoadingUpdateProd}
            color={'error'}
            containerStyle={styles.discardBtn}>
            Discard
          </Button>
          <Button
            loading={isLoadingUpdateProd}
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
    img: {
      width: '100%',
      height: 256,
      objectFit: 'cover',
    },
    input: {},
    discardBtn: {
      marginBottom: theme.spacing.xl,
    },
  };
});
