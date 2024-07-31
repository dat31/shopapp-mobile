import { User } from '@/models/User';
import EmployeeDetail from '@/screens/employee-detail';
import EmployeeEdit from '@/screens/employee-edit';
import EmployeeSchedules from '@/screens/employee-schedules';
import Employees from '@/screens/employees';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@rneui/themed';

export type StackParamList = {
  Employees: {};
  EmployeeDetail: { uid: User['uid']; displayName: User['displayName'] };
  EmployeeEdit: { uid: User['uid'] };
  EmployeeSchedules: {};
};

const { Navigator, Screen } = createNativeStackNavigator<StackParamList>();

function EmployeeStacks() {
  const {
    theme: { colors },
  } = useTheme();
  return (
    <Navigator
      initialRouteName="Employees"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        statusBarColor: colors.primary,
        headerShadowVisible: false,
      }}>
      <Screen name="Employees" component={Employees} />
      <Screen
        name="EmployeeDetail"
        component={EmployeeDetail}
        options={({ route }) => ({ title: route.params.displayName as string })}
      />
      <Screen name="EmployeeEdit" component={EmployeeEdit} />
      <Screen name="EmployeeSchedules" component={EmployeeSchedules} />
    </Navigator>
  );
}

export default EmployeeStacks;
