import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import { type PermissionStatus } from 'react-native';

export async function requestUserPermission() {
  if (Platform.OS === 'android') {
    const version = Platform.Version;
    if (version >= 33) {
      return PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    }
  }

  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

export async function init() {
  await messaging().registerDeviceForRemoteMessages();
  const token = await messaging().getToken();
  messaging().onMessage(async remoteMessage => {
    console.log(remoteMessage);
  });
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log(remoteMessage);
  });
  console.log('token', token);
}
