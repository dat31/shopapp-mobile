import { User } from '@/models/User';
import EmployeeDetail from '@/screens/employee-detail';
import EmployeeEdit from '@/screens/employee-edit';
import Employees from '@/screens/employees';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@rneui/themed';

export type StackParamList = {
  Employees: {};
  EmployeeDetail: { id: User['id']; name: User['name'] };
  EmployeeEdit: { id: User['id'] };
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
      <Stack.Screen
        name="EmployeeDetail"
        component={EmployeeDetail}
        options={({ route }) => ({ title: route.params.name })}
      />
      <Stack.Screen name="EmployeeEdit" component={EmployeeEdit} />
    </Stack.Navigator>
  );
}

export default EmployeeStacks;
