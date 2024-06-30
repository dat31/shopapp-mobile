import { View } from '@/components';
import { useSignInMutation } from '@/query/mutations/auth';
import { Button, Text } from '@rneui/themed';

function Login() {
  const { mutate } = useSignInMutation();
  return (
    <View>
      <Text>login</Text>
      <Button
        onPress={() =>
          mutate({
            username: 'root',
            password: '123456',
          })
        }>
        login
      </Button>
    </View>
  );
}

export default Login;
