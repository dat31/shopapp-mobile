import { Product } from '@/models/Product';
import { useCallback, useEffect, useMemo } from 'react';
import { Button, makeStyles } from '@rneui/themed';
import { StackParamList } from '@/navigator/product-stacks';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OrderItem } from '@/models/Order';
import { useProductsQuery } from '@/query/queries/products';
import { useOrderDetailQuery } from '@/query/queries/orders';
import {
  useDecreaseQtyMutation,
  useIncreaseQtyMutation,
} from '@/query/mutations/order-items';
import { FullScreenLoading, ProductList, View } from '@/components';
import { useProductStore } from './store';
import { debounce } from 'lodash';

type Props = {} & NativeStackScreenProps<StackParamList, 'Products'>;

function Products({ navigation, route }: Props) {
  const { setProducts, filteredProducts, onFilter } = useProductStore();
  const { isLoading } = useProductsQuery({
    onSuccess: setProducts,
  });
  const { orderId, orderItemId } = (route.params || {}) as any;
  const { navigate, setOptions, getParent, goBack, canGoBack } = navigation;
  const isOrder = useMemo(
    () => getParent()?.getState().routeNames.includes('Orders'),
    [getParent],
  );
  const { data: order } = useOrderDetailQuery(orderId as number) || {};
  const styles = useStyles();
  const { mutate: increaseQtyMutate } = useIncreaseQtyMutation();
  const { mutate: decreaseQtyMutate } = useDecreaseQtyMutation();

  const onItemPress = useCallback(
    ({ id, name }: Product) =>
      navigate('ProductDetail', {
        productId: id as number,
        productName: name,
      }),
    [navigate],
  );

  const increaseQty = useCallback(
    (product: Product) => {
      increaseQtyMutate({
        odId: orderId as number,
        odItem: { product, id: orderItemId } as OrderItem,
      });
    },
    [increaseQtyMutate, orderId, orderItemId],
  );

  const decreaseQty = useCallback(
    (product: Product) => {
      decreaseQtyMutate({
        odId: orderId as number,
        odItem: { product, id: orderItemId } as OrderItem,
      });
    },
    [orderId, orderItemId, decreaseQtyMutate],
  );

  useEffect(() => {
    setOptions({
      headerSearchBarOptions: {
        headerIconColor: 'white',
        textColor: 'white',
        shouldShowHintSearchIcon: false,
        onChangeText(e) {
          debounce(() => onFilter(e.nativeEvent.text), 200);
        },
      },
    });
  }, [setOptions]);

  if (isOrder && !order) {
    return null;
  }

  if (isLoading) {
    return <FullScreenLoading />;
  }

  return (
    <View flex-1>
      <ProductList
        getQty={item =>
          order?.items.find(od => od.product.id === item.id)?.quantity || 0
        }
        data={filteredProducts}
        onItemPress={onItemPress}
        decreaseQty={decreaseQty}
        increaseQty={increaseQty}
      />
      {isOrder ? (
        <Button
          containerStyle={styles.okButton}
          onPress={() => {
            canGoBack() && goBack();
          }}>
          OK
        </Button>
      ) : null}
    </View>
  );
}

const useStyles = makeStyles(theme => ({
  sectionTitle: {
    marginLeft: theme.spacing.lg,
    marginTop: theme.spacing.lg * 2,
    marginBottom: theme.spacing.lg,
  },
  okButton: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.white,
  },
}));

export default Products;
