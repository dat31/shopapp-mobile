import { createContext, useEffect } from 'react';
import RootNav from './src/navigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { createStore } from 'zustand';
import { ThemeProvider, createTheme } from '@rneui/themed';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RootSiblingParent } from 'react-native-root-siblings';
import { io } from 'socket.io-client';
import { AppState } from 'react-native';

enableScreens(true);

const store = createStore();
const Ctx = createContext({});
const theme = createTheme({
  components: {
    Icon: () => ({ name: 'ionicon' }),
    Text: props => ({
      h4Style: {
        fontSize: 16,
      },
      style: {
        fontSize: 16,
        ...(props.bold ? { fontWeight: 'bold' } : {}),
      },
    }),
    Input(props, theme) {
      return {
        errorStyle: {
          marginStart: 0,
        },
        inputStyle: {
          paddingStart: 0,
        },
      };
    },
  },
});

function App(): React.JSX.Element {
  useEffect(() => {
    const ws = io('http://10.0.2.2:3000');
    ws.on('connect', () => {
      console.log('connect');
    });
    ws.on('events', data => {
      console.log(data);
    });
    ws.on('disconnect', () => {
      console.log('disconnect');
    });
    AppState.addEventListener('change', state => {
      if (state === 'background') {
        console.log(ws.active);
        ws.connect();
      }
    });
  }, []);

  return (
    <RootSiblingParent>
      <QueryClientProvider client={new QueryClient()}>
        <ThemeProvider theme={theme}>
          <Ctx.Provider value={store}>
            <SafeAreaProvider>
              <RootNav />
            </SafeAreaProvider>
          </Ctx.Provider>
        </ThemeProvider>
      </QueryClientProvider>
    </RootSiblingParent>
  );
}

export default App;
