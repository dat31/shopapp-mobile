import { StyleSheet, ViewProps } from 'react-native';
import View from '../View';

function Backdrop(props: ViewProps) {
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          backgroundColor: 'black',
          width: '100%',
          height: '100%',
          zIndex: 999,
        },
      ]}
      {...props}
    />
  );
}

export default Backdrop;
