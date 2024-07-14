import { Dialog, Input, ListItem } from '@rneui/themed';
import { useState } from 'react';
import { TouchableHighlight, TouchableOpacity } from 'react-native';

type Props<T> = {
  label: string;
  options: T[];
  value: T;
  getLabel: (item: T) => string;
  getKey: (item: T) => string;
  onChange: (item: T) => void;
};

function PickerSelect<T>({
  label,
  value,
  getLabel,
  options,
  getKey,
  onChange,
}: Props<T>) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setIsVisible(true);
        }}>
        <Input label={label} readOnly value={getLabel(value)} />
      </TouchableOpacity>
      <Dialog
        isVisible={isVisible}
        onBackdropPress={() => {
          setIsVisible(prev => !prev);
        }}>
        {options.map(item => (
          <ListItem
            key={getKey(item)}
            Component={TouchableHighlight}
            onPress={() => {
              onChange(item);
              setIsVisible(false);
            }}>
            <ListItem.Content>
              <ListItem.Title>{getLabel(item)}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </Dialog>
    </>
  );
}

export default PickerSelect;
