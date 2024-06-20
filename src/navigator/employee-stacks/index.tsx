import { Order } from '@/models/Order';
import EmployeeDetail from '@/screens/employee-detail';
import Employees from '@/screens/employees';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@rneui/themed';

export type StackParamList = {
  Employees: {};
  EmployeeDetail: { id: Order };
};

const Stack = createNativeStackNavigator<StackParamList>();

function EmployeeStacks() {
  const {
    theme: { colors },
  } = useTheme();
  return (
    <Stack.Navigator
      initialRouteName="Employees"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        statusBarColor: colors.primary,
        headerShadowVisible: false,
      }}>
      <Stack.Screen name="Employees" component={Employees} />
      <Stack.Screen name="EmployeeDetail" component={EmployeeDetail} />
    </Stack.Navigator>
  );
}

export default EmployeeStacks;
