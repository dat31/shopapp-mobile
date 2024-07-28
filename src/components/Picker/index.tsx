import { Text, useTheme } from '@rneui/themed';
import View from '../View';
import RNPickerSelect, { PickerSelectProps } from 'react-native-picker-select';
import { useTranslation } from 'react-i18next';

type Props<T> = {
  data: T[];
  getLabel: (item: T) => string;
  getValue: (item: T) => any;
  label: string;
  onChange: (v: any, index: number) => void;
  value: any;
} & Omit<PickerSelectProps, 'items' | 'onValueChange'>;

function Picker<T>({
  data,
  onChange,
  value,
  label,
  getLabel,
  getValue,
  ...props
}: Props<T>) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  return (
    <View style={{ marginBottom: theme.spacing.md }}>
      <Text
        style={{
          color: theme.colors.grey1,
          marginLeft: theme.spacing.lg,
          marginBottom: theme.spacing.sm,
        }}
        bold>
        {label}
      </Text>
      <RNPickerSelect
        useNativeAndroidPickerStyle={false}
        placeholder={{ label: `Select ${label}`, value: null }}
        value={value}
        style={{
          viewContainer: {
            marginHorizontal: theme.spacing.sm,
          },
          inputAndroid: {
            marginHorizontal: 8,
            backgroundColor: theme.colors.white,
            color: theme.colors.grey0,
            fontSize: 16,
          },
          chevron: { backgroundColor: theme.colors.grey0 },
        }}
        items={data?.map((item: T) => ({
          label: getLabel(item),
          value: getValue(item),
        }))}
        onValueChange={onChange}
        {...props}
      />
    </View>
  );
}

export default Picker;
