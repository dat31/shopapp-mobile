import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import auth from '@react-native-firebase/auth';
import { Button } from '@rneui/themed';

function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>();

  // Handle user state changes
  function onAuthStateChanged(user: any) {
    setUser(user);

    console.log('user', user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(auth => {
      setUser(auth);
      auth?.getIdTokenResult().then(idtoken => {
        console.log('idtoken', idtoken);
      });
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <View>
        <Button
          onPress={() => {
            auth()
              .signInWithPhoneNumber('+84868104024')
              .then(res => {
                res.confirm('123456');
              });
          }}>
          login
        </Button>
      </View>
    );
  }

  return (
    <View>
      <Text>Welcome </Text>
      <Button
        onPress={() => {
          auth()
            .signOut()
            .then(res => {
              console.log('signout', res);
            });
        }}>
        signout
      </Button>
    </View>
  );
}

export default App;
