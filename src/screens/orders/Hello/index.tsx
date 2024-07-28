import { View } from '@/components';
import { statusOptions } from '@/constants/order';
import { Status } from '@/models/Order';
import { Text } from '@rneui/themed';
import { useRef } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

function Hello() {
  const ref = useRef();
  return (
    <View style={{ backgroundColor: 'red' }}>
      <RNPickerSelect
        style={{
          viewContainer: {
            maxHeight: 0,
          },
        }}
        pickerProps={
          {
            ref,
          } as any
        }
        items={statusOptions}
        value={null}
        onValueChange={v => {
          console.log(v);
        }}>
        <View style={{ height: 0 }}></View>
      </RNPickerSelect>
      <TouchableWithoutFeedback
        onPress={() => {
          console.log('press');
          console.log((ref?.current as any).pickerRef.current);
          (ref?.current as any).pickerRef.current.focus();
        }}>
        <Text h4>hello</Text>
      </TouchableWithoutFeedback>
    </View>
  );
}

export default Hello;
