import { Product } from '@/models/Product';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, makeStyles, useTheme } from '@rneui/themed';
import { StackParamList } from '@/navigator/product-stacks';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OrderItem } from '@/models/Order';
import { useProductsQuery } from '@/query/queries/products';
import { useOrderDetailQuery } from '@/query/queries/orders';
import {
  useDecreaseQtyMutation,
  useIncreaseQtyMutation,
} from '@/query/mutations/order-items';
import { FullScreenLoading, IconButton, ProductList, View } from '@/components';
import { Header, getHeaderTitle } from '@react-navigation/elements';
import { SearchBar } from 'react-native-screens';
import { useProductStore } from './store';

type Props = {} & NativeStackScreenProps<StackParamList, 'OrderProducts'>;

function OrderProducts({ navigation, route }: Props) {
  const { setProducts, filteredProducts, onFilter } = useProductStore();
  const { isLoading } = useProductsQuery({
    onSuccess: setProducts,
  });
  const { orderId, orderItemId } = (route.params || {}) as any;
  const { navigate, setOptions, goBack, canGoBack } = navigation;
  const { data: order, isLoading: isLoadingOrder } =
    useOrderDetailQuery(orderId as number) || {};
  const styles = useStyles();
  const { theme } = useTheme();
  const { colors } = theme;
  const { mutate: increaseQtyMutate } = useIncreaseQtyMutation();
  const { mutate: decreaseQtyMutate } = useDecreaseQtyMutation();
  const { items } = order || {};

  const onItemPress = useCallback(
    (product: Product) =>
      navigate('ProductDetail', {
        productId: product.id as number,
        productName: product.name,
        orderItem: { id: orderItemId, product } as OrderItem,
        orderId,
      }),
    [navigate, orderId, orderItemId],
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

  const getQty = useCallback(
    (item: Product) =>
      order?.items.find(od => od.product.id === item.id)?.quantity || 0,
    [items],
  );

  useEffect(() => {
    setOptions({
      // header({ options, route }) {
      //   return (
      //     <Header
      //       {...(options as any)}
      //       title={getHeaderTitle(options, route.name)}
      //       headerRight={({ tintColor }) => (
      //         <View row pr-md>
      //           <IconButton
      //             name="search"
      //             color={tintColor}
      //             onPress={() => {}}
      //           />
      //         </View>
      //       )}
      //     />
      //   );
      // },

      headerSearchBarOptions: {
        hideNavigationBar: true,
        hideWhenScrolling: true,
        headerIconColor: colors.white,
        textColor: colors.white,
        shouldShowHintSearchIcon: false,
        onChangeText(e) {
          onFilter(e.nativeEvent.text);
        },
      },
    });
  }, [setOptions, colors]);

  if (!order) {
    return null;
  }

  if (isLoading || isLoadingOrder) {
    return <FullScreenLoading />;
  }

  return (
    <View flex-1>
      <ProductList
        isOrder={true}
        getQty={getQty}
        data={filteredProducts}
        onItemPress={onItemPress}
        decreaseQty={decreaseQty}
        increaseQty={increaseQty}
      />
      <Button
        containerStyle={styles.okButton}
        onPress={() => {
          canGoBack() && goBack();
        }}>
        OK
      </Button>
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

export default OrderProducts;
