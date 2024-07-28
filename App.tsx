import { createContext, useEffect } from 'react';
import RootNav from './src/navigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { createStore } from 'zustand';
import { ThemeProvider, createTheme } from '@rneui/themed';
import { QueryClientProvider } from 'react-query';
import { RootSiblingParent } from 'react-native-root-siblings';
import { io } from 'socket.io-client';
import { AppState, StatusBar } from 'react-native';
import notifee from '@notifee/react-native';
import { requestUserPermission } from '@/services/fcm';
import queryClient from '@/query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

enableScreens(true);

const store = createStore();
const Ctx = createContext({});

const theme = createTheme({
  components: {
    ListItem(_, { spacing }) {
      return {
        containerStyle: {
          paddingHorizontal: 16,
          paddingVertical: spacing.lg,
        },
      };
    },
    Icon: () => ({ name: 'ionicon' }),
    Text: (props, theme) => ({
      h4Style: {
        fontSize: 20,
      },
      style: {
        color: theme.colors.grey0,
        fontSize: 16,
        ...(props.bold ? { fontWeight: 'bold' } : {}),
        ...(props.primary ? { color: theme.colors.primary } : {}),
      },
    }),
    Input(props, theme) {
      return {
        labelStyle: { color: theme.colors.grey1 },
        placeholder: `type ${props.label?.toString().toLowerCase()}`,
        errorStyle: {
          marginStart: 0,
        },
        inputStyle: {
          paddingStart: 0,
        },
        inputContainerStyle: {
          borderBottomWidth: 0,
        },
      };
    },
  },
});
function App(): React.JSX.Element {
  useEffect(() => {
    const ws = io('http://10.0.2.2:3000');
    ws.on('connect', () => {});
    ws.on('events', data => {});
    ws.on('disconnect', () => {});
    AppState.addEventListener('change', state => {
      if (state === 'background') {
        console.log(ws.active);
        ws.connect();
      }
    });
  }, []);

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
          <ThemeProvider theme={theme}>
            <Ctx.Provider value={store}>
              <SafeAreaProvider>
                <RootNav />
              </SafeAreaProvider>
            </Ctx.Provider>
          </ThemeProvider>
        </QueryClientProvider>
      </RootSiblingParent>
    </GestureHandlerRootView>
  );
}

export default App;
