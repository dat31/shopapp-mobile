import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNav from './auth-nav';
import { NavigationContainer } from '@react-navigation/native';
import { useUser } from '@/query/queries/auth';
import UnAuthNav from './unauth-nav';

type StackParamList = {
  AuthNav: {};
  UnAuthNav: {};
};

const { Navigator, Screen } = createNativeStackNavigator<StackParamList>();

function RootNav() {
  const { data: user } = useUser();

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
