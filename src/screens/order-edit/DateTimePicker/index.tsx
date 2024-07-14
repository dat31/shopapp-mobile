import RNDateTimePicker from '@react-native-community/datetimepicker';
import { Input } from '@rneui/themed';
import { format } from 'date-fns';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableHighlight, TouchableOpacity } from 'react-native';

type Props = {
  value: string;
  onChange: (value: Date | undefined) => void;
};

export default function DateTimePicker({ value, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          console.log('press');
          setIsOpen(true);
        }}>
        <Input
          label={t('order.time')}
          readOnly
          value={value ? format(value, 'HH:mm') : ''}
        />
      </TouchableOpacity>
      {isOpen && (
        <RNDateTimePicker
          onChange={(_, date) => {
            setIsOpen(false);

            onChange(date);
          }}
          value={new Date(value)}
          mode="time"
        />
      )}
    </>
  );
}
