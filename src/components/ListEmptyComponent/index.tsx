import { Icon, Text, useTheme } from '@rneui/themed';
import View from '../View';

type Props = {
  text: string;
  icon: string;
};

function ListEmptyComponent({ icon, text }: Props) {
  const { theme } = useTheme();
  return (
    <View justify-center items-center flexGrow-1>
      <Icon name={icon} type="ionicon" size={48} color={theme.colors.grey3} />
      <Text h4 style={{ color: theme.colors.grey3 }}>
        {text}
      </Text>
    </View>
  );
}

export default ListEmptyComponent;
