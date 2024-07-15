import { FlatList } from 'react-native';
import OrderItem from './OrderItem';
import { Order } from '@/models/Order';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackParamList } from '@/navigator/order-stacks';
import { useOrdersQuery } from '@/query/queries/orders';
import { Button } from '@rneui/themed';
import { View } from '@/components';
import useStyles from './styles';

type Props = NativeStackScreenProps<StackParamList, 'Orders'>;

function Orders({ navigation }: Props) {
  const { navigate } = navigation;
  const { data } = useOrdersQuery();
  const styles = useStyles();

  function onItemPress(item: Order) {
    navigate('OrderDetail', { orderId: item.id });
  }

  function onCreate() {
    navigation.navigate('OrderEdit');
  }

  return (
    <View flex-1>
      <FlatList
        style={styles.list}
        data={data}
        renderItem={({ item }) => (
          <OrderItem item={item} onPress={onItemPress} />
        )}
      />
      <View p-lg>
        <Button onPress={onCreate}>Create</Button>
      </View>
    </View>
  );
}

export default Orders;
