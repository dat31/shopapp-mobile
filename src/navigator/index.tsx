import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNav from './auth-nav';
import { NavigationContainer } from '@react-navigation/native';
import UnAuthNav from './unauth-nav';
import { useAuth } from '@/hooks';

type StackParamList = {
  AuthNav: {};
  UnAuthNav: {};
};

const { Navigator, Screen } = createNativeStackNavigator<StackParamList>();

function RootNav() {
  const { user } = useAuth();
  return (
    <NavigationContainer>
      <Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {user ? (
          <Screen name="AuthNav" component={AuthNav} />
        ) : (
          <Screen name="UnAuthNav" component={UnAuthNav} />
        )}
      </Navigator>
    </NavigationContainer>
  );
}

export default RootNav;
