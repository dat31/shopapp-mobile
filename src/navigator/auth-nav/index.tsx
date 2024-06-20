import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import OrderStacks from '../order-stacks';
import ProductStacks from '../product-stacks';
import { Icon } from '@rneui/base';
import EmployeeStacks from '../employee-stacks';
import SettingStacks from '../setting-stacks';

const Tab = createBottomTabNavigator();

function AuthNav() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="OrderStacks"
        component={OrderStacks}
        options={{
          tabBarIcon: getTabIcon('receipt-outline'),
        }}
      />
      <Tab.Screen
        options={{
          tabBarIcon: getTabIcon('cube-outline'),
        }}
        name="ProductStacks"
        component={ProductStacks}
      />
      <Tab.Screen
        options={{
          tabBarIcon: getTabIcon('people-outline'),
        }}
        name="EmployeeStacks"
        component={EmployeeStacks}
      />
      <Tab.Screen
        options={{
          tabBarIcon: getTabIcon('stats-chart-outline'),
        }}
        name="Profit"
        component={SettingStacks}
      />
      <Tab.Screen
        options={{
          tabBarIcon: getTabIcon('settings-outline'),
        }}
        name="SettingStacks"
        component={SettingStacks}
      />
    </Tab.Navigator>
  );
}

function getTabIcon(name: string) {
  return ({ size, color }: { size: number; color: string }) => (
    <Icon size={size} color={color} name={name} type="ionicon" />
  );
}

export default AuthNav;
