import RNDateTimePicker, {
  AndroidNativeProps,
  IOSNativeProps,
} from '@react-native-community/datetimepicker';
import { Input, InputProps } from '@rneui/themed';
import { format } from 'date-fns';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';

type Props = {
  value: Date;
  label: string;
  onChange: (value: Date | undefined) => void;
  inputProps?: InputProps;
  pickerProps?: Partial<AndroidNativeProps> | Partial<IOSNativeProps>;
};

export default function DateTimePicker({
  value,
  onChange,
  inputProps,
  pickerProps,
  label,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setIsOpen(true);
        }}>
        <Input
          label={label}
          readOnly
          value={value ? format(value, 'HH:mm') : ''}
          {...inputProps}
        />
      </TouchableOpacity>
      {isOpen && (
        <RNDateTimePicker
          value={value}
          onChange={(_, date) => {
            setIsOpen(false);
            onChange(date);
          }}
          mode="time"
          {...(pickerProps as any)}
        />
      )}
    </>
  );
}
