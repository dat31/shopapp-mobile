import { StackParamList } from '@/navigator/order-stacks';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, FlatList, SectionList, TouchableOpacity } from 'react-native';
import OrderDetailItem from './OrderDetailItem';
import { Button, Chip, Text } from '@rneui/themed';
import formatCurrency from '@/utils/format-currency';
import { FullScreenLoading, ListEmptyComponent, View } from '@/components';
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
import { isEmpty } from 'lodash';

type Props = NativeStackScreenProps<StackParamList, 'OrderDetail'>;

function OrderDetail({ route, navigation }: Props) {
  const { orderId } = route.params;
  const { mutate: increaseQtyMutate } = useIncreaseQtyMutation();
  const { mutate: decreaseQtyMutate } = useDecreaseQtyMutation();
  const { mutate: updateStatusMutate } = useUpdateStatusMutation();
  const { mutate: deleteItemMutate } = useDeleteMutation();

  const { t } = useTranslation();
  const styles = useStyles();
  const { data: order, isLoading, isFetching } = useOrderDetailQuery(orderId);
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
          updateStatusMutate(
            { id, status: Status.CANCELED },
            {
              onSuccess() {
                Toast.show(
                  t('common.action_object_result', {
                    action: t('order.status.canceled'),
                    object: t('order.label'),
                    result: t('common.success'),
                  }),
                );
              },
            },
          );
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
              onSuccess() {
                Toast.show(
                  t('common.action_object_result', {
                    action: t('order.status.completed'),
                    object: t('order.label'),
                    result: t('common.success'),
                  }),
                );
              },
            },
          );
        },
      },
      { text: t('common.no') },
    ]);
  }, [updateStatusMutate, id]);

  const edit = useCallback(() => {
    if (!order) {
      return;
    }
    navigation.navigate('OrderEdit', { orderId });
  }, [order, navigation]);

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
            edit={edit}
          />
        );
      },
    });
  }, [setOptions, cancel, complete, edit]);

  if (isLoading || isFetching) {
    return <FullScreenLoading />;
  }

  return (
    <View bg-white flex-1>
      <SectionList<OrderItem>
        {...(order
          ? {
              ListHeaderComponent: <OrderInformation order={order} />,
            }
          : {})}
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={
          <ListEmptyComponent icon="cube-outline" text="Order is empty" />
        }
        ListFooterComponent={() => (
          <View style={{ padding: 16 }}>
            <Text h4 primary>
              Price
            </Text>
            <View row space-between mb-md style={{ alignItems: 'flex-end' }}>
              <Text>{t('common.discount')}</Text>
              <Text h4>0</Text>
            </View>
            <View row space-between mb-md style={{ alignItems: 'flex-end' }}>
              <Text>{t('common.total')}</Text>
              <Text h4>{formatCurrency(total)}</Text>
            </View>
          </View>
        )}
        style={{ flexGrow: 1 }}
        sections={[{ data: items as OrderItem[] }]}
        renderSectionHeader={({ section }) => {
          return (
            <View style={{ gap: 32 }}>
              <View
                row
                items-center
                space-between
                style={styles.prodSectionHeader}>
                <Text h4 primary>
                  {t('products.label')}
                </Text>
                {[Status.CREATED, Status.INPROGRESS].includes(
                  status as Status,
                ) ? (
                  <TouchableOpacity
                    disabled={isLoading}
                    onPress={() => {
                      navigation.navigate('ProductStacks', {
                        screen: 'OrderProducts',
                        params: { orderId: order?.id },
                      } as any);
                    }}>
                    <Text bold primary>
                      add product
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
              {isEmpty(section.data) ? (
                <View>
                  <ListEmptyComponent
                    icon="cube-outline"
                    text="Order is empty"
                  />
                </View>
              ) : null}
            </View>
          );
        }}
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
    </View>
  );
}

export default OrderDetail;
