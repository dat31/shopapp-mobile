import { createContext } from 'react';
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
      style: props.bold ? { fontWeight: 'bold' } : {},
      h4Style: {
        fontSize: 16,
      },
    }),
  },
});

function App(): React.JSX.Element {
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
