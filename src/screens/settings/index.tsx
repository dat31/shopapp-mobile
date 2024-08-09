import { View } from '@/components';
import { Button } from '@rneui/themed';
import auth from '@react-native-firebase/auth';

type Props = {};

function Settings(props: Props) {
  return (
    <View>
      <Button
        onPress={() => {
          auth().signOut();
        }}>
        SignOut
      </Button>
    </View>
  );
}

export default Settings;
