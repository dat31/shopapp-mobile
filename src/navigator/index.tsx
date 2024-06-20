import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNav from './auth-nav';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { useTheme } from '@rneui/themed';

const { Navigator, Screen } = createNativeStackNavigator();

function RootNav() {
  const { theme } = useTheme();

  return (
    <>
      {/* <StatusBar backgroundColor={theme.colors.primary} /> */}
      <NavigationContainer>
        <Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <Screen name="AuthNav" component={AuthNav} />
        </Navigator>
      </NavigationContainer>
    </>
  );
}

export default RootNav;
