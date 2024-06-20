import { Icon, Text, makeStyles, useTheme } from '@rneui/themed';
import View from '../View';

type Props = {
  qty: number;
  onDecrease: () => void;
  onIncrease: () => void;
  isLg?: boolean;
};

function QtyModifier({ qty, onIncrease, onDecrease, isLg }: Props) {
  const {
    theme: { colors },
  } = useTheme();
  const styles = useStyles({ isLg });
  const iconProps = isLg ? { color: colors.white } : {};
  return (
    <View style={styles.root}>
      <Icon
        {...iconProps}
        name="remove"
        type="ionic"
        disabled={qty === 0}
        disabledStyle={{ backgroundColor: 'transparent' }}
        onPress={onDecrease}
        style={styles.icon}
      />
      <Text>{qty}</Text>
      <Icon
        {...iconProps}
        style={styles.icon}
        name="add"
        type="ionic"
        onPress={onIncrease}
      />
    </View>
  );
}

const useStyles = makeStyles(
  ({ spacing, colors }, { isLg }: Pick<Props, 'isLg'>) => {
    return {
      root: {
        ...(isLg ? { justifyContent: 'center' } : {}),
        flexDirection: 'row',
        alignItems: 'center',
        gap: isLg ? spacing.xl : spacing.md,
      },
      icon: isLg
        ? {
            borderRadius: spacing.sm,
            color: colors.white,
            backgroundColor: colors.primary,
            padding: spacing.sm,
          }
        : {},
    };
  },
);

export default QtyModifier;
