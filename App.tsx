import { createContext, useEffect } from 'react';
import RootNav from './src/navigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { createStore } from 'zustand';
import { QueryClientProvider } from 'react-query';
import { RootSiblingParent } from 'react-native-root-siblings';
import notifee from '@notifee/react-native';
import { requestUserPermission } from '@/services/fcm';
import queryClient from '@/query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import useSocket from '@/hooks/useSocket';
import AppTheme from './AppTheme';

enableScreens(true);

const store = createStore();
const Ctx = createContext({});

function App(): React.JSX.Element {
  useSocket();

  useEffect(() => {
    requestUserPermission();
    async function onDisplayNotification() {
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });
      await notifee.displayNotification({
        title: 'Notification Title',
        body: 'Body of the notification',
        android: {
          channelId,
          // smallIcon: 'small-icon',
        },
      });
    }
    onDisplayNotification();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootSiblingParent>
        <QueryClientProvider client={queryClient}>
          <AppTheme>
            <Ctx.Provider value={store}>
              <SafeAreaProvider>
                <RootNav />
              </SafeAreaProvider>
            </Ctx.Provider>
          </AppTheme>
        </QueryClientProvider>
      </RootSiblingParent>
    </GestureHandlerRootView>
  );
}

export default App;
