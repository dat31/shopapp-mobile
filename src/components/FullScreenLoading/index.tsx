import { ActivityIndicator } from 'react-native';
import View from '../View';
import { useTheme } from '@rneui/themed';

export default function FullScreenLoading() {
  const { theme } = useTheme();
  return (
    <View flex-1 justify-center items-center>
      <ActivityIndicator color={theme.colors.primary} size={'large'} />
    </View>
  );
}
