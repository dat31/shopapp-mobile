import { Icon, Text, makeStyles } from '@rneui/themed';
import View from '../View';

type Props<T> = {
  qty: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

function QtyModifier<T extends { quantity: number }>({
  qty,
  onIncrease,
  onDecrease,
}: Props<T>) {
  const styles = useStyles();
  return (
    <View style={styles.qtyModify}>
      <Icon name="remove" type="ionic" onPress={onDecrease} />
      <Text>{qty}</Text>
      <Icon name="add" type="ionic" onPress={onIncrease} />
    </View>
  );
}

const useStyles = makeStyles(theme => {
  return {
    qtyModify: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
  };
});

export default QtyModifier;
