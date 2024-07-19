import { FirebaseAuthTypes } from '@react-native-firebase/auth/lib/index';

export type User = FirebaseAuthTypes.User;

export enum Role {
  MANAGER = 'MANAGER',
  WAITER = 'WAITER',
  CHEF = 'CHEF',
}
