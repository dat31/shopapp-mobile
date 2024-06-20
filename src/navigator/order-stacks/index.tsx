import { Order } from '@/models/Order';
import OrderDetail from '@/screens/order-detail';
import Orders from '@/screens/orders';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@rneui/themed';
import ProductStacks, {
  StackParamList as PrdStackParamList,
} from '../product-stacks';

export type StackParamList = {
  Orders: {};
  OrderDetail: { order: Order };
  ProductStacks: PrdStackParamList & { Products: { orderId: number } };
};

const Stack = createNativeStackNavigator<StackParamList>();

function OrderStacks() {
  const {
    theme: { colors },
  } = useTheme();
  return (
    <Stack.Navigator
      initialRouteName="Orders"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        statusBarColor: colors.primary,
        headerShadowVisible: false,
      }}>
      <Stack.Screen name="Orders" component={Orders} />
      <Stack.Screen name="OrderDetail" component={OrderDetail} />
      <Stack.Screen
        name="ProductStacks"
        component={ProductStacks}
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
}

export default OrderStacks;
