import { Order, Status } from '@/models/Order';
import formatCurrency from '@/utils/format-currency';
import { Avatar, ListItem, Text, makeStyles } from '@rneui/themed';
import { format } from 'date-fns';
import { TouchableHighlight } from 'react-native';

type Props = {
  item: Order;
  onPress: (item: Order) => void;
};

function OrderItem({ item, onPress }: Props) {
  const styles = useStyles(item.status);

  return (
    <ListItem
      bottomDivider
      Component={TouchableHighlight}
      onPress={() => {
        onPress(item);
      }}>
      <Avatar
        title={item.id.toString()}
        size={40}
        containerStyle={styles.avt}
      />
      <ListItem.Content>
        <ListItem.Title>
          {format(new Date(item.orderDate), 'HH:mm')}
        </ListItem.Title>
        <ListItem.Subtitle>
          {formatCurrency(
            item.items?.reduce(
              (acc, item) => acc + item.price * item.quantity,
              0,
            ),
          )}
        </ListItem.Subtitle>
      </ListItem.Content>
      <Text style={styles.status}>{item.status}</Text>
    </ListItem>
  );
}

const useStyles = makeStyles((theme, status: Order['status']) => {
  const { colors } = theme;
  function getBgColor() {
    switch (status) {
      case Status.INPROGRESS:
        return colors.primary;
      case Status.CANCELED:
        return colors.error;
      case Status.COMPLETED:
        return colors.success;
      case Status.CREATED:
        return colors.grey3;
    }
  }

  return {
    avt: {
      backgroundColor: theme.colors.primary,
    },
    status: {
      backgroundColor: getBgColor(),
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      color: theme.colors.white,
      borderRadius: theme.spacing.lg,
      marginTop: theme.spacing.xs,
      fontSize: 14,
      alignSelf: 'flex-start',
    },
    chevron: {
      padding: theme.spacing.sm,
    },
    orderIndex: {
      fontWeight: 'bold',
      fontSize: 18,
    },
  };
});

export default OrderItem;
