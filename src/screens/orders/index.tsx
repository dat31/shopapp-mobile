import { FlatList, View } from 'react-native';
import OrderItem from './OrderItem';
import { Order } from '@/models/Order';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamList } from '@/navigator/order-stacks';
import { useOrdersQuery } from '@/query/queries/orders';

type Props = NativeStackScreenProps<StackParamList, 'Orders'>;

function Orders({ navigation }: Props) {
  const { navigate } = navigation;
  const { data } = useOrdersQuery();

  function onItemPress(item: Order) {
    navigate('OrderDetail', { order: item });
  }

  return (
    <View>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <OrderItem item={item} onPress={onItemPress} />
        )}
      />
    </View>
  );
}

export default Orders;
