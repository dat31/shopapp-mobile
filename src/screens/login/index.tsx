import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { Button, Input } from '@rneui/themed';

function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>();
  const [confirmation, setConfirmation] =
    useState<FirebaseAuthTypes.ConfirmationResult>();
  const [code, setCode] = useState('');

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
      setInitializing(false);
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <View>
        <Input label="Code" value={code} onChangeText={t => setCode(t)} />
        <Button
          onPress={() => {
            auth()
              .signInWithPhoneNumber('+84868104024')
              .then(setConfirmation)
              .catch(er => {
                console.log(er);
              });
          }}>
          login
        </Button>
        <Button
          onPress={() => {
            confirmation?.confirm(code).catch(er => {
              console.log(er);
            });
          }}>
          confirm code
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
