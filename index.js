/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import './src/i18';
import { init } from '@/services/fcm';
import 'react-native-gesture-handler';

init();
LogBox.ignoreLogs([`ReactImageView: Image source "null" doesn't exist`]);

AppRegistry.registerComponent(appName, () => App);
