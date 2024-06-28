/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import './src/i18';
import { init } from '@/services/fcm';

init();

AppRegistry.registerComponent(appName, () => App);
