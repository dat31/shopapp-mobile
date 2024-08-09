import { Product } from '@/models/Product';
import { useCallback, useEffect } from 'react';
import { Button, makeStyles, useTheme } from '@rneui/themed';
import { StackParamList } from '@/navigator/product-stacks';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OrderItem } from '@/models/Order';
import { useProductsQuery } from '@/query/queries/products';
import { FullScreenLoading, ProductList, View } from '@/components';
import { useProductStore } from './store';
import { useTranslation } from 'react-i18next';

type Props = {} & NativeStackScreenProps<StackParamList, 'Products'>;

function Products({ navigation, route }: Props) {
  const { setProducts, filteredProducts, onFilter } = useProductStore();
  const { isLoading, data } = useProductsQuery({
    onSuccess: setProducts,
  });
  console.log('product data', data);
  const { orderId, orderItemId } = (route.params || {}) as any;
  const { navigate, setOptions } = navigation;
  const styles = useStyles();
  const { theme } = useTheme();
  const { colors } = theme;
  const { t } = useTranslation();

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

  if (isLoading) {
    return <FullScreenLoading />;
  }

  return (
    <View flex-1>
      <ProductList data={filteredProducts} onItemPress={onItemPress} />
      <Button
        onPress={() => {
          navigate('ProductEdit');
        }}
        containerStyle={styles.okButton}>
        {t('common.add')}
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

export default Products;
