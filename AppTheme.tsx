import { createTheme, ThemeProvider } from '@rneui/themed';
import { PropsWithChildren } from 'react';

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
        placeholderTextColor: theme.colors.grey5,
      };
    },
  },
});

function AppTheme(props: PropsWithChildren) {
  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
}

export default AppTheme;
