import { Product } from '@/models/Product';
import ProductDetail from '@/screens/product-detail';

import Products from '@/screens/products';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@rneui/themed';

export type StackParamList = {
  Products: {};
  ProductDetail: { productId: Product['id']; productName: Product['name'] };
};

const Stack = createNativeStackNavigator<StackParamList>();

function ProductStacks() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      initialRouteName="Products"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.white,
        statusBarColor: theme.colors.primary,
        headerShadowVisible: false,
      }}>
      <Stack.Screen name="Products" component={Products} />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetail}
        options={({ route }) => ({ title: route.params.productName })}
      />
    </Stack.Navigator>
  );
}

export default ProductStacks;
