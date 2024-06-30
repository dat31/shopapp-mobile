import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { PermissionsAndroid } from 'react-native';
import { type PermissionStatus } from 'react-native';
import notifee from '@notifee/react-native';

export async function requestUserPermission() {
  if (Platform.OS === 'android') {
    const version = Platform.Version;
    if (version >= 33) {
      const permission: PermissionStatus = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      return permission === 'granted';
    }
    return true;
  }

  const authStatus = await messaging().requestPermission();
  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
}

export async function init() {
  await messaging().registerDeviceForRemoteMessages();
  const token = await messaging().getToken();
  messaging().onMessage(async remoteMessage => {
    console.log(remoteMessage);
    // notifee.displayNotification({
    //   title: remoteMessage?.notification?.title as string,
    //   body: remoteMessage.notification?.body,
    //   android: {
    //     channelId: 'default',
    //     // smallIcon: 'small-icon',
    //   },
    // });
  });
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log(remoteMessage);
  });
  console.log('token', token);
}
