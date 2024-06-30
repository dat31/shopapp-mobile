import Login from '@/screens/login';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

type StackParamList = {
  Login: {};
};

const Stack = createNativeStackNavigator<StackParamList>();

function UnAuthNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
}

export default UnAuthNav;
