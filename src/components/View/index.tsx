import { ThemeSpacing, makeStyles, withTheme, Colors } from '@rneui/themed';
import { StyleSheet, ViewProps } from 'react-native';
import { View as RNView } from 'react-native';

type Props = {
  row?: boolean;
  'space-between'?: boolean;
  'justify-center'?: boolean;
  'items-center'?: boolean;
} & ViewProps &
  ThemeColor;

type ThemeColor = {
  [k in keyof Colors]?: boolean;
};

function View(props: Props) {
  const styles = useStyles(props);
  return <RNView {...props} style={[styles.view, props.style]} />;
}

const useStyles = makeStyles((theme, { row, ...props }: Props) => {
  const spacingClasses = getSpacingClasses(Object.keys(theme.spacing));

  const spacingStyles = spacingClasses.reduce((acc, cl: string) => {
    const spacing = theme.spacing[cl.split('-')[1] as keyof ThemeSpacing];
    if (cl.charAt(0) === 'p') {
      return {
        ...acc,
        [cl]: {
          [`padding${mapAlphaToDirection(cl.charAt(1))}`]: spacing,
        },
      };
    }
    return {
      ...acc,
      [cl]: {
        [`margin${mapAlphaToDirection(cl.charAt(1))}`]: spacing,
      },
    };
  }, {});

  const viewSpacingStyles = Object.keys(props).reduce((acc, key) => {
    const styleObj: object = spacingStyles[key as keyof typeof spacingStyles];
    if (styleObj) {
      return { ...acc, ...styleObj };
    }
    return acc;
  }, {});

  const bg = Object.keys(theme.colors).find(c =>
    Object.keys(props).includes(c),
  );

  const viewBgStyle = bg
    ? { backgroundColor: theme.colors[bg as keyof Colors] }
    : ({} as StyleSheet.NamedStyles<{}>);

  const flexStyle = Object.keys(props).some(k => k.includes('flex-'))
    ? {
        flex: Number(
          Object.keys(props)
            .find(p => p.includes('flex-'))
            ?.split('-')[1],
        ),
      }
    : ({} as StyleSheet.NamedStyles<{}>);

  const flexGrowStyle = Object.keys(props).some(k => k.includes('flexGrow-'))
    ? {
        flexGrow: Number(
          Object.keys(props)
            .find(p => p.includes('flexGrow-'))
            ?.split('-')[1],
        ),
      }
    : ({} as StyleSheet.NamedStyles<{}>);

  return {
    view: {
      ...(row ? { flexDirection: 'row' } : {}),
      ...(props['space-between'] ? { justifyContent: 'space-between' } : {}),
      ...(props['justify-center'] ? { justifyContent: 'center' } : {}),
      ...(props['items-center'] ? { alignItems: 'center' } : {}),
      ...viewSpacingStyles,
      ...viewBgStyle,
      ...flexStyle,
      ...flexGrowStyle,
    },
  };
});

function mapAlphaToDirection(alpha: string) {
  switch (alpha) {
    case 't':
      return 'Top';
    case 'b':
      return 'Bottom';
    case 'r':
      return 'Right';
    case 'l':
      return 'Left';
    case 'h':
      return 'Horizontal';
    case 'v':
      return 'Vertical';
    default:
      return '';
  }
}

const spacing = ['p', 'm'];
const direction = ['t', 'b', 'l', 'r', 'h', 'v'];

function getSpacingClasses(themeSpacing: string[]) {
  const [p, m] = spacing;

  const pClass = direction.reduce(
    (acc, d, idx) =>
      acc.concat(
        themeSpacing
          .map(size => `${p}${d}-${size}`)
          .concat(
            idx === direction.length - 1
              ? themeSpacing.map(size => `${p}-${size}`)
              : [],
          ) as any,
      ),
    [],
  );

  const mClass = direction.reduce(
    (acc, d, idx) =>
      acc.concat(
        themeSpacing
          .map(size => `${m}${d}-${size}`)
          .concat(
            idx === direction.length - 1
              ? themeSpacing.map(size => `${p}-${size}`)
              : [],
          ) as any,
      ),
    [],
  );

  return pClass.concat(mClass);
}

export default View;
