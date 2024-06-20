import { StackParamList } from '@/navigator/order-stacks';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  TouchableHighlight,
} from 'react-native';
import OrderDetailItem from './OrderDetailItem';
import { Button, Icon, Text, makeStyles } from '@rneui/themed';
import formatCurrency from '@/utils/format-currency';
import { ListEmptyComponent, View } from '@/components';
import { useTranslation } from 'react-i18next';
import OrderInformation from './OrderInformation';
import { useOrderDetailQuery } from '@/query/queries/orders';
import { useUpdateStatusMutation } from '@/query/mutations/orders';
import { OrderItem, Status } from '@/models/Order';
import { useCallback, useEffect } from 'react';
import Menu from './Menu';
import {
  useDecreaseQtyMutation,
  useDeleteMutation,
  useIncreaseQtyMutation,
} from '@/query/mutations/order-items';
import useStyles from './style';
import Toast from 'react-native-root-toast';

type Props = NativeStackScreenProps<StackParamList, 'OrderDetail'>;

function OrderDetail({ route, navigation }: Props) {
  const { order: orderParam } = route.params;
  const { mutate: increaseQtyMutate } = useIncreaseQtyMutation();
  const { mutate: decreaseQtyMutate } = useDecreaseQtyMutation();
  const { mutate: updateStatusMutate } = useUpdateStatusMutation();
  const { mutate: deleteItemMutate } = useDeleteMutation();

  const { t } = useTranslation();
  const styles = useStyles();
  const { data: order, isLoading } = useOrderDetailQuery(orderParam.id);
  const { items, id, status } = order || {};
  const { setOptions } = navigation;

  const total = order
    ? order.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    : 0;

  const cancel = useCallback(() => {
    Alert.alert(t('common.confirmation'), 'Are you sure to cancel', [
      {
        text: t('common.yes'),
        onPress() {
          updateStatusMutate({ id, status: Status.CANCELED });
        },
      },
      { text: t('common.no') },
    ]);
  }, [updateStatusMutate, id]);

  const complete = useCallback(() => {
    Alert.alert(t('common.confirmation'), 'Confirm to pay', [
      {
        text: t('common.yes'),
        onPress() {
          updateStatusMutate(
            { id, status: Status.COMPLETED },
            {
              onSuccess() {},
            },
          );
        },
      },
      { text: t('common.no') },
    ]);
  }, [updateStatusMutate, id]);

  function onDecreaseQty(item: OrderItem) {
    if (item.quantity === 1) {
      Alert.alert('Confirmation', 'Are you sure', [
        {
          text: 'OK',
          onPress: () =>
            decreaseQtyMutate({ odId: order?.id as number, odItem: item }),
        },
        { text: 'Cancel' },
      ]);
    } else {
      decreaseQtyMutate({ odId: order?.id as number, odItem: item });
    }
  }

  function onIncreaseQty(odItem: OrderItem) {
    increaseQtyMutate({ odId: order?.id as number, odItem });
  }

  function onItemPress(orderItem: OrderItem) {
    const { product } = orderItem;
    navigation.navigate('ProductStacks', {
      screen: 'ProductDetail',
      params: {
        orderId: order?.id,
        productId: product.id,
        productName: product.name,
        orderItem: orderItem ? orderItem : { product, quantity: 1 },
      },
    } as any);
  }

  function onDeleteItem(item: OrderItem) {
    deleteItemMutate(
      { orderId: order?.id as number, id: item.id },
      {
        onSuccess() {
          Toast.show(
            t('common.delete').concat(' ').concat(t('common.success')),
          );
        },
      },
    );
  }

  useEffect(() => {
    setOptions({
      headerRight({ tintColor }) {
        return (
          <Menu
            tintColor={tintColor as string}
            cancel={cancel}
            complete={complete}
          />
        );
      },
    });
  }, [setOptions, cancel, complete]);

  return (
    <View white flex-1>
      <FlatList
        {...(order
          ? {
              ListHeaderComponent: <OrderInformation order={order} />,
            }
          : {})}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={
          <ListEmptyComponent icon="cube-outline" text="Order is empty" />
        }
        style={{ flexGrow: 1 }}
        data={items as any}
        renderItem={({ item }) => (
          <OrderDetailItem
            onPress={onItemPress}
            item={item}
            onIncreaseQty={onIncreaseQty}
            onDecreaseQty={onDecreaseQty}
            onRemove={onDeleteItem}
          />
        )}
      />

      <View p-lg>
        <View row space-between mb-md>
          <Text h4>{t('common.discount')}</Text>
          <Text h4>0</Text>
        </View>
        <View row space-between>
          <Text h4>{t('common.total')}</Text>
          <Text h4>{formatCurrency(total)}</Text>
        </View>
      </View>

      {[Status.CREATED, Status.INPROGRESS].includes(order?.status as Status) ? (
        <Button
          disabled={isLoading}
          containerStyle={styles.addButton}
          onPress={() => {
            navigation.navigate('ProductStacks', {
              screen: 'Products',
              params: { orderId: order?.id },
            } as any);
          }}>
          {t('common.add')}
        </Button>
      ) : null}
    </View>
  );
}

export default OrderDetail;
