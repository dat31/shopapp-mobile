import Settings from '@/screens/settings';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@rneui/themed';

export type StackParamList = {
  Settings: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

function SettingStacks() {
  const { theme } = useTheme();
  return (
    <Stack.Navigator
      initialRouteName="Settings"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.white,
        statusBarColor: theme.colors.primary,
        headerShadowVisible: false,
      }}>
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
}

export default SettingStacks;
