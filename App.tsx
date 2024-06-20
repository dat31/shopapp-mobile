import { createContext, useEffect } from 'react';
import RootNav from './src/navigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { createStore } from 'zustand';
import { ThemeProvider, createTheme } from '@rneui/themed';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RootSiblingParent } from 'react-native-root-siblings';

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
  useEffect(() => {});

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
