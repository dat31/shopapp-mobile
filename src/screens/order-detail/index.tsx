import { StackParamList } from '@/navigator/order-stacks';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alert, FlatList, TouchableHighlight } from 'react-native';
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
  useIncreaseQtyMutation,
} from '@/query/mutations/order-items';
import useStyles from './style';

type Props = NativeStackScreenProps<StackParamList, 'OrderDetail'>;

function OrderDetail({ route, navigation }: Props) {
  const { order: orderParam } = route.params;
  const { mutate: increaseQtyMutate } = useIncreaseQtyMutation();
  const { mutate: decreaseQtyMutate } = useDecreaseQtyMutation();
  const { mutate: updateStatusMutate } = useUpdateStatusMutation();

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
          updateStatusMutate({ id, status: Status.COMPLETED });
        },
      },
      { text: t('common.no') },
    ]);
  }, [updateStatusMutate, id]);

  function onDecreaseQty(odItem: OrderItem) {
    decreaseQtyMutate({ odId: order?.id as number, odItem });
  }

  function onIncreaseQty(odItem: OrderItem) {
    increaseQtyMutate({ odId: order?.id as number, odItem });
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
            item={item}
            onIncreaseQty={onIncreaseQty}
            onDecreaseQty={onDecreaseQty}
            onRemove={() => {}}
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
