import { StackParamList } from '@/navigator/product-stacks';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { useCallback, useEffect } from 'react';
import {
  Button,
  Icon,
  Image,
  Input,
  Overlay,
  Text,
  makeStyles,
  useTheme,
} from '@rneui/themed';
import formatCurrency from '@/utils/format-currency';
import { FullScreenLoading, QtyModifier, View } from '@/components';
import { useProductDetailQuery } from '@/query/queries/products';
import Menu from './Menu';
import {} from '@/query/mutations/products';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-root-toast';
import { useDeleteProdMutation } from '@/query/mutations/products';
import {
  useDecreaseQtyMutation,
  useIncreaseQtyMutation,
} from '@/query/mutations/order-items';
import { useOrderDetailQuery } from '@/query/queries/orders';
import { OrderItem } from '@/models/Order';

type Props = {} & NativeStackScreenProps<StackParamList, 'ProductDetail'>;

function ProductDetail(props: Props) {
  const {
    route,
    navigation: { setOptions, goBack, canGoBack, navigate, getParent },
  } = props;

  const { productId, orderItem, orderId } = route.params;
  const { data: product, isLoading: isLoadingProdDetail } =
    useProductDetailQuery(productId);
  const { mutate: delMutate, isLoading: isLoadingDelete } =
    useDeleteProdMutation();
  const { mutate: increaseQtyMutate } = useIncreaseQtyMutation();
  const { mutate: decreaseQtyMutate } = useDecreaseQtyMutation();
  const { data: order, isLoading } = useOrderDetailQuery(orderId as number);
  const styles = useStyles();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { name, price, description } = product || {};
  const qty =
    order?.items.find(item => item.product.id === orderItem?.product?.id)
      ?.quantity || 0;

  const deleteProd = useCallback(() => {
    Alert.alert(
      t('common.confirmation'),
      t('common.action_confirm', {
        action: t('common.delete').toLocaleLowerCase(),
        item: ` ${product?.name}`,
      }),
      [
        {
          text: t('common.yes'),
          onPress() {
            delMutate(productId, {
              onSuccess() {
                Toast.show('Delete success');
                canGoBack() && goBack();
              },
            });
          },
        },
        { text: t('common.no') },
      ],
    );
  }, [productId, delMutate, product?.name]);

  useEffect(() => {
    if (orderId) {
      return;
    }
    setOptions({
      headerRight: ({ tintColor }) => {
        return (
          <Menu
            tintColor={tintColor}
            onDelete={deleteProd}
            onEdit={() => {
              navigate('ProductEdit', { productId });
            }}
          />
        );
      },
    });
  }, [setOptions, deleteProd, navigate, orderId, getParent]);

  function onDecreaseQty() {
    const request = {
      odId: orderId as number,
      odItem: {
        product,
      } as OrderItem,
    };
    if (qty === 1) {
      Alert.alert('Confirmation', 'Are you sure', [
        {
          text: 'OK',
          onPress: () => decreaseQtyMutate(request),
        },
        { text: 'Cancel' },
      ]);
    } else {
      decreaseQtyMutate(request);
    }
  }

  if (isLoadingProdDetail || isLoading) {
    return <FullScreenLoading />;
  }

  if (!product) {
    return null;
  }

  return (
    <KeyboardAvoidingView>
      <ScrollView>
        <Overlay isVisible={isLoadingDelete}>
          <ActivityIndicator size={'large'} color={theme.colors.primary} />
        </Overlay>

        <Image
          style={styles.img}
          source={{
            uri: 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg',
          }}
        />
        <View p-xl white>
          <View space-between row mb-md>
            <Text h4 bold>
              {name}
            </Text>
            <Text h4 bold>
              {formatCurrency(price as number)}
            </Text>
          </View>
          <Text style={styles.desc}>{description}</Text>
        </View>

        {orderId ? (
          <>
            <View white mt-lg ph-lg pv-xl mb-lg>
              <Input label="Note" />
              <QtyModifier
                onIncrease={() =>
                  increaseQtyMutate({
                    odId: orderId,
                    odItem: {
                      product,
                    } as OrderItem,
                  })
                }
                onDecrease={onDecreaseQty}
                qty={qty}
                isLg
              />
            </View>
          </>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const useStyles = makeStyles(theme => {
  return {
    img: {
      width: '100%',
      height: 256,
      objectFit: 'cover',
    },
    desc: {
      color: theme.colors.grey2,
    },
  };
});

export default ProductDetail;
